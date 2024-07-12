import React, { useState, useEffect, Fragment} from 'react';
import { GeoJSON } from 'react-leaflet';
import { Marker } from 'leaflet';
import {
    getTrackData,
    getTrackGeojson
} from "@utils/hurricane/track";
import { useLayers } from '@context';
import { getNamespacedEnvParam } from "@utils/map-utils";

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
  } = useLayers();
  const [hurricaneData, setHurricaneData] = useState();

  const layer_list = defaultModelLayers;
  const topLayer = layer_list[0];

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
    const icon_url = `${process.env[getNamespacedEnvParam('REACT_APP_HURRICANE_ICON_URL')]}`;
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

    hurricaneTrackLayers.map((hurrLayer) => {
      if (! layer_list.some(layer => layer.id.substr(0, layer.id.lastIndexOf("-")) + '-hurr' === hurrLayer.id)) {
        const newHurricaneTrackLayers = hurricaneTrackLayers.filter((layerToRemove) => layerToRemove.id !== hurrLayer.id);
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
      // create id fro new hurricane layer
      if (topLayer && topLayer.properties.met_class === 'tropical') {
        const id = topLayer.id.substr(0, topLayer.id.lastIndexOf("-")) + '-hurr';

        // first check to make sure this layer doesn't already exist
        if (!hurricaneTrackLayers.some(layer => layer.id === id)) {
          // get year, storm number, and advisory for this storm
          const year = topLayer.properties.run_date.substring(0, 4);
          let stormNumber = topLayer.properties.storm_number;
          // storm number can sometimes start with "al" so must remove if so
          if (stormNumber && stormNumber.length > 3)
            stormNumber = stormNumber.slice(2);
          const advisory = topLayer.properties.advisory_number;
          const stormName = topLayer.properties.storm_name;

          getTrackData(year, stormNumber, advisory).then((track) => {
          //for testing ...
          //getTrackData("2023", "10", "17").then((track) => {
            if (track != null) {
              const trackGeojson = getTrackGeojson(
                track,
                "utc",
                stormName
              );
              
              // now create some metadata for this layer
              // and save in hurricaneTrackLayers
              const trackLayer = [{
                id: id,
                stormName: stormName,
                stormNumber: stormNumber,
                runDate: topLayer.properties.run_date,
                advisory: advisory,
                instanceName: topLayer.properties.instance_name,
                eventType: topLayer.properties.event_type,
                state: newLayerDefaultState()
              }];

              // check to make sure we actually got geojson data
              // before creating layer
              if (trackGeojson) {
                setHurricaneData(trackGeojson);
                setHurricaneTrackLayers([...trackLayer, ...hurricaneTrackLayers]);
              }
            }
          });
        }
      }
      removeAnyOrphanHurricaneLayers();
    }

    getStormLayers().then();
  }, [layer_list]);

  return(
    <>
      {hurricaneTrackLayers
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