import React from 'react';
import { MapContainer } from 'react-leaflet';
import { DefaultLayers } from './default-layers';
import { StormLayers } from './storm-layers';
import { BaseMap } from './base-map';
import {
  useLayers,
} from '@context';
import 'leaflet/dist/leaflet.css';

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
import L from 'leaflet';

export const Map = () => {
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

        const myLayer1 = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
            name: 'Stamen_TonerLite',
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 20,
            ext: 'png'
        }).addTo(map);

        const myLayer2 = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
            name: 'Stamen_Watercolor',
            subdomains: 'abcd',
            minZoom: 1,
            maxZoom: 16,
            ext: 'jpg'
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