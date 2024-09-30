import React, { useState } from 'react';
import { useLayers } from '@context';
import { useSettings } from '@context';
import {
  Stack,
  Option,
  Select,
  Button,
  Typography,
} from '@mui/joy';
import SldStyleParser from 'geostyler-sld-parser';
import { ColorMapEditor } from '@renci/apsviz-geostyler';
import { restoreColorMapType } from '@utils/map-utils';
import _cloneDeep from 'lodash/cloneDeep';

const MAXELE = 'maxele';
const MAXWVEL = 'maxwvel';
const SWAN = 'swan';

export const StyleEditor = () => {

    const {
        defaultModelLayers,
      } = useLayers();

    const {
        mapStyle,
    } = useSettings();

    const [colormap, setColormap] = useState();
    const [style, setStyle] = useState();
    const productList = [];
    // get rid of the color depth selector on the ColorMapEditor
    const extendedField = {visibility: false};
    const sldParser = new SldStyleParser();

    // not sure if this is the right thing to do,
    // but just retrieving all the raster layer types
    // currently in the layer list
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

    // handles user selection of layer type to style
    const handleProductChange = (event, value) => {
        let tmpStyle = '';

        if (value === "Maximum Wind Speed") {
            tmpStyle = mapStyle.maxwvel.current;
        }
        else
        if (value === "Maximum Significant Wave Height") {
            tmpStyle = mapStyle.swan.current;
        }
        else {
            tmpStyle = mapStyle.maxele.current;
        }
        // save the text version of the selected style
        setStyle(tmpStyle);

        // parse the text based style and create an sld object
        sldParser
            .readStyle(tmpStyle)
            .then((geostylerStyle) => {
                // save the colormap of this style
                setColormap(geostylerStyle.output.rules[0].symbolizers[0].colorMap);
            });
    };

    // create a range of numbers based on start & end numbers and
    // the length of the range
    const getRangeList = (startingNumber, endingNumber, maxNumber) => Array.from (
        {length: maxNumber},
        (_, i) => (startingNumber + i * (endingNumber - startingNumber) / (maxNumber - 1)).toFixed(2)
    );

    // handles any change to the colormap properties provided
    // by the geostyler package component - ColorMapEdit
    // editable properties include colormap type,
    // number of classes and color ramp
    const onColorMapChange = (value) => {

        // get values changed and update the style accordingly
        const newColorMap = _cloneDeep(colormap);

        //update type of colorMap
        newColorMap.type = value.type? value.type : "ramp";

        // check to see number of classes changed
        if (colormap.colorMapEntries.length !== value.colorMapEntries.length) {
            // changed number of classes, so must rebuild the quantity and label
            // values with the colormap range currently defined.
            const range =
               [Number(colormap.colorMapEntries[0].quantity), Number(colormap.colorMapEntries[colormap.colorMapEntries.length-1].quantity)];
            const newRangeList = getRangeList(range[0], range[1], value.colorMapEntries.length);
            const newColorMapEntries = value.colorMapEntries.map((entry, index) => {
                entry.quantity = newRangeList[index];
                entry.label = newRangeList[index];
                return (
                    entry
                );
            });
            newColorMap.colorMapEntries = newColorMapEntries;
        }
        // otherwise - we can just copy the colorMapEntries into the newColorMap - incase the color ramp changed
        else {
            newColorMap.colorMapEntries = value.colorMapEntries.map((entry) => entry);
        }

        setColormap(newColorMap);
    };

    // save the style to local storage
    const saveStyle = () => {

        sldParser
        .readStyle(style)
        .then((geoStylerStyle) => {
            geoStylerStyle.output.rules[0].symbolizers[0].colorMap = colormap;
            // save colormap type - it seems to get wiped out when the parser
            // writes out the text style
            const colorMapType = colormap.type;
            sldParser.writeStyle(geoStylerStyle.output).then((sldStyle) => {
                const updatedStyle = restoreColorMapType(colorMapType, sldStyle.output);
                const styleName = geoStylerStyle.output.name;
                if (styleName.includes(MAXELE)) {
                    mapStyle.maxele.set(updatedStyle);
                } else
                if (styleName.includes(MAXWVEL)) {
                    mapStyle.maxwvel.set(updatedStyle);
                } else
                if (styleName.includes(SWAN)) {
                    mapStyle.swan.set(updatedStyle);
                }
            });
        });
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
            {colormap &&
            <Stack direction="column" gap={ 1 } alignItems="left">
                <ColorMapEditor colorMap={colormap} extendedField={extendedField} onChange={onColorMapChange}/>
                <Button variant="soft" onClick={saveStyle} sx={{width: "200px"}}>
                    <Typography level="title-md">Save New Colormap</Typography>
                </Button>
            </Stack>}
        </Stack>
    );
};
