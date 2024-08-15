import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { WMSTileLayer } from 'react-leaflet';
import { useLocalStorage } from '@hooks';
import SldStyleParser from 'geostyler-sld-parser';
import { getNamespacedEnvParam } from '@utils/map-utils';

export const AdcircRasterLayer = (layer, opacity) => {

    const sldParser = new SldStyleParser();
    const gs_wfs_url = `${ getNamespacedEnvParam('REACT_APP_GS_DATA_URL') }`;
    const gs_wms_url = gs_wfs_url + 'wms';

    const [storedMaxeleStyle, setStoredMaxeleStyle] = useLocalStorage('maxele', '');
    const [storedMaxwvelStyle, setStoredMaxwvelStyle] = useLocalStorage('maxwvel', '');
    const [storedSwanStyle, setStoredSwanStyle] = useLocalStorage('swan', '');
    const [currentStyle, setCurrentStyle] = useState("");

   useEffect(() => {
        if(layer.layer.properties) {
            let style = "";
            switch(layer.layer.properties.product_type) {
            case ("maxwvel63"):
                style = storedMaxwvelStyle;
                break;
            case ("swan_HS_max63"):
                style = storedSwanStyle;
                break;
            default:
                style = storedMaxeleStyle;
                break;
            }

            sldParser
            .readStyle(style)
            .then((geostylerStyle) => {
                geostylerStyle.output.name = (' ' + layer.layer.layers).slice(1);

                sldParser.writeStyle(geostylerStyle.output)
                .then((sldStyle) => {
                    setCurrentStyle(sldStyle.output);
            });
            }); 
        }
      }, []);

    const wmsLayerParams = useMemo(() => ({
        format:"image/png",
        transparent: true,
        sld_body: currentStyle,
    }), [currentStyle]);

    return (
        (currentStyle &&
        <Fragment>
            (<WMSTileLayer
                url={gs_wms_url}
                layers={layer.layer.layers}
                params={wmsLayerParams}
                opacity={opacity}
            />)
         </Fragment>
        )
     );

};