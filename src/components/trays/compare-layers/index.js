import React from 'react';
import { Stack } from '@mui/joy';
import { CompareArrows as CompareLayersIcon } from '@mui/icons-material';

// import the component that will allow the user to make layer comparisons
import { CompareLayers } from "./compare-layers.js";

// get an icon for the tray
export const icon = <CompareLayersIcon />;

// create a title for this tray element
export const title = 'Compare Layers';

/**
 * render the model selection component
 *
 * @returns React.ReactElement
 */
export const trayContents = () => (
      <Stack gap={ 2 } p={ 2 }>
          <CompareLayers />
      </Stack>
    );

