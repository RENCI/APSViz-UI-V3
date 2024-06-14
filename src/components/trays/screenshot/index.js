import React from 'react';
import { Stack } from '@mui/joy';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import {Screenshot} from './screenshot';
import {screenRef} from '../../../index';

// get an icon for the tray
export const icon = <AddAPhotoIcon />;

// create a title for this tray element
export const title = 'Screen shot';

/**
 * render the removal component
 *
 * @returns {JSX.Element}
 */
export const trayContents = () => (
      <Stack gap={ 2 } p={ 2 }>
          <Screenshot ref={screenRef}/>
      </Stack>
    );
