import React, { useEffect } from 'react';
import { useLayers } from '@context';
import SldStyleParser from 'geostyler-sld-parser';
import { maxeleStyle, maxwvelStyle, swanStyle } from './default-styles';
import { Stack, Typography, Box } from '@mui/joy';
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
        <Typography level="title-md">Change range of data in colormap (Maximum Water Level)</Typography>
        <Box width={300} >
            {storedMaxeleStyle && <ColormapSlider
                style={storedMaxeleStyle}
                storeStyle={storeStyle}
            />}
        </Box>
        <Box width={300} >
        <Typography level="title-md">Change range of data in colormap (Maximum Wind Speed)</Typography>
            {storedMaxwvelStyle && <ColormapSlider
                style={storedMaxwvelStyle}
                storeStyle={storeStyle}
            />}
        </Box>
        <Typography level="title-md">Change range of data in colormap (Maximum Significant Wave Height)</Typography>
        <Box width={300} >
            {storedSwanStyle && <ColormapSlider
                style={storedSwanStyle}
                storeStyle={storeStyle}
            />}
        </Box>
    </Stack>
    );
};