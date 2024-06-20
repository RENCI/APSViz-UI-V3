import React, { useState, useEffect, Fragment} from 'react';
import { GeoJSON } from 'react-leaflet';
import { Marker } from 'leaflet';
import {
    getTrackData,
    getTrackGeojson
} from "@utils/hurricane/track";
import { useLayers } from '@context';

const newLayerDefaultState = () => {
    return ({
        visible: true,
        opacity: 1.0,
    });
  };

export const StormLayers = () => {

  const {
    defaultModelLayers,
    hurricaneTrackLayers,
    setHurricaneTrackLayers,
    getAllHurricaneLayersInvisible,
  } = useLayers();
  const [hurricaneData, setHurricaneData] = useState();

  const layer_list = [...defaultModelLayers];
  const topLayer = layer_list[0];
  const hurrLayers = [...hurricaneTrackLayers];

  function coneStyle() {
    return {
    fillColor: '#858585',
    weight: 2,
    opacity: 1,
    color: '#858585',
    fillOpacity: 0.2,
    dashArray: '5',
   };
  }

  function lineStyle() {
    return {
    weight: 2,
    opacity: 1,
    color: 'red',
   };
  }

  const hurrPointToLayer = ((feature, latlng) => {
    const icon_url = `${process.env.REACT_APP_HURRICANE_ICON_URL}`;
    let iconName = null;
    const L = window.L;
    const iconSize = [20, 40];
    const iconAnchor = 15;

    switch (feature.properties.storm_type) {
      default:
      case 'TD':
        iconName="dep.png";
        break;
      case 'TS':
        iconName="storm.png";
        break;
      case 'CAT1':
        iconName="cat_1.png";
        break;
      case 'CAT2':
        iconName="cat_2.png";
        break;
      case 'CAT3':
        iconName="cat_3.png";
        break;
      case 'CAT4':
        iconName="cat_4.png";
        break;
      case 'CAT5':
        iconName="cat5.png";
        break;
    }

    const url = icon_url + iconName;
    const icon = L.icon({
      iconUrl: url,
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconAnchor, iconAnchor],
      popupAnchor: [0, 0],
    });

    return new Marker(latlng, {
      icon:icon
    });
  });

  const onEachHurrFeature = (feature, layer) => {
    if (feature.properties && feature.properties.time_utc) {
      const popupContent = feature.properties.storm_name + ": " +
                           feature.properties.time_utc + ", " +
                           feature.properties.max_wind_speed_mph + "mph";

      layer.on("mouseover", function (e) {
        this.bindPopup(popupContent).openPopup(e.latlng);
      });

      layer.on("mousemove", function (e) {
        this.getPopup().setLatLng(e.latlng);
      });

      layer.on("mouseout", function () {
        this.closePopup();
      });
    }
  };

  // compare the hurricane layers list to the layers list and 
  // remove any hurricane layers that are related to model run layers
  // that have been removed
  const removeAnyOrphanHurricaneLayers = () => {

    hurrLayers.map((hurrLayer) => {
      if (! layer_list.some(layer => layer.id.substr(0, layer.id.lastIndexOf("-")) + '-hurr' === hurrLayer.id)) {
        const newHurricaneTrackLayers = hurrLayers.filter((layerToRemove) => layerToRemove.id !== hurrLayer.id);
        setHurricaneTrackLayers(newHurricaneTrackLayers);
      }
    });
    // also check to see if indeed there is anything left in layer_list
    // if not remove all hurricane layers
    if (layer_list.length === 0) {
      setHurricaneTrackLayers([]);
    }
  };


  useEffect(() => {

    async function getStormLayers() {
      // create id for new hurricane layer
      if (topLayer && topLayer.properties.met_class === 'tropical') {
        const id = topLayer.id.substr(0, topLayer.id.lastIndexOf("-")) + '-hurr';

        // first check to make sure this layer doesn't already exist
        //if (hurricaneTrackLayers.some(layer => layer.id === id)) {
        const layerToMove = hurrLayers.find(layer => layer.id === id);
        if (layerToMove) {
          // move this hurricane layer to the top
          // get the rest of the layers
          const restOfLayers = hurrLayers.filter(layer => layer.id !== id);

          // set visibility on for the layer moving to the top
          layerToMove.state = newLayerDefaultState();

          // set all the rest, if any, to invisible
          // if no restOfLayers, don't actually have to move this one
          if (restOfLayers && restOfLayers.length > 0) {
            restOfLayers.forEach(layer => {
              layer.state = { visible: false, opacity: 1, };
            });
            setHurricaneTrackLayers([layerToMove, ...restOfLayers]);
          }
        } else {
          // get year, storm number, and advisory for this storm
          const year = topLayer.properties.run_date.substring(0, 4);
          let stormNumber = topLayer.properties.storm_number;

          // storm number can sometimes start with "al" so must remove if so
          if (stormNumber && stormNumber.length > 3)
            stormNumber = stormNumber.slice(2);

          const advisory = topLayer.properties.advisory_number;
          const stormName = topLayer.properties.storm_name;

          const trackLayer = [{
            id: id,
            stormName: stormName,
            stormNumber: stormNumber,
            runDate: topLayer.properties.run_date,
            year: year,
            advisory: advisory,
            instanceName: topLayer.properties.instance_name,
            eventType: topLayer.properties.event_type,
            state: newLayerDefaultState()
          }];
          const currentLayers = getAllHurricaneLayersInvisible();
                
          setHurricaneTrackLayers([...trackLayer, ...currentLayers]);
        }
      }
      removeAnyOrphanHurricaneLayers();
    }

    getStormLayers().then();
  }, [defaultModelLayers]);

  useEffect(() => {

    async function GetStormTrackGeoJson() {

      if (hurrLayers[0]) {
        getTrackData(hurrLayers[0].year, hurrLayers[0].stormNumber, hurrLayers[0].advisory).then((track) => {
            if (track != null) {
              const trackGeojson = getTrackGeojson(
                track,
                "utc",
                hurrLayers[0].stormName
              );

              // check to make sure we actually got geojson data
              // before creating layer
              if (trackGeojson) {
                setHurricaneData(trackGeojson);
              }
            }
        });
      }
    }

    GetStormTrackGeoJson().then();
  }, [hurrLayers]);

  return(
    <>
      {hurricaneData && hurrLayers
          .filter(({state}) => state.visible)
          .map((layer, index) => {
            return (
              <Fragment key={`${index}-${layer.id}`}>
                <GeoJSON
                    key={`${layer.id}-"cone"`}
                    data={hurricaneData["cone"]}
                    style={coneStyle}
                />
                <GeoJSON
                    key={`${layer.id}-"line"`}
                    data={hurricaneData["line"]}
                    style={lineStyle}
                />
                <GeoJSON
                    key={`${layer.id}-"points"`}
                    data={hurricaneData["points"]}
                    pointToLayer={hurrPointToLayer}
                    onEachFeature={onEachHurrFeature}
                />
              </Fragment>
            );
          })
      };
    </>
  );

};