import React, { useMemo } from 'react';
import { CircleMarker, MapContainer, TileLayer } from 'react-leaflet';
import { DefaultLayers } from './default-layers';
import {
  useLayers,
  useSettings,
} from '@context';
import 'leaflet/dist/leaflet.css';
import './observation-marker.css';

const DEFAULT_CENTER = [30.0, -73.0];

export const Map = () => {
    const { darkMode } = useSettings();
    const { observations, setMap } = useLayers();

    const observationMarkers = useMemo(() => {
      return observations.visible
        .map(({ lat, lon, station_name }) => (
          <CircleMarker 
            key={`obs-marker-${lon}-${lat}`}
            className={`observation-marker station-${station_name}`}
            center={[lat, lon]}
            pathOptions={{
              color: 'crimson',
              weight: 3,
              fillColor: 'crimson',
              fillOpacity: 0.2,
            }}
            radius={ 15 }
            interactive={ false }
          />
        ));
    }, [observations]);

    return (
      <MapContainer 
        center={ DEFAULT_CENTER }
        zoom={5}
        zoomControl={false}
        scrollWheelZoom={true}
        ref={setMap}
        style={{ height: '100vh', width:'100wh' }}
      >
          {
            darkMode.enabled
              ? <TileLayer url={ `https://api.mapbox.com/styles/v1/mvvatson/clvu3inqs05v901qlabcfhxsr/tiles/256/{z}/{x}/{y}@2x?access_token=${ process.env.REACT_APP_MAPBOX_TOKEN }` } />
              : <TileLayer url={ `https://api.mapbox.com/styles/v1/mvvatson/clvu2u7iu061901ph15n55v2e/tiles/256/{z}/{x}/{y}@2x?access_token=${ process.env.REACT_APP_MAPBOX_TOKEN }` } />
          }
          <DefaultLayers/>
          { observationMarkers }
      </MapContainer>
    );
  };