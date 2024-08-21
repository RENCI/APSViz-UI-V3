import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { WMSTileLayer } from 'react-leaflet';
import { useLocalStorage } from '@hooks';
import SldStyleParser from 'geostyler-sld-parser';
import { getNamespacedEnvParam } from '@utils/map-utils';
import { maxeleStyle, maxwvelStyle, swanStyle } from '@utils';
import { MapLegend } from '@components/legend';

export const AdcircRasterLayer = (layer, opacity) => {

    const sldParser = new SldStyleParser();
    const gs_wfs_url = `${ getNamespacedEnvParam('REACT_APP_GS_DATA_URL') }`;
    const gs_wms_url = gs_wfs_url + 'wms';

    const [storedMaxeleStyle] = useLocalStorage('maxele', '');
    const [storedMaxwvelStyle] = useLocalStorage('maxwvel', '');
    const [storedSwanStyle] = useLocalStorage('swan', '');
    const [currentStyle, setCurrentStyle] = useState("");

   useEffect(() => {
        if(layer.layer.properties) {
            let style = "";
            switch(layer.layer.properties.product_type) {
            case ("maxwvel63"):
                if (storedMaxwvelStyle)
                    style = storedMaxwvelStyle;
                else
                    style = maxwvelStyle;
                break;
            case ("swan_HS_max63"):
                if (storedSwanStyle) 
                    style = storedSwanStyle;
                else 
                    style = swanStyle;
                break;
            default:
                if (storedMaxeleStyle)
                    style = storedMaxeleStyle;
                else
                    style = maxeleStyle;
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
      
    // memorizing this params object prevents
    // that map flicker on state changes.
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
            <MapLegend />
         </Fragment>
        )
     );

};