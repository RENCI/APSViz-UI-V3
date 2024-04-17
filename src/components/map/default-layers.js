import React from 'react';
import {
   WMSTileLayer, 
} from 'react-leaflet'
import { useLayers } from '../../context/map-context';


export const DefaultLayers = () => {

    const {
        defaultModelLayers,
        setDefaultModelLayers,
    } = useLayers();

    let layer = "4545-2024041412-gfsforecast_maxele63"

    return (

        //{ defaultModelLayers.map((layer, index) => {
            <WMSTileLayer
                url="https://apsviz-geoserver-dev.apps.renci.org/geoserver/ADCIRC_2024/wms"
                layers={layer}
                params={{
                    format:"image/png",
                    transparent: true,
                }}
            >
            </WMSTileLayer>
          //}
        //)}
    )
};