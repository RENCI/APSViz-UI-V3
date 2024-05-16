import React from 'react';
import { Stack } from '@mui/joy';
import { Delete as RemoveIcon} from '@mui/icons-material';

// import the components that will remove selected items from state
import { RemoveObservations } from "./remove-observations";
import { RemoveModels } from "./remove-models";

// get an icon for the tray
export const icon = <RemoveIcon />;

// create a title for this tray element
export const title = 'Remove items';

/**
 * render the tray
 *
 * @returns {JSX.Element}
 */
export const trayContents = () => (
      <Stack gap={ 2 } p={ 2 }>
            <RemoveObservations />
            <RemoveModels />
      </Stack>
    );
