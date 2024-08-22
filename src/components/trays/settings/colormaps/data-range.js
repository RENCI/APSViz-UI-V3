import React from 'react';
import { useSettings } from '@context';
import { Stack, Typography, Box } from '@mui/joy';
import {
    Air as MaxWindVelocityIcon,
    //Flood as MaxInundationIcon,
    Tsunami as SwanIcon,
    Water as MaxElevationIcon,
    //Waves as HIResMaxElevationIcon,
  } from '@mui/icons-material';
import { ColormapSlider } from './colormap-slider';

export const DataRangeEdit = () => {

    const {
        mapStyle,
    } = useSettings();

    return (
    <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        gap={2}
        ml={2}
    >
        <Box width={300} >
            <ColormapSlider
                style={mapStyle.maxele.current}
            />
        </Box>
        <Typography startDecorator={<MaxElevationIcon />} mb={2} level="title-md">Maximum Water Level</Typography>
       
        <Box width={300} >
            <ColormapSlider
                style={mapStyle.maxwvel.current}
            />
        </Box>
        <Typography startDecorator={<MaxWindVelocityIcon />}  mb={2} level="title-md">Maximum Wind Speed</Typography>
        
        <Box width={300} >
            <ColormapSlider
                style={mapStyle.swan.current}
            />
        </Box>
        <Typography startDecorator={<SwanIcon />} level="title-md">Maximum Significant Wave Height</Typography>
    </Stack>
    );
};