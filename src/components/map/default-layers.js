import React, { Fragment, useEffect } from 'react';
import { WMSTileLayer } from 'react-leaflet'
import { useLayers } from '@context'

export const DefaultLayers = () => {

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

    // create the URL to the data endpoint
    const data_url = `${process.env.REACT_APP_BASE_DATA_URL}get_ui_data_secure?limit=1&use_new_wb=false&use_v3_sp=true`;

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // TODO: Need to store this url in some website config file and
        //       it should change to reflect the namspace we are running in
        async function getDefaultLayers() {
            let layer_list = [];
            const response = await fetch(data_url, requestOptions);
            const data = await response.json();
          
            if (data) {
              // get layer id in workbench and find catalog entries for each
              //for (let layer_id in data.workbench) {
              data.workbench.forEach(function (layer_id) {
                let layer = getCatalogEntry(data.catalog, layer_id)
                if (layer)
                  layer_list.push(layer);
              });
              setDefaultModelLayers(layer_list);
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

    return (
        <>
        {defaultModelLayers.map((layer, index) => {
        return(
            <WMSTileLayer
                key = {index}
                url="https://apsviz-geoserver-dev.apps.renci.org/geoserver/ADCIRC_2024/wms"
                layers={layer.layers}
                params={{
                    format:"image/png",
                    transparent: true,
                }}
            >
            </WMSTileLayer>
        );
        })};
        </>
    )
};