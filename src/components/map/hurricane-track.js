import React, { useState, useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';
import { GeoJSON } from 'react-leaflet';
import { Marker } from 'leaflet';
import {
    getTrackData,
    getTrackGeojson
} from "@utils/hurricane/track";
import { useLayers } from '@context';


export const HurricaneTrackGeoJson = ({index}) => {

  const {
    hurricaneTrackLayers,
  } = useLayers();
  const [hurricaneData, setHurricaneData] = useState();

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

  useEffect(() => {

    async function GetStormTrackGeoJson() {

      if (hurricaneTrackLayers[index]) {
        getTrackData(hurricaneTrackLayers[index].year, hurricaneTrackLayers[index].stormNumber, hurricaneTrackLayers[index].advisory).then((track) => {
            if (track != null) {
              const trackGeojson = getTrackGeojson(
                track,
                "utc",
                hurricaneTrackLayers[index].stormName
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
  }, []);

  return(
        <Fragment key={Math.random() + "-frag"}>
        {hurricaneData  && (
        <>
        <GeoJSON
            key={Math.random() + "-cone"}
            data={hurricaneData["cone"]}
            style={coneStyle}
        />
        <GeoJSON
            key={Math.random() + "-line"}
            data={hurricaneData["line"]}
            style={lineStyle}
        />
        <GeoJSON
            key={Math.random() + "-points"}
            data={hurricaneData["points"]}
            pointToLayer={hurrPointToLayer}
            onEachFeature={onEachHurrFeature}
        />
        </>
        )};
        </Fragment>
  );
};
HurricaneTrackGeoJson.propTypes = {
    index: PropTypes.number.isRequired,
  };