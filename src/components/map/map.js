import React from 'react';
import classes from './map.module.css'
import 'leaflet/dist/leaflet.css'
import {
    MapContainer, TileLayer
} from 'react-leaflet'
import { DefaultLayers } from './default-layers';
import { LayerMenu } from '../layer-menu/layer-menu';
import { useLayers } from '../../context/map-context';

export const Map = () => {
    const {
        setMap
    } = useLayers();

    return (
      <MapContainer 
        center={[30.0, -73.0]}
        zoom={5}
        zoomControl={false}
        scrollWheelZoom={true}
        whenCreated={setMap}
        style={{ height: '88vh', width:'100wh' }}>
          <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DefaultLayers/>
      </MapContainer>
    )
  }