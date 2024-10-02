import React, { Fragment } from 'react';
import { Button } from '@mui/joy';
import { useLayers } from "@context";

/**
 * component that handles the removal of styles from
 * local storage ADCIRC raster layers
 *
 * @returns JSX.Element
 * @constructor
 */
export const ResetCompare = () => {
    // get the context for the compare layers view
    const {
        resetCompare, setInCompareMode
    } = useLayers();

    /**
     * method to use the state enabled way to reset compare mode
     *
     */
    const reset = () => {
        resetCompare();
        setInCompareMode(false);
    };

    // render the button
    return (
        <Fragment>
            <Button color="primary" onClick={ () => reset() }>Remove compare mode</Button>
        </Fragment>
  );
};
