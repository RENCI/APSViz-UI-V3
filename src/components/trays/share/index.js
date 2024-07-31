export * from './share_view';

import React from 'react';
import { Stack } from '@mui/joy';
import { Share as ShareViewIcon} from '@mui/icons-material';

// import the component that will allow the user to make model selections
import { ShareView } from "./share_view.js";

// get an icon for the tray
export const icon = <ShareViewIcon />;

// create a title for this tray element
export const title = 'Share your view';

/**
 * render the removal component
 *
 * @returns {JSX.Element}
 */
export const trayContents = () => (
      <Stack gap={ 2 } p={ 2 }>
          <ShareView />
      </Stack>
    );
