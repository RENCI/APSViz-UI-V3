import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { WMSTileLayer, useMap, useMapEvent } from 'react-leaflet';
import SldStyleParser from 'geostyler-sld-parser';
import {getNamespacedEnvParam, markClicked, restoreColorMapType} from '@utils/map-utils';
import {useLayers, useSettings} from '@context';

export const AdcircRasterLayer = (layer) => {
    const sldParser = new SldStyleParser();
    const gs_wfs_url = `${ getNamespacedEnvParam('REACT_APP_GS_DATA_URL') }`;
    const gs_wms_url = gs_wfs_url + 'wms';

    const {
        mapStyle,
    } = useSettings();

    const [currentStyle, setCurrentStyle] = useState("");

    useEffect(() => {
        if(layer.layer.properties) {
            let style = "";
            switch(layer.layer.properties.product_type) {
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

    // get the observation points selected and default layers from state
    const {
        setSelectedObservations,
        defaultModelLayers
    } = useLayers();

    // capture the default layers
    const layers = defaultModelLayers;

    // get a handle to the map
    const map = useMap();

    // create a callback to handle a map click event
    const onClick = useCallback ( (e) => {
        // create an id for the point
        const id = Number(e.latlng.lng).toFixed(6) + ', ' + Number(e.latlng.lat).toFixed(6);

        // create a marker target icon around the observation clicked
        markClicked(map, e, id);

        // get the FQDN of the UI data server
        const data_url = `${ getNamespacedEnvParam('REACT_APP_UI_DATA_URL') }`;

        // get the visible layer on the map
        const layer = layers.find((layer) => layer.properties['product_type'] !== "obs" && layer.state.visible === true);

        // create the correct TDS URL
        const tds_url = layer.properties['tds_download_url'].replace('catalog', 'dodsC').replace('catalog.html', (layer.id.indexOf('swan') < 0 ? 'fort' : 'swan_HS') + '.63.nc');

        // create a set of properties for this object
        const pointProps =
            {
                "station_name": layer.properties['product_name'] + " at (lon, lat): " + id,
                "lat": Number(e.latlng.lat).toFixed(6),
                "lon": Number(e.latlng.lng).toFixed(6),
                "location_name": layer.properties['product_name'] + " at (lon, lat): " + id,
                "model_run_id": layer.group,
                "data_source": (layer.properties['event_type'] + '_' + layer.properties['grid_type']).toUpperCase(),
                "source_name": layer.properties['model'],
                "source_instance": layer.properties['instance_name'],
                "source_archive": layer.properties['location'],
                "forcing_metclass": layer.properties['met_class'],
                "location_type": "ocean",
                "grid_name": "NCSC_SAB_V1.23",
                "csvurl": data_url + "get_geo_point_data?lon=" + e.latlng.lng + "&lat=" + e.latlng.lat + "&ensemble=nowcast&url=" + tds_url,
                "id": id
            };

        // populate selectedObservations list with the newly selected observation point
        setSelectedObservations(previous => [...previous, pointProps]);
    });

    // assign the map click event for geo-point selections
    useMapEvent('click', onClick);

    // memorizing this params object prevents
    // that map flicker on state changes.
    const wmsLayerParams = useMemo(() => ({
        format:"image/png",
        transparent: true,
        sld_body: currentStyle,
    }), [currentStyle]);

    return currentStyle && (
        <WMSTileLayer
            url={gs_wms_url}
            layers={layer.layer.layers}
            params={wmsLayerParams}
            opacity={layer.layer.state.opacity}
            onClick={console.log}
        />
    );
};
