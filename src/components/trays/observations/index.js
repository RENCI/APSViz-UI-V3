import React from 'react';
import { Stack } from '@mui/joy';
import { ClearAll as RemoveObservationsIcon} from '@mui/icons-material';

// import the component that will do the observation removal from state
import { RemoveObservations } from "./removeObservations";

// get an icon for the tray
export const icon = <RemoveObservationsIcon />;

// create a title for this tray element
export const title = 'Remove observations';

/**
 * render the removal component
 *
 * @returns {JSX.Element}
 */
export const trayContents = () => (
      <Stack gap={ 2 } p={ 2 }>
            <RemoveObservations />
      </Stack>
    );
