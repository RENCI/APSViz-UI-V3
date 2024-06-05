import React from 'react';
import { MapContainer } from 'react-leaflet';
import { DefaultLayers } from './default-layers';
import { BaseMap } from './base-map';
import {
  useLayers,
} from '@context';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER = [30.0, -90.0];

export const Map = () => {
    //const { darkMode } = useSettings();
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
          <BaseMap />
          <DefaultLayers/>
      </MapContainer>
    );
  };