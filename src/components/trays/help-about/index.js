import React from 'react';
import { Stack } from '@mui/joy';
import { HelpCenter as HelpAboutIcon} from '@mui/icons-material';

// import the component that will allow the user to view things about the app
import { HelpAbout } from "./help_about.js";

// get an icon for the tray
export const icon = <HelpAboutIcon />;

// create a title for this tray element
export const title = 'APSViz Help/About';

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
