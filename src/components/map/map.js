import React from 'react';
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer} from 'react-leaflet'
import { DefaultLayers } from './default-layers';
import { useLayers } from '@context';

// import classes from './map.module.css'
// import { LayerMenu } from '../layer-menu/layer-menu';

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