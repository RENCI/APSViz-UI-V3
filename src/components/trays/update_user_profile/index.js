import React from 'react';
import { Stack } from '@mui/joy';
import { ManageAccounts as UserUpdateProfileIcon } from '@mui/icons-material';

// import the component that will allow the user to view things about the app
import { UpdateUserProfile } from "./update_user_profile.js";

// get an icon for the tray
export const icon = <UserUpdateProfileIcon />;

// create a title for this tray element
export const title = 'Your account';

/**
 * render the update user profile component
 *
 * @returns React.ReactElement
 */
export const trayContents = () => (
      <Stack gap={ 2 } p={ 2 }>
            <UpdateUserProfile />
      </Stack>
    );
