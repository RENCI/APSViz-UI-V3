import React from 'react';
import { Stack } from '@mui/joy';
import { LibraryAdd as AdditionalLayersIcon } from '@mui/icons-material';
import { AdditionalLayers } from './additional-layers';

export const icon = <AdditionalLayersIcon />;

export const title = 'Additional Data Layers';

//export const externalLayers = ExternalLayers;


/**
 * render the model selection component
 *
 * @returns React.ReactElement
 */
export const trayContents = () => (
    <Stack gap={ 2 } p={ 2 }>
        <AdditionalLayers />
    </Stack>
  );