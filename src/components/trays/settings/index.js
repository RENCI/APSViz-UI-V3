import React from 'react';
import { Stack } from '@mui/joy';
import { Tune as SettingsIcon } from '@mui/icons-material';

import { SampleToggle } from './sample';

export const icon = <SettingsIcon />;

export const title = 'Settings';

export const trayContents = () => (
  <Stack gap={ 2 } p={ 2 }>
    <SampleToggle />
  </Stack>
);
