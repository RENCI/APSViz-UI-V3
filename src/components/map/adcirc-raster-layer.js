import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { WMSTileLayer, useMap, useMapEvent } from 'react-leaflet';
import SldStyleParser from 'geostyler-sld-parser';
import { getNamespacedEnvParam, markClicked, restoreColorMapType } from '@utils/map-utils';
import { useLayers, useSettings } from '@context';

const MAXELE = 'maxele';
const MAXWVEL = 'maxwvel';
const SWAN = 'swan';

export const AdcircRasterLayer = (layer) => {
    const sldParser = new SldStyleParser();
    const gs_wfs_url = `${getNamespacedEnvParam('REACT_APP_GS_DATA_URL')}`;
    const gs_wms_url = gs_wfs_url + 'wms';

    const {
        mapStyle,
        layerOpacity,
    } = useSettings();

    const [currentStyle, setCurrentStyle] = useState("");
    const [productType, setProductType] = useState("");

    useEffect(() => {
        if (layer.layer.properties) {
            let style = "";
            switch (layer.layer.properties.product_type) {
                case ("maxwvel63"):
                    style = mapStyle.maxwvel.current;
                    break;
                case ("swan_HS_max63"):
                    style = mapStyle.swan.current;
                    break;
                default:
                    style = mapStyle.maxele.current;
                    break;
            }

            sldParser
                .readStyle(style)
                .then((geostylerStyle) => {
                    geostylerStyle.output.name = (' ' + layer.layer.layers).slice(1);
                    const colorMapType = geostylerStyle.output.rules[0].symbolizers[0].colorMap.type;
                    sldParser.writeStyle(geostylerStyle.output)
                        .then((sldStyle) => {
                            const updatedStyle = restoreColorMapType(colorMapType, sldStyle.output);
                            setCurrentStyle(updatedStyle);
                        });
                });
        }
    }, [mapStyle]);

    useEffect(() => {
        // get current product layer in order to set opacity
        if (layer.layer.properties.product_type.includes(MAXWVEL))
            setProductType(MAXWVEL);
        else if (layer.layer.properties.product_type.includes(SWAN))
            setProductType(SWAN);
        else
            setProductType(MAXELE);
    }, [layerOpacity]);


    // get the observation points selected, default layers and alert message from state
    const {
        defaultModelLayers,
        setAlertMsg,
        selectedObservations, setSelectedObservations,
        defaultSelected, leftPaneID, rightPaneID
    } = useLayers();

    // capture the default layers
    const layers = defaultModelLayers;

    // get a handle to the map
    const map = useMap();

    // create a list of worthy geo-point layer types
    const validLayerTypes = new Set(['Maximum Water Level', 'Maximum Significant Wave Height']);

    /**
     * determines if the point was already selected
     *
     * @param id
     */
    const isAlreadySelected = (id) => {
        // return true if the point was already selected
        return (selectedObservations.find((o) => o.id === id) !== undefined);
    };

    /**
     * determines if the app is in compare mode
     *
     * @returns {boolean}
     */
    const inCompareMode = () => {
        return (leftPaneID !== defaultSelected && rightPaneID !== defaultSelected);
    };

    /**
     * create a callback to handle a map click event
     */
    const onClick = useCallback((e) => {
        // get the visible layer on the map
        const layer = layers.find((layer) => layer.properties['product_type'] !== "obs" && layer.state.visible === true);

        // round the coordinates
        const lon = Number(e.latlng.lng).toFixed(5);
        const lat = Number(e.latlng.lat).toFixed(5);

        // create an id for the point
        const id = lon + ', ' + lat;

        // if the point selected is new
        if (!isAlreadySelected(id)) {
            // this can only happen when we are not in compare mode
            if (!inCompareMode()) {
                // if this is a good layer product
                if (validLayerTypes.has(layer.properties['product_name'])) {
                    // create a marker target icon around the observation clicked
                    markClicked(map, e, id);

                    // get the FQDN of the UI data server
                    const data_url = `${getNamespacedEnvParam('REACT_APP_UI_DATA_URL')}`;

                    // split the URL
                    const split_url = layer.properties['tds_download_url'].split('/');

                    // generate the base TDS svr hostname/url
                    const tds_svr = split_url[0] + '//' + split_url[2] + '/thredds';

                    // create the correct TDS URL without the hostname
                    const tds_url = layer.properties['tds_download_url'].replace('catalog', 'dodsC').replace('catalog.html',
                        (layer.id.includes('swan') ? 'fort' : 'swan_HS') + '.63.nc').split('/thredds')[1];

                    // generate the full url
                    const fullTDSURL = data_url + "get_geo_point_data?lon=" + e.latlng.lng + "&lat=" + e.latlng.lat + "&ensemble=nowcast" +
                        '&tds_svr=' + tds_svr + '&url=' + tds_url;

                    const l_props = layer.properties;

                    // create a set of properties for this object
                    const pointProps =
                        {
                            "station_name": l_props['product_name'] + " " + id,
                            "lat": lat,
                            "lon": lon,
                            "location_name": layer.properties['product_name'].split(' ').slice(1).join(' ') + " at (lon, lat): " + id,
                            "model_run_id": layer.group,
                            "data_source": (l_props['event_type'] + '_' + l_props['grid_type']).toUpperCase(),
                            "source_name": l_props['model'],
                            "source_instance": l_props['instance_name'],
                            "source_archive": l_props['location'],
                            "forcing_metclass": l_props['met_class'],
                            "location_type": "GeoPoint",
                            "grid_name": l_props['grid_type'].toUpperCase(),
                            "csvurl": fullTDSURL,
                            "id": id
                        };

                    // populate selectedObservations list with the newly selected observation point
                    setSelectedObservations(previous => [...previous, pointProps]);
                } else
                    setAlertMsg({
                        'severity': 'warning',
                        'msg': 'Geo-point selection is not available for the ' + layer.properties['product_name'] + ' product.'
                    });
            }
            else
                setAlertMsg({
                    'severity': 'warning',
                    'msg': 'Geo-point selection is not available while in compare mode.'
                });
        }
    });

    // assign the map click event for geo-point selections
    useMapEvent('click', onClick);

    // memorizing this params object prevents
    // that map flicker on state changes.
    const wmsLayerParams = useMemo(() => ({
        format: "image/png",
        transparent: true,
        sld_body: currentStyle,
    }), [currentStyle]);

    return currentStyle && productType && (
        <WMSTileLayer
            url={gs_wms_url}
            layers={layer.layer.layers}
            params={wmsLayerParams}
            opacity={layerOpacity[productType].current}
        />
    );
};
