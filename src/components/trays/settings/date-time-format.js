import React from 'react';
import { Typography, Switch, Stack } from '@mui/joy';
import { useLayers } from '@context';

/**
 *
 * @returns React.ReactElement
 * @constructor
 */
export const DateTimeFormat = () => {
    // get the timezone preference
    const {useUTC, setUseUTC} = useLayers();

    // sets the state when the switch is changed
    const onChange = () => {
        // set the new state (toggle)
        setUseUTC(!useUTC);
    };

    // return the control
    return (
        <Stack direction={'column'} sx={{ mt: 2 }}>
            <Typography level="title-lg">Select date/time format</Typography>
            <Typography
                sx={{ ml: 3, mt: 1 }}
                component="label"
                startDecorator={ <Switch checked={ useUTC } onChange={ onChange }/> }
            >Use UTC</Typography>
        </Stack>
    );
};