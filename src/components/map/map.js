import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { DefaultLayers } from './default-layers';
import {
  useLayers,
  useSettings,
} from '@context';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER = [30.0, -73.0];

export const Map = () => {
    const { darkMode } = useSettings();
    const {
      setMap
    } = useLayers();

    return (
      <MapContainer 
        center={ DEFAULT_CENTER }
        zoom={5}
        zoomControl={false}
        scrollWheelZoom={true}
        ref={setMap}
        style={{ height: '100vh', width:'100wh' }}>
          { darkMode.enabled
            ? <TileLayer url={ `https://api.mapbox.com/styles/v1/mvvatson/clvu3inqs05v901qlabcfhxsr/tiles/256/{z}/{x}/{y}@2x?access_token=${ process.env.REACT_APP_MAPBOX_TOKEN }` } />
            : <TileLayer url={ `https://api.mapbox.com/styles/v1/mvvatson/clvu2u7iu061901ph15n55v2e/tiles/256/{z}/{x}/{y}@2x?access_token=${ process.env.REACT_APP_MAPBOX_TOKEN }` } />
          }
          <DefaultLayers/>
      </MapContainer>
    );
  };