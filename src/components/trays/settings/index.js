import React from 'react';
import { Stack, Divider, Typography } from '@mui/joy';
import { Tune as SettingsIcon } from '@mui/icons-material';

import { DarkModeToggle } from './dark-mode';
import { BaseMaps } from './basemap';
import { DataRangeEdit } from './colormaps';
import { DateTimeFormat } from './date-time-format';
import { Units } from './units';

export const icon = <SettingsIcon />;

export const title = 'Settings';

export const trayContents = () => (
  <Stack gap={ 1 } p={ 1 }>
    <Typography level="title-lg">Set/Unset Dark Mode</Typography>
    <DarkModeToggle />
    <Divider sx={{ mt: 1 }}/>
    <Typography level="title-lg">Select a Basemap</Typography>
    <BaseMaps />
    <Divider sx={{ mt: 1 }}/>
    <DateTimeFormat/>
    <Divider sx={{ mt: 1 }}/>
    <Typography level="title-lg">Units of measurement</Typography>
    <Units/>
    <Divider sx={{ mt: 1 }}/>
    <Typography level="title-lg">Edit ADCIRC Layer Colormaps</Typography>
    <DataRangeEdit />
    <Divider/>
  </Stack>
);