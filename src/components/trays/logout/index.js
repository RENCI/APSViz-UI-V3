import React from 'react';
import { Stack } from '@mui/joy';
import { Logout as LogoutIcon } from '@mui/icons-material';

// import the component that will allow the user to log out the app
import { Logout } from "./logout.js";

// get an icon for the tray
export const icon = <LogoutIcon />;

// create a title for this tray element
export const title = 'Logout of the application';

/**
 * render the update user profile component
 *
 * @returns React.ReactElement
 */
export const trayContents = () => (
      <Stack gap={ 2 } p={ 2 }>
            <Logout />
      </Stack>
    );
