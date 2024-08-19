import React, { useEffect } from 'react';
import { useLayers } from '@context';
import SldStyleParser from 'geostyler-sld-parser';
import { maxeleStyle, maxwvelStyle, swanStyle } from './default-styles';
import { Stack, Typography, Box } from '@mui/joy';
import {
    Air as MaxWindVelocityIcon,
    //Flood as MaxInundationIcon,
    Tsunami as SwanIcon,
    Water as MaxElevationIcon,
    //Waves as HIResMaxElevationIcon,
  } from '@mui/icons-material';
import { useLocalStorage } from '@hooks';
import { ColormapSlider } from './colormap-slider';

const MAXELE = 'maxele';
const MAXWVEL = 'maxwvel';
const SWAN = 'swan';

export const DataRangeEdit = () => {

    const {
        defaultModelLayers,
    } = useLayers();

    const [storedMaxeleStyle, setStoredMaxeleStyle] = useLocalStorage(MAXELE, '');
    const [storedMaxwvelStyle, setStoredMaxwvelStyle] = useLocalStorage(MAXWVEL, '');
    const [storedSwanStyle, setStoredSwanStyle] = useLocalStorage(SWAN, '');

    const sldParser = new SldStyleParser();

    useEffect(() => {
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

    }, [defaultModelLayers]);

    const storeStyle = (style) => {
        sldParser.writeStyle(style)
            .then((sldStyle) => {
                if (style.name.includes(MAXELE)) {
                    setStoredMaxeleStyle(sldStyle.output);
                }
                else
                if (style.name.includes(MAXWVEL)) {
                    setStoredMaxwvelStyle(sldStyle.output);
                }
                else
                if (style.name.includes(SWAN)) {
                    setStoredSwanStyle(sldStyle.output);
                }
        });
    };

    return (
    <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        gap={2}
    >
        <Box width={300} >
            {storedMaxeleStyle && <ColormapSlider
                style={storedMaxeleStyle}
                storeStyle={storeStyle}
            />}
        </Box>
        <Typography startDecorator={<MaxElevationIcon />} mb={2} level="title-md">Maximum Water Level</Typography>
       
        <Box width={300} >
            {storedMaxwvelStyle && <ColormapSlider
                style={storedMaxwvelStyle}
                storeStyle={storeStyle}
            />}
        </Box>
        <Typography startDecorator={<MaxWindVelocityIcon />}  mb={2} level="title-md">Maximum Wind Speed</Typography>
        
        <Box width={300} >
            {storedSwanStyle && <ColormapSlider
                style={storedSwanStyle}
                storeStyle={storeStyle}
            />}
        </Box>
        <Typography startDecorator={<SwanIcon />} level="title-md">Maximum Significant Wave Height</Typography>
    </Stack>
    );
};