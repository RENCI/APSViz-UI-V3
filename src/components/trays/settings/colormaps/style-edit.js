import React, { useState } from 'react';
import { useLayers } from '@context';
import { useSettings } from '@context';
import {
  Stack,
  Option,
  Select,
} from '@mui/joy';
import SldStyleParser from 'geostyler-sld-parser';
import { ColorMapEditor } from 'geostyler';

export const StyleEditor = () => {

    const {
        defaultModelLayers,
      } = useLayers();

    const {
        mapStyle,
    } = useSettings();

    const [colormap, setColormap] = useState();
    const productList = [];
    // get rid of the color depth selector on the ColorMapEditor
    const extendedField = {visibility: false};

    const getLoadedProductNames = () => {
        //let productList = [];
        defaultModelLayers.forEach(element => {
            if (element.properties.product_type !== "obs")
                productList.push(element.properties.product_name);
        });
    };

    if (defaultModelLayers) {
        getLoadedProductNames();
    }

    const handleProductChange = (event, value) => {
        const sldParser = new SldStyleParser();
        let style = '';

        if (value === "Maximum Wind Speed") {
            style = mapStyle.maxwvel.current;
        }
        else
        if (value === "Maximum Significant Wave Height") {
            style = mapStyle.swan.current;
        }
        else {
            style = mapStyle.maxele.current;
        }

        sldParser
            .readStyle(style)
            .then((geostylerStyle) => {
                setColormap(geostylerStyle.output.rules[0].symbolizers[0].colorMap);
            });
    };

    const onColorMapChange = (value) => {
        console.log(value);
        // get values changed and update the style accordingly
    };

    return (
        <Stack direction="column" gap={ 2 } alignItems="left">
            <Select placeholder="Choose Product Type To Style ..." onChange={handleProductChange}>
            {
            productList
                .map((product, index) => (
                    <Option key={index} value={product}>{product}</Option>
                ))
            }
            </Select>
            <ColorMapEditor colorMap={colormap} extendedField={extendedField} onChange={onColorMapChange}/>
        </Stack>
    );
};