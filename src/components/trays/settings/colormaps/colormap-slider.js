import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SldStyleParser from 'geostyler-sld-parser';
import { Slider, Box } from '@mui/joy';
import { useLayers, useSettings } from '@context';

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
        defaultModelLayers,
        setLayerStyleUpdate,
    } = useLayers();

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
            max_slider_value = 100;
            slider_step = 1;
            for (let i = 0; i <= max_slider_value; i+=10) {
                marks.push({ label: i, value: i });
            }
        }
        else
        if (style.name.includes("swan")) {
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

            sldParser
                .readStyle(style)
                .then((geostylerStyle) => {
                    setCurrentStyle(geostylerStyle.output);
                    setSliderParams(geostylerStyle.output);
                })
                .catch(error => console.log(error));

            return(style);
        };
        getDefaultStyle().then();

    }, []);

    const storeStyle = (style) => {
        sldParser.writeStyle(style)
            .then((sldStyle) => {
                if (style.name.includes(MAXELE)) {
                    mapStyle.maxele.set(sldStyle.output);
                }
                else
                if (style.name.includes(MAXWVEL)) {
                    mapStyle.maxwvel.set(sldStyle.output);
                }
                else
                if (style.name.includes(SWAN)) {
                    mapStyle.swan.set(sldStyle.output);
                }
        });
    };

    const getDataRange = (style) => {
        const dataRange = [];
        const colormapEntries = style.rules[0].symbolizers[0].colorMap.colorMapEntries;
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
            }
        });
        style.rules[0].symbolizers[0].colorMap.colorMapEntries=[...colormapEntries];
    
        return(style);
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
        const currentRange = getDataRange(currentStyle);

        // scale the list to fit withing the new start and end range values
        const newRange = scaleRange(currentRange, newValue[0], newValue[1]);

        // now update the style with the new values
        const newStyle = getUpdatedStyleColorMapQuantities(currentStyle, newRange);

        // save the new style to local storage
        storeStyle(newStyle);

        // find any visible layer to apply this to
        const styleName = currentStyle.name.split('_')[0];
        const updateLayer = defaultModelLayers.find((layer) => layer.state.visible === true && layer.properties.product_type.includes(styleName));
        if (updateLayer) {
            setLayerStyleUpdate(updateLayer.id);
        }
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
