import React, { useState } from 'react';
import { useLayers } from '@context';
import { useSettings } from '@context';
import {
  Stack,
  Option,
  Select,
  Button,
  Typography,
  Slider,
  Box,
  Divider,
} from '@mui/joy';
import SldStyleParser from 'geostyler-sld-parser';
import { ColorMapEditor } from '@renci/apsviz-geostyler';
import { restoreColorMapType } from '@utils/map-utils';
import _cloneDeep from 'lodash/cloneDeep';
import { getFloatNumberFromLabel, maxSliderValues } from './utils';

const MAXELE = 'maxele';
const MAXWVEL = 'maxwvel';
const SWAN = 'swan';

export const StyleEditor = () => {

    const {
        defaultModelLayers,
      } = useLayers();

    const {
        mapStyle,
        layerOpacity,
        unitsType,
        speedType,
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
            if ((element.properties.product_type !== "obs") && (!productList.includes(element.properties.product_name)))
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

        // save the label units for later restoration
        let labelUnit = colormap.colorMapEntries[0].label.split("").reverse().join("").split(" ")[0];
        // reverse again if this was anything other than meters unit - whew!
        if (labelUnit.length > 1) labelUnit = labelUnit.split("").reverse().join("");

        //update type of colorMap
        newColorMap.type = value.type? value.type : "ramp";

        // check to see number of classes changed
        if (colormap.colorMapEntries.length !== value.colorMapEntries.length) {
            // changed number of classes, so must rebuild the quantity and label
            // values with the colormap range currently defined.

            // check to see if this an intervals type of colormap
            // must handle weird last entry case, if so
            const topRange = (colormap.type === "intervals") ?
                getFloatNumberFromLabel(colormap.colorMapEntries[colormap.colorMapEntries.length-1].label, 0)
                :
                Number(colormap.colorMapEntries[colormap.colorMapEntries.length-1].quantity);

            const range = [Number(colormap.colorMapEntries[0].quantity), topRange];
            const newRangeList = getRangeList(range[0], range[1], value.colorMapEntries.length);
            const newColorMapEntries = value.colorMapEntries.map((entry, index) => {
                entry.quantity = newRangeList[index];
                entry.label = newRangeList[index] + " " + labelUnit;
                return (
                    entry
                );
            });
            newColorMap.colorMapEntries = newColorMapEntries;
        }
        // otherwise - we can just copy the colorMapEntries into the newColorMap - incase the color ramp changed
        // only other thing to look out for, is whether this was previously an intervals colormap type
        // and now has been changed to ramp
        // in that case we have modify the last colormap entry
        else {
            if (value.colorMapEntries[value.colorMapEntries.length-1].label.includes(">=")) {
                const last = value.colorMapEntries.length-1;
                value.colorMapEntries[last].quantity = getFloatNumberFromLabel(value.colorMapEntries[last].label, 2);
                const labelParts = value.colorMapEntries[last].label.split(" ");
                if (labelParts.length >= 3)
                    value.colorMapEntries[last].label = parseFloat(labelParts[1]).toFixed(2) + " " + labelParts[2];
            }
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
            // if the colormap type is set to intervals, the last entry is a special case,
            // so must change the last entry values
            const styleName = geoStylerStyle.output.name.split('_')[0];
            if (colormap.type === "intervals") {
                    const lastIndex = colormap.colorMapEntries.length-1;
                    let labelUnit = "";
                    // need to get value for last value in the range from the label
                    // for imperial based values, because the value is always represented
                    // in it metric form.
                    const lastQuantity = getFloatNumberFromLabel(colormap.colorMapEntries[lastIndex].label, 1);

                    if (styleName === MAXWVEL) {
                        if (unitsType.current === "imperial") {
                            labelUnit = ((speedType.current === "knots")? " kn" : " mph");
                        }
                        else {
                            labelUnit = "mps";
                        }
                    }
                    else {
                        if (unitsType.current === "imperial")
                            labelUnit = " ft";
                    }
                    geoStylerStyle.output.rules[0].symbolizers[0].colorMap.colorMapEntries[lastIndex].label = ">= " + lastQuantity + labelUnit;
                    // when the colormap type is intervals, have to set last colormap entry to be an estimated mav value for that layer
                    // to account for the way interval colormaps work.
                    geoStylerStyle.output.rules[0].symbolizers[0].colorMap.colorMapEntries[lastIndex].quantity = maxSliderValues[styleName][unitsType.current];
            }

            // save colormap type - it seems to get wiped out when the parser
            // writes out the text style
            const colorMapType = colormap.type;
            sldParser.writeStyle(geoStylerStyle.output).then((sldStyle) => {
                const updatedStyle = restoreColorMapType(colorMapType, sldStyle.output);
                switch (styleName) {
                case MAXELE:
                    mapStyle.maxele.set(updatedStyle);
                    break;
                case MAXWVEL: 
                    mapStyle.maxwvel.set(updatedStyle);
                    break;
                case SWAN:
                    mapStyle.swan.set(updatedStyle);
                    break;
                }
            });
        });
    };

    const getProductType = () => {
        let type = MAXELE;

        if (style) {
            if (style.includes(MAXWVEL)) type = MAXWVEL;
            else
            if (style.includes(SWAN)) type = SWAN;
        }

        return type;
    };

    const productType = getProductType();

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
                 <Divider />
                <Box width={300} >
                    <Typography level="title-md">Layer Opacity</Typography>
                    <Slider
                        aria-label="opacity slider"
                        value={ layerOpacity[productType].current }
                        step={ 0.01 }
                        min={ 0.01 }
                        max={ 1.0 }
                        valueLabelDisplay="auto"
                        sx={{ mr: '10px'}}
                        onChange={ (event, newValue) => layerOpacity[productType].set(newValue) }
                    />
                </Box>
                <Divider />
                <Typography level="title-md">ColorMap</Typography>
                <ColorMapEditor colorMap={colormap} extendedField={extendedField} onChange={onColorMapChange}/>
                <Button variant="soft" onClick={saveStyle} sx={{width: "200px"}}>
                    <Typography level="title-md">Save New Colormap</Typography>
                </Button>
                <Divider />
            </Stack>}
        </Stack>
    );
};
