import React from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer } from 'react-leaflet';
import { BaseMap } from './base-map';
import { DefaultLayers } from './default-layers';
import { StormLayers } from './storm-layers';
import { useLayers } from '@context';

const DEFAULT_CENTER = [30.0, -80.0];

// export const Map = () => {
//     //const { darkMode } = useSettings();
//     const {
//       setMap
//     } = useLayers();
//
//     return (
//       <MapContainer
//         center={ DEFAULT_CENTER }
//         zoom={5}
//         zoomControl={false}
//         scrollWheelZoom={true}
//         ref={setMap}
//         style={{ height: '100vh', width:'100wh' }}>
//           <BaseMap />
//           <DefaultLayers/>
//           <StormLayers/>
//       </MapContainer>
//     );
//   };

import 'leaflet-side-by-side';
// import "leaflet-swipe-mode";

export const Map = () => {
    const L = window.L;

    //const { darkMode } = useSettings();
    const {
        map,
        setMap,
        defaultModelLayers
    } = useLayers();

    if (map !== null) {
        // const myLayer1 = L.tileLayer(defaultModelLayers[0]).addTo(map);
        //
        // var myLayer2 = L.tileLayer(defaultModelLayers[1]).addTo(map);

        const myLayer1 = L.tileLayer.wms('https://apsviz-geoserver-dev.apps.renci.org/geoserver/wms', {
            name: '4552-2024082012-gfsforecast-maxele63',
            layers: 'ADCIRC_2024:4552-2024082012-gfsforecast_maxele63'
        }).addTo(map);

        const myLayer2 = L.tileLayer.wms('https://apsviz-geoserver-dev.apps.renci.org/geoserver/wms', {
            name: '4552-2024082012-gfsforecast_station_properies_view',
            layers: 'ADCIRC_2024:4552-2024082012-gfsforecast_station_properies_view'
        }).addTo(map);

        L.control.sideBySide(myLayer1, myLayer2).addTo(map);

        // const options = {
        //     button: document.getElementById("swipemode-btn"),
        // };
        //
        // const Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
        //     name: 'Stamen_TonerLite',
        //     subdomains: 'abcd',
        //     minZoom: 0,
        //     maxZoom: 20,
        //     ext: 'png'
        // }).addTo(map);
        //
        // const Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
        //     name: 'Stamen_Watercolor',
        //     subdomains: 'abcd',
        //     minZoom: 1,
        //     maxZoom: 16,
        //     ext: 'jpg'
        // }).addTo(map);
        //
        //
        // L.control.sideBySide(Stamen_TonerLite, Stamen_Watercolor, options).addTo(map);

        // If you want to change the current layers, just use:
        //sm.setLeftLayer(myLayer3); //or setRightLayer
    }

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
          {/*<StormLayers/>*/}
      </MapContainer>
    );
  };