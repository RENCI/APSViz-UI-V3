import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SldStyleParser from 'geostyler-sld-parser';
import { Slider, Box } from '@mui/joy';
import { useSettings } from '@context';
import { restoreColorMapType } from '@utils/map-utils';
import { maxSliderValues } from './utils';

const MAXELE = 'maxele';
const MAXWVEL = 'maxwvel';
const SWAN = 'swan';

export const ColormapSlider = ({style}) => {
    const [value, setValue] = React.useState([]);
    const [sliderStep, setSliderStep] = useState(0);
    const [sliderMarks, setSliderMarks] = useState([]);
    const [minSliderValue, setMinSliderValue] = useState(0);
    const [maxSliderValue, setMaxSliderValue] = useState();
    const [currentStyle, setCurrentStyle] = useState();

    const {
        mapStyle,
    } = useSettings();

    const sldParser = new SldStyleParser();

     // set the correct slider values for the appropriate style
     const setSliderParams = (style) => {

        let max_slider_value = 0;
        let slider_step = 0;
        const marks = [];

        if (style.name.includes("maxwvel")) {
            max_slider_value = maxSliderValues[MAXWVEL];
            slider_step = 1;
            for (let i = 0; i <= max_slider_value; i+=10) {
                marks.push({ label: i, value: i });
            }
        }
        else
        if (style.name.includes("swan")) {
            max_slider_value = maxSliderValues[SWAN];
            slider_step = 0.5;
            for (let i = 0; i <= max_slider_value; i+=5) {
                marks.push({ label: i, value: i });
            }
        }
        else { // maxele
            max_slider_value = maxSliderValues[MAXELE];
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
        setValue([parseFloat(colormapEntries[colormapEntries.length-1].quantity), parseFloat(colormapEntries[0].quantity)]);
    };

    useEffect(() => {
        const getDefaultStyle = async() => {
            sldParser
                .readStyle(style)
                .then((geostylerStyle) => {
                    // for interval type colormaps, fake out current style with 
                    // label stated max valuein range so we can do the right calculations
                    // get label max - in format like this: ">= 2.00"
                    if (geostylerStyle.output.rules[0].symbolizers[0].colorMap.type === "intervals") {
                        const colorMapEntries = geostylerStyle.output.rules[0].symbolizers[0].colorMap.colorMapEntries;
                        // now temporarily set that max range for the style
                        colorMapEntries[colorMapEntries.length-1].quantity = 
                            parseFloat(colorMapEntries[colorMapEntries.length-1].label.match(/[+-]?\d+(\.\d+)?/g)).toFixed(2);
                    }

                    setCurrentStyle(geostylerStyle.output);
                    setSliderParams(geostylerStyle.output);
                })
                .catch(error => console.error(error.message));
            return style;
        };
        getDefaultStyle();

    }, []);

    const storeStyle = useCallback((style) => {
        // save colormap type for later restoration when it is lost
        // by the sldParser.writeStyle(
        const colorMapType = style.rules[0].symbolizers[0].colorMap.type;
        sldParser.writeStyle(style)
            .then((sldStyle) => {
                const updatedStyle = restoreColorMapType(colorMapType, sldStyle.output);
                if (style.name.includes(MAXELE)) {
                    mapStyle.maxele.set(updatedStyle);
                } else if (style.name.includes(MAXWVEL)) {
                    mapStyle.maxwvel.set(updatedStyle);
                } else if (style.name.includes(SWAN)) {
                    mapStyle.swan.set(updatedStyle);
                }
        });
    }, []);

    const getDataRange = (style) => {
        const dataRange = [];
        const colormapEntries = style.rules[0].symbolizers[0].colorMap.colorMapEntries;
        for(let i = colormapEntries.length-1; i >= 0; i--) {
            dataRange.push(colormapEntries[i].quantity);
        }
        // if this is an intervals type of colormap, correct last entry in range
        if (style.rules[0].symbolizers[0].colorMap.type === "intervals") {
            const colorMapEntries = style.rules[0].symbolizers[0].colorMap.colorMapEntries;
            dataRange[0] = parseFloat(colorMapEntries[colorMapEntries.length-1].label.match(/[+-]?\d+(\.\d+)?/g)).toFixed(2);
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
    
    const getUpdatedStyleColorMapQuantities = (style, range) => {
    
        const colormapEntries = [...style.rules[0].symbolizers[0].colorMap.colorMapEntries];
        colormapEntries.forEach((entry, idx) => {
            if (idx <= range.length) {
                entry.quantity = range[idx];
                if (style.name.includes("maxwvel")) {
                    entry.label = range[idx] + " m/s";
                }
                else {
                    entry.label = range[idx] + " m";
                }
                // if the colormap type is set to intervals, the last entry is a special case,
                // so must change the last entry values
                if (style.rules[0].symbolizers[0].colorMap.type === "intervals") {
                    if ( idx === range.length-1) {
                        if (style.name.includes("maxwvel")) {
                            entry.label = ">= " + entry.quantity + " m/s";
                        }
                        else {
                            entry.label = ">= " + entry.quantity + " m";
                        }
                        entry.quantity = maxSliderValue;
                    }
                }
            }
        });
        style.rules[0].symbolizers[0].colorMap.colorMapEntries=[...colormapEntries];

        // set the style with a top max value to cover all 
        // possible values at the top of the range

    
        return(style);
    };

    const handleChange = (event, newValue) => {
    // make sure the first thumb value is not >= the second
    // and that second is >= sliderStep
        if ((newValue[0] < newValue[1]) && (newValue[1] >= sliderStep)) {
            setValue(newValue);
        }
    };
    
    const handleChangeCommitted = (event, newValue) => {

        // prevent overlapping values
        if (newValue[0] === newValue[1]) {
            newValue[0] = newValue[0]-sliderStep;
        }
        // since min slider value doesn't appear to work, make
        // sure lower slider value is never less tha 0
        newValue[0] = (newValue[0] < 0) ? 0 : newValue[0];
        // also check for 0 upper value - set sliderStep as lowest value
        newValue[1] = (newValue[1] < sliderStep) ? sliderStep : newValue[1];
        setValue([newValue[0], newValue[1]]);

        // now create new style with altered data range
        // get current data range values in reverse order
        const currentRange = getDataRange(currentStyle);

        // scale the list to fit withing the new start and end range values
        const newRange = scaleRange(currentRange, newValue[0], newValue[1]);

        // now update the style with the new values
        const newStyle = getUpdatedStyleColorMapQuantities(currentStyle, newRange);

        // save the new style to local storage
        storeStyle(newStyle);
    };

    return (
        <Box width={300} >
            <Slider
                getAriaLabel={() => 'Y-Axis'}
                value={ value }
                defaultValue={ value }
                onChange={ handleChange }
                onChangeCommitted={ handleChangeCommitted }
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
    );
};

ColormapSlider.propTypes = {
    style: PropTypes.string.isRequired,
};
