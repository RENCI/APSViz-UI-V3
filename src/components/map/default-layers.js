import React, { Fragment, useEffect, useState } from 'react';
import { WMSTileLayer, GeoJSON } from 'react-leaflet'
import { useLayers } from '@context'

export const DefaultLayers = () => {

    const [obsData, setObsData] = useState("");

    const {
        defaultModelLayers,
        setDefaultModelLayers,
    } = useLayers();

    // Create the authorization header
    const requestOptions = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.REACT_APP_UI_DATA_TOKEN}`
        }
    };

    // create the URLs to the data endpoints
    const data_url = `${process.env.REACT_APP_UI_DATA_URL}get_ui_data_secure?limit=1&use_new_wb=true&use_v3_sp=true`;
    const gs_wms_url = `${process.env.REACT_APP_GS_DATA_URL}wms`;
    const gs_wfs_url = `${process.env.REACT_APP_GS_DATA_URL}`;

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // TODO: Need to store this url in some website config file and
        //       it should change to reflect the namspace we are running in
        async function getDefaultLayers() {
            let layer_list = [];
            const response = await fetch(data_url, requestOptions);
            const data = await response.json();
            let obs_url = null
          
            if (data) {
              // get layer id in workbench and find catalog entries for each
              data.workbench.forEach(function (layer_id) {
                let layer = getCatalogEntry(data.catalog, layer_id)
                if (layer)
                    layer_list.push(layer);

                    // TODO: do we really need to do this here??!
                    // if this is an obs layer, need to retrieve
                    // the json data for it from GeoServer
                    let pieces = layer.id.split('-')
                    let type = pieces[pieces.length-1]
                    if( type === "obs") {
                        obs_url = gs_wfs_url +
                            "/ows?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json" +
                            "&typeName=" +
                        layer.layers
                    }
              });
              setDefaultModelLayers(layer_list);
            }

            if (obs_url) {
                const obs_response = await fetch(obs_url);
                const obs_data = await obs_response.json();
                console.log(obs_data)

                setObsData(obs_data)
            }

        }

        // retrieve the catalog member with the provided id
        const getCatalogEntry = (catalog, id)  => {
            let entry = ""
            
            for (let idx in catalog) {
                catalog[idx].members.forEach (function (e) {
                if (e.id === id) {
                    entry = e;
                }
                });
            }
            return entry;
        }
        getDefaultLayers().then()
      }, []);

    console.log(defaultModelLayers)
    console.log(obsData)

    return (
        <>
        {defaultModelLayers.map((layer, index) => {
            let pieces = layer.id.split('-')
            let type = pieces[pieces.length-1]
            console.log(type)
            if( type === "obs") {
                return (
                    <GeoJSON
                        key = {index}
                        data = {obsData}
                    >
                    </GeoJSON>
                )
            }
            // else {
            //     return (
            //         <WMSTileLayer
            //             key = {index}
            //             /* eventHandlers={{
            //                 click: () => {
            //                 console.log('marker clicked')
            //                 },
            //             }} */
            //             url={gs_wms_url}
            //             layers={layer.layers}
            //             params={{
            //                 format:"image/png",
            //                 transparent: true,
            //             }}
        
            //         >
            //         </WMSTileLayer>
            //     )
            // }
        })};
        </>
    )
};