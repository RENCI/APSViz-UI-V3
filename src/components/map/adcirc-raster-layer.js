import React, { useEffect, useMemo, useState } from 'react';
import { WMSTileLayer } from 'react-leaflet';
import SldStyleParser from 'geostyler-sld-parser';
import { getNamespacedEnvParam, restoreColorMapType } from '@utils/map-utils';
import { useSettings } from '@context';

const MAXELE = 'maxele';
const MAXWVEL = 'maxwvel';
const SWAN = 'swan';

export const AdcircRasterLayer = (layer) => {
    const sldParser = new SldStyleParser();
    const gs_wfs_url = `${ getNamespacedEnvParam('REACT_APP_GS_DATA_URL') }`;
    const gs_wms_url = gs_wfs_url + 'wms';

    const {
        mapStyle,
        layerOpacity,
    } = useSettings();

    const [currentStyle, setCurrentStyle] = useState("");
    const [productType, setProductType] = useState("");

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

    useEffect(() => {
        // get current product layer in order to set opacity
        if (layer.layer.properties.product_type.includes(MAXWVEL)) 
            setProductType(MAXWVEL);
        else
        if (layer.layer.properties.product_type.includes(SWAN)) 
            setProductType(SWAN);
        else
        setProductType(MAXELE);
    }, [layerOpacity]);

      
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
            opacity={layerOpacity[productType].current}
        />
    );

};
