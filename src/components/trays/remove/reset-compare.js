import React, { Fragment } from 'react';
import { Button } from '@mui/joy';
import { useLayers } from "@context";

/**
 * component that handles the removal of styles from
 * local storage ADCIRC raster layers
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const ResetCompare = () => {
    // get the context for the compare layers view
    const {
        resetCompare
    } = useLayers();

    // render the button
    return (
        <Fragment>
            <Button color="primary" onClick={ () => resetCompare() }>Remove compare mode</Button>
        </Fragment>
  );
};
