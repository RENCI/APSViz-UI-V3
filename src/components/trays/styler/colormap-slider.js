import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SldStyleParser from 'geostyler-sld-parser';
import { Slider, Box } from '@mui/joy';
import { useLayers } from '@context';
import { getDataRange, scaleRange, getUpdatedStyleColorMapQuantities } from '@utils'


export const ColormapSlider = ({style, storeStyle}) => {

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
        console.log(newStyle);

        // save the new style to local storage
        storeStyle(newStyle);

        // find any visible layer to apply this to
        const styleName = currentStyle.name.split('_')[0]
        console.log(styleName);
        const updateLayer = defaultModelLayers.find((layer) => layer.state.visible === true && layer.properties.product_type.includes(styleName));
        console.log(updateLayer);
        if (updateLayer) {
            setLayerStyleUpdate(updateLayer.id);
        }
    }

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
    )
};

ColormapSlider.propTypes = {
    style: PropTypes.string.isRequired,
    storeStyle: PropTypes.func.isRequired,
};