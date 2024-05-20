import React, { Fragment, useEffect, useState } from 'react';
import { WMSTileLayer, GeoJSON, useMap } from 'react-leaflet';
import { CircleMarker } from 'leaflet';
import { useLayers } from '@context';
import { markClicked } from '@utils/map-utils';

const newLayerDefaultState = layer => {
    const { product_type } = layer.properties;

    if (['obs', 'maxele63'].includes(product_type)) {
        return ({
            visible: true
        });
    }

    return ({
        visible: false
    });
};


export const DefaultLayers = () => {

    const [obsData, setObsData] = useState("");
    const map = useMap();

    const {
        defaultModelLayers,
        setDefaultModelLayers,
        setSelectedObservations
    } = useLayers();

    // Create the authorization header
    const requestOptions = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.REACT_APP_UI_DATA_TOKEN}`
        }
    };

    const obsPointToLayer = ((feature, latlng) => {
        let obs_color = "#FFFFFF";
        
        switch (feature.properties.gauge_owner) {
            case 'NOAA/NDBC':
                obs_color = "#FFFF00";
                break;
            case 'NCEM':
                obs_color = "#3D4849";
                break;
            case 'NOAA/NOS':
                obs_color = "#BEAEFA";
                break;
        }
        
        return new CircleMarker(latlng, {
          radius: 6,
          weight: 0.7,
          color: '#000000',
          fillColor: obs_color,
          fillOpacity: 1
        });
    });

    const onEachObsFeature = (feature, layer) => {
        if (feature.properties && feature.properties.location_name) {
          const popupContent = feature.properties.location_name;
    
          layer.on("mouseover", function (e) {
            this.bindPopup(popupContent).openPopup(e.latlng);
          });
    
          layer.on("mousemove", function (e) {
            this.getPopup().setLatLng(e.latlng);
          });
    
          layer.on("mouseout", function () {
            this.closePopup();
          });
          layer.on("click", function (e) {

            // add in a record id.
            // this is used to remove the selected observation from the selectedObservations list when the dialog is closed
            feature.properties.id = feature.properties.station_name;

            // create a marker target icon around the observation clicked
            markClicked(map, e, feature.properties.id);

            // populate selectedObservations list with the newly selected observation point
            setSelectedObservations(previous => [...previous, feature.properties]);
          });
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
            const layer_list = [];
            const response = await fetch(data_url, requestOptions);
            const data = await response.json();
            let obs_url = null;
          
            if (data) {
              // get layer id in workbench and find catalog entries for each
              data.workbench.forEach(function (layer_id) {
                const layer = getCatalogEntry(data.catalog, layer_id);
                if (layer)
                    layer_list.push({
                        ...layer,
                        state: newLayerDefaultState(layer)
                    });

                    // TODO: do we really need to do this here??!
                    // if this is an obs layer, need to retrieve
                    // the json data for it from GeoServer
                    const pieces = layer.id.split('-');
                    const type = pieces[pieces.length-1];
                    if( type === "obs") {
                        obs_url = gs_wfs_url +
                            "/ows?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json" +
                            "&typeName=" +
                        layer.layers;
                    }
              });
              setDefaultModelLayers(layer_list);
            }

            if (obs_url) {
                const obs_response = await fetch(obs_url);
                const obs_data = await obs_response.json();
                //console.log("obs_data 1: " + JSON.stringify(obs_data, null, 2))

                setObsData(obs_data);
            }

        }

        // retrieve the catalog member with the provided id
        const getCatalogEntry = (catalog, id)  => {
            let entry = "";
            
            for (const idx in catalog) {
                catalog[idx].members.forEach (function (e) {
                if (e.id === id) {
                    entry = e;
                }
                });
            }
            return entry;
        };
        getDefaultLayers().then();
      }, []);

    //console.log("defaultModelLayers: " + JSON.stringify(defaultModelLayers, null, 2))

    return (
        <>
        {defaultModelLayers
            .filter(({state}) => state.visible)
            .reverse()
            .map((layer, index) => {
                const pieces = layer.id.split('-');
                const type = pieces[pieces.length-1];
                //console.log("type: " + JSON.stringify(type, null, 2))
                if( type === "obs" && obsData !== "") {
                    //console.log("obsData: " + JSON.stringify(obsData, null, 2));
                    return (
                        <GeoJSON
                            key={`${index}-${layer.id}`}
                            data={obsData}
                            pointToLayer={obsPointToLayer}
                            onEachFeature={onEachObsFeature}
                        />
                    );
                } else {
                    return (
                        <WMSTileLayer
                            key={`${index}-${layer.id}`}
                            url={gs_wms_url}
                            layers={layer.layers}
                            params={{
                                format:"image/png",
                                transparent: true,
                            }}
            
                        />
                    );
                }
            })
        };
        </>
    );
};