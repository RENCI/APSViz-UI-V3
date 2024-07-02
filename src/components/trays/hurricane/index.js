import React from 'react';
import { Storm as HurricaneIcon } from '@mui/icons-material';
import { Stack } from '@mui/joy';
import { HurricaneList } from './list';

export const icon = <HurricaneIcon />;
export const title = 'Hurricane Tracks';
export const trayContents = () => (
    <Stack gap={ 2 } p={ 2 }>
          <HurricaneList />
    </Stack>
  );