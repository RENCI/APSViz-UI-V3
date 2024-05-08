import React from 'react';
import { Stack } from '@mui/joy';
import { Checklist as LayerSelectionIcon} from '@mui/icons-material';

// import the component that will allow to user to make layer selections
import { LayerSelectionTray } from "./layerSelectionTray.js";

// get an icon for the tray
export const icon = <LayerSelectionIcon />;

// create a title for this tray element
export const title = 'Layer selection';

/**
 * render the removal component
 *
 * @returns {JSX.Element}
 */
export const trayContents = () => (
      <Stack gap={ 2 } p={ 2 }>
            <LayerSelectionTray />
      </Stack>
    );
