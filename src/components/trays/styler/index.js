import React from 'react';
import { Stack } from '@mui/joy';
import { Palette as StyleIcon} from '@mui/icons-material';

// import the component that will allow the user to view things about the app
import { Styler } from "./style.js";

// get an icon for the tray
export const icon = <StyleIcon />;

// create a title for this tray element
export const title = 'ADCIRC Layers ColorMap Editor';

/**
 * render the removal component
 *
 * @returns {JSX.Element}
 */
export const trayContents = () => (
      <Stack gap={ 2 } p={ 2 }>
            <Styler />
      </Stack>
    );