import React from 'react';
import { Stack } from '@mui/joy';
import { Checklist as ModelSelectionIcon} from '@mui/icons-material';

// import the component that will allow the user to make model selections
import { ModelSelection } from "./model-selection.js";

// get an icon for the tray
export const icon = <ModelSelectionIcon />;

// create a title for this tray element
export const title = 'ADCIRC Model selection';

/**
 * render the model selection component
 *
 * @returns React.ReactElement
 */
export const trayContents = () => (
      <Stack gap={ 2 } p={ 2 }>
          <ModelSelection />
      </Stack>
    );
