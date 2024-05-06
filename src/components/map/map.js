import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { DefaultLayers } from './default-layers';
import { useLayers } from '@context';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER = [30.0, -73.0];

export const Map = () => {
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
          <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DefaultLayers/>
      </MapContainer>
    );
  };