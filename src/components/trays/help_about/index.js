import React from 'react';
import { Stack } from '@mui/joy';
import { Blind as HelpAboutIcon} from '@mui/icons-material';

// import the component that will allow the user to make model selections
import { HelpAbout } from "./help_about.js";

// get an icon for the tray
export const icon = <HelpAboutIcon />;

// create a title for this tray element
export const title = 'ADCIRC Help/About';

/**
 * render the removal component
 *
 * @returns {JSX.Element}
 */
export const trayContents = () => (
      <Stack gap={ 2 } p={ 2 }>
            <HelpAbout />
      </Stack>
    );
