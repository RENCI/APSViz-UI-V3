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

    // get a handle to the map
    const map = useMap();

    // create a callback to handle a map click event
    const onClick = useCallback ( (e) => {
        // create an id for the point
        const id = e.latlng.lat + ", " + e.latlng.lng;

        // does this point already exist
        if(Object.values(selectedObservations).indexOf(id) === -1) {
            // create a marker target icon around the observation clicked
            markClicked(map, e, id);

            console.log(id);

            // get the FQDN of the UI data server
            const data_url = `${ getNamespacedEnvParam('REACT_APP_UI_DATA_URL') }`;

            // create a set of properties for this object
            const pointProps =
                {
                    "station_name": "Ocean (lat, lon): " + id,
                    "lat": e.latlng.lat,
                    "lon": e.latlng.lng,
                    "location_name": "Ocean (lat, lon): " + id,
                    "model_run_id": "4489-2024101606-gfsforecast",
                    "data_source": "GFSFORECAST_NCSC_SAB_V1.23",
                    "source_name": "adcirc",
                    "source_instance": "ncsc123_gfs_da",
                    "source_archive": "RENCI",
                    "forcing_metclass": "synoptic",
                    "location_type": "ocean",
                    "grid_name": "NCSC_SAB_V1.23",
                    "csvurl": data_url + "get_geo_point_data?lon=" + e.latlng.lng + "&lat=" + e.latlng.lat + "&url=https%3A%2F%2Ftds.renci.org%2Fthredds%2FdodsC%2F2024%2Fgfs%2F2024041712%2FNCSC_SAB_v1.23%2Fht-ncfs.renci.org%2Fncsc123_gfs_sb55.01%2Fgfsforecast%2Ffort.63.nc&ensemble=nowcast",
                    "id": id
                };

            // populate selectedObservations list with the newly selected observation point
            setSelectedObservations(previous => [...previous, pointProps]);
        }
    });

    // assign the map click event
    useMapEvent('click', onClick);

    // get the observation point selected state
    const {
        selectedObservations,
        setSelectedObservations,
    } = useLayers();

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
