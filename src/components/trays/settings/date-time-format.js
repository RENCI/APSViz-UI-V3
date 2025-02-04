import React from 'react';
import { Typography, Switch, Stack } from '@mui/joy';
import { useSettings } from '@context';

/**
 *
 * @returns React.ReactElement
 * @constructor
 */
export const DateTimeFormat = () => {
    // get the timezone preference
    const { useUTC } = useSettings();

    // sets the state when the switch is changed
    const onChange = () => {
        // set the new state (toggle)
        useUTC.toggle();
    };

    // return the control
    return (
        <Stack direction={'column'}>
            <Typography level="title-lg">Select date/time format</Typography>
            <Typography
                sx={{ ml: 1, mt: 1 }}
                component="label"
                startDecorator={ <Switch checked={ useUTC.enabled } onChange={ onChange }/> }
            >Use UTC timezone</Typography>
        </Stack>
    );
};