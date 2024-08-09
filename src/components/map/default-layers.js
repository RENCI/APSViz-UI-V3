import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { WMSTileLayer, GeoJSON, useMap } from 'react-leaflet';
import { CircleMarker } from 'leaflet';
import { useLayers } from '@context';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useLocalStorage } from '@hooks';
import { markClicked, parseSharedURL, addSharedObservations, getNamespacedEnvParam, getBrandingHandler } from '@utils/map-utils';

const newLayerDefaultState = (layer) => {
    const { product_type } = layer.properties;
  
    if (['obs', 'maxele63'].includes(product_type)) {
        return ({
            visible: true,
            opacity: 1.0,
        });
    }
  
    return ({
        visible: false,
        opacity: 1.0,
    });
  };
  
export const DefaultLayers = () => {
    const [obsData, setObsData] = useState("");
    const map = useMap();

    const {
        defaultModelLayers,
        setDefaultModelLayers,
        setSelectedObservations,
        setShowShareComment
    } = useLayers();

    const [storedMaxeleStyle, setStoredMaxeleStyle] = useLocalStorage('maxele', '');
    const [storedMaxwvelStyle, setStoredMaxwvelStyle] = useLocalStorage('maxwvel', '');
    const [storedSwanStyle, setStoredSwanStyle] = useLocalStorage('swan', '');

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
            // this id is used to remove a selected observation from the selectedObservations list when the dialog is closed
            feature.properties.id = feature.properties.station_name;

            // create a marker target icon around the observation clicked
            markClicked(map, e, feature.properties.id);

            // populate selectedObservations list with the newly selected observation point
            setSelectedObservations(previous => [...previous, feature.properties]);
          });
        }
    };

    // parse the hash of the sharing URL
    const shared_params = parseSharedURL();

    // create the URLs to the data endpoints
    const data_url = `${ getNamespacedEnvParam('REACT_APP_UI_DATA_URL') }get_ui_data_secure?limit=1&use_new_wb=true&use_v3_sp=true${ getBrandingHandler() }${ shared_params['run_id'] }`;
    const gs_wfs_url = `${ getNamespacedEnvParam('REACT_APP_GS_DATA_URL') }`;
    const gs_wms_url = gs_wfs_url + 'wms';

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

    // useQuery function
    const getDefaultLayers = async() => {
        const layer_list = [];
        // create the authorization header
        const requestOptions = {
            method: 'GET',
            headers: { Authorization: `Bearer ${ getNamespacedEnvParam('REACT_APP_UI_DATA_TOKEN') }` }
        };

        // make the call to get the data
        const {data} = await axios.get(data_url, requestOptions);

        if (data) {
            // get layer id in workbench and find catalog entries for each
            data.workbench.forEach(function (layer_id) {
                const layer = getCatalogEntry(data.catalog, layer_id);
                if (layer)
                    layer_list.push({
                        ...layer,
                        state: newLayerDefaultState(layer)
                    });
            });
            setDefaultModelLayers(layer_list);
        }
        return(data);
    };
    useQuery({
        queryKey: ['apsviz-default-data', data_url],
        queryFn: getDefaultLayers,
        enable: !!data_url,
        refetchOnWindowFocus: false,
    });

    // maybe should convert this one to use useQuery - not sure how to do that yet
    useEffect(() => {
        async function getObsGeoJsonData() {
            const obsLayer = defaultModelLayers.find((layer) => layer.properties.product_type === "obs"  && layer.state.visible);
            if (obsLayer) {
                const obs_url = gs_wfs_url +
                                "/ows?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json" +
                                "&typeName=" +
                                obsLayer.layers;
                const {data} = await axios.get(obs_url);

                // save the observation data
                setObsData(data);

                // turn on the show comment state
                setShowShareComment(true);

                // update the selected observations specified on the share link
                addSharedObservations(map, shared_params['obs'], setSelectedObservations);
            }
        }
        getObsGeoJsonData().then();
    }, [defaultModelLayers]); 

    // memorizing this params object prevents
    // that map flicker on state changes.
    const wmsLayerParams = useMemo(() => ({
        format:"image/png",
        transparent: true,
        sld_body: storedMaxeleStyle,
        styles: 'maxele_style_v3ui',
    }), []);

    // added this temporarily for Debby
    const wmsDebbyLayerParams = useMemo(() => ({
        format:"image/png",
        transparent: true,
        styles: "maxele_v3_short_style"
    }), []);

    return (
        <>
        {defaultModelLayers
            .filter(({state}) => state.visible)
            .reverse()
            .map((layer, index) => {
                const pieces = layer.id.split('-');
                const type = pieces[pieces.length-1];
                const opacity = layer.state.opacity;
                if (type === "obs" && obsData !== "") {
                    return (
                        <GeoJSON
                            key={Math.random() + index}
                            data={obsData}
                            pointToLayer={obsPointToLayer}
                            onEachFeature={onEachObsFeature}
                        />
                    );
                } else {
                    return (
                       layer.layers.includes("maxele") ?
                        (<WMSTileLayer
                            key={`${index}-${layer.id}`}
                            url={gs_wms_url}
                            layers={layer.layers}
                            params={wmsDebbyLayerParams}
                            opacity={opacity}
                        />) 
                        :
                        (<WMSTileLayer
                            key={`${index}-${layer.id}`}
                            url={gs_wms_url}
                            layers={layer.layers}
                            params={wmsLayerParams}
                            opacity={opacity}
                        />)
                    );
                }
            })
        };
        </>
    );
};
