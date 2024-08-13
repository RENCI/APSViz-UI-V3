import React, { useState, useEffect } from 'react';
import { useLayers } from '@context';
//import axios from 'axios';
import SldStyleParser from 'geostyler-sld-parser';
import { maxeleStyle, maxwvelStyle, swanStyle } from './default-styles';
import { Stack, Typography, Slider, Box } from '@mui/joy';
//import { getNamespacedEnvParam } from '@utils/map-utils';
import { useLocalStorage } from '@hooks';

const MAXELE = 'maxele';
const MAXWVEL = 'maxwvel';
const SWAN = 'swan';

export const DataRangeEdit = () => {

    const {
        defaultModelLayers,
    } = useLayers();

    const [value, setValue] = React.useState([]);
    const [sliderStep, setSliderStep] = useState(0);
    const [sliderMarks, setSliderMarks] = useState([]);
    const [minSliderValue, setMinSliderValue] = useState(0);
    const [maxSliderValue, setMaxSliderValue] = useState();
    const [currentStyle, setCurrentStyle] = useState();

    const [storedMaxeleStyle, setStoredMaxeleStyle] = useLocalStorage('maxele', '');
    const [storedMaxwvelStyle, setStoredMaxwvelStyle] = useLocalStorage('maxwvel', '');
    const [storedSwanStyle, setStoredSwanStyle] = useLocalStorage('swan', '');

    const sldParser = new SldStyleParser();

    // initialize the slider parameters these will change depending
    // on which raster layer is currently visible

    //const gs_wfs_url = `${ getNamespacedEnvParam('REACT_APP_GS_DATA_URL') }`;
    //let gs_wms_style_url = "";

    const setSliderParams = (style) => {
        let max_slider_value = 0;
        let slider_step = 0;
        const marks = [];

        if (style.name.includes('maxwvel')) {
            max_slider_value = 100;
            slider_step = 1;
            for (let i = 0; i <= max_slider_value; i+=10) {
                marks.push({ label: i, value: i });
            }
        }
        else
        if (style.name.includes('swan')) {
            max_slider_value = 30;
            slider_step = 0.5;
            for (let i = 0; i <= max_slider_value; i+=5) {
                marks.push({ label: i, value: i });
            }
        }
        else { // maxele
            max_slider_value = 10;
            slider_step = 0.25;
            for (let i = 0; i <= max_slider_value; i++) {
                marks.push({ label: i, value: i });
            }
        }
        setMaxSliderValue(max_slider_value);
        setSliderStep(slider_step);
        setSliderMarks(marks);
        setMinSliderValue(0);

        const colormapEntries = style.rules[0].symbolizers[0].colorMap.colorMapEntries;
        setValue([colormapEntries[colormapEntries.length-1].quantity, colormapEntries[0].quantity]);

    };

    useEffect(() => {

        const getDefaultStyle = async() => {

            // store the default styles in local storage
            // if not already there
            if (!storedMaxeleStyle) {
                setStoredMaxeleStyle(maxeleStyle);
            }
            if (!storedMaxwvelStyle) {
                setStoredMaxwvelStyle(maxwvelStyle);
            }
            if (!storedSwanStyle) {
                setStoredSwanStyle(swanStyle);
            }

            if (defaultModelLayers && defaultModelLayers.length > 0) {

                // find the first raster layer that is visible in defaultModelLayers
                const editLayer = defaultModelLayers.find((layer) => layer.properties.product_type !== "obs"  && layer.state.visible);
                if (editLayer) {
                    //const gs_wms_style_url = gs_wfs_url + 'wms?request=GetStyles&layers=' +
                                            //editLayer['layers'] +
                                            //'&service=wms&version=1.1.1';
                            
                    // make the call to get the data
                    //const {data} = await axios.get(gs_wms_style_url);

                   // if (data) {
                        //console.log(data);
                    let style = '';
                    if (editLayer.properties.product_type.includes('maxwvel')) {
                        style = storedMaxwvelStyle;
                    }
                    else
                    if (editLayer.properties.product_type.includes('swan')) {
                        style = storedSwanStyle;
                    }
                    else {
                        style = storedMaxeleStyle;
                    }

                    sldParser
                        .readStyle(style)
                        .then((geostylerStyle) => {
                            setCurrentStyle(geostylerStyle.output);
                            setSliderParams(geostylerStyle.output);
                        })
                        .catch(error => console.log(error));

                    //}
                    return(style);
                }
            }
        };
        getDefaultStyle().then();
    }, [defaultModelLayers]);
    //}, []);

    // return an array of the current style's quantity values
    // from the colormap entries array - in reverse order
    const getDataRange = () => {
        const dataRange = [];
        const colormapEntries = currentStyle.rules[0].symbolizers[0].colorMap.colorMapEntries;
        for(let i = colormapEntries.length-1; i >= 0; i--) {
            dataRange.push(colormapEntries[i].quantity);
        }

        return(dataRange.reverse());
    };

    const scaleNumber = (unscaled, to_min, to_max, from_min, from_max) => {
        const scaled_num =
          ((to_max - to_min) * (unscaled - from_min)) / (from_max - from_min) +
          to_min;
        return scaled_num.toFixed(2);
      };
    
    const scaleRange = (l, minimum, maximum) => {
    const new_l = [];
    const to_min = parseFloat(minimum);
    const to_max = parseFloat(maximum);
    for (let i = 0; i < l.length; i++) {
        const num = scaleNumber(
        l[i],
        to_min,
        to_max,
        Math.min(...l).toFixed(2),
        Math.max(...l).toFixed(2)
        );
        new_l.push(num);
    }
    return new_l;
    };

    const updateStyleColorMapQuantities = (range) => {
        const style = currentStyle;

        const colormapEntries = [...style.rules[0].symbolizers[0].colorMap.colorMapEntries];
        colormapEntries.forEach((entry, idx) => {
            if (idx <= range.length) {
                entry.quantity = range[idx];
            }
        });
        style.rules[0].symbolizers[0].colorMap.colorMapEntries=[...colormapEntries];
        setCurrentStyle(style);

    };

    const storeStyle = () => {
        sldParser.writeStyle(currentStyle)
            .then((sldStyle) => {
                if (currentStyle.name.includes('maxele')) {
                    setStoredMaxeleStyle(sldStyle.output);
                }
                else
                if (currentStyle.name.includes('maxwvel')) {
                    setStoredMaxwvelStyle(sldStyle.output);
                }
                else
                if (currentStyle.name.includes('swan')) {
                    setStoredSwanStyle(sldStyle.output);
                }
        });
    };

    const handleChange = (event, newValue) => {
    // make sure the first thumb value is not >= the second
        if (newValue[0] < newValue[1]) {
            setValue(newValue);
        }
    };

    const handleChangeCommitted = (event, newValue) => {
        if (newValue[0] < newValue[1]) {
            setValue(newValue);
        }
        else 
        if (newValue[0] === newValue[1]) {
            setValue([newValue[0]-sliderStep, newValue[1]]);
        }

        // now create new style with altered data range
        // get current data range values in reverse order
        const currentRange = getDataRange();

        // scale the list to fit withing the new start and end range values
        const newRange = scaleRange(currentRange, newValue[0], newValue[1]);

        // now update the style with the new values
        updateStyleColorMapQuantities(newRange);

        // save the new style to local storage
        storeStyle();

    };

    return (
    <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        gap={2}
    >
        {currentStyle &&<Typography level="title-md">Change range of data in colormap ({currentStyle.name.split('_')[0]})</Typography>}

        <Box width={300} >
            <Slider
                getAriaLabel={() => 'Y-Axis'}
                value={ value }
                defaultValue={ value }
                onChange={ handleChange }
                onChangeCommitted={handleChangeCommitted}
                valueLabelDisplay="auto"
                step={ sliderStep }
                marks={ sliderMarks }
                min={minSliderValue}
                max={maxSliderValue}
                disableSwap
                size="md"
                variant="solid"
            />
        </Box>
    </Stack>
    );
};