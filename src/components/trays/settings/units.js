import React from 'react';
import { IconButton, Typography, Stack} from '@mui/joy';

/**
 * component that handles changing the units of measurement (distance/speed/time).
 *            <Typography>Select Imperial units (Feet, MPH)</Typography>
 *             <Typography>Distance units (Statue or Nautical)</Typography>
 *
 *             <Typography>Select Metric units (Meters, KPH)</Typography>
 *
 *             <Typography>Time units (UTC or local)</Typography>
 *
 *             <Typography>units</Typography>
 * @returns React.ReactElement
 * @constructor
 */
export const Units = () => {

    return (
        <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            gap={2}
        >
            <Toggler/>
            <div>
                <Typography level="title-md">
                    Select units type
                </Typography>
                <Typography level="body-md" variant="soft" color="primary">
                    Imperial
                </Typography>
            </div>
        </Stack>
    );
};

export const Toggler = () => {
    return (
        <IconButton
            id="boolean-value-toggler"
            size="lg"
            // onClick={ unitsType.toggle }
            variant="outlined"
        >
            {
                <Typography>Imperial</Typography>
            }
        </IconButton>
    );
};