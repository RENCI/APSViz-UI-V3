import React, { Fragment } from 'react';
import { Button } from '@mui/joy';
import { useLayers } from "@context";

/**
 * component that handles the removal of observations.
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const RemoveAllObservations = () => {
    // get the method to remove the observation items in state
    const { removeObservations } = useLayers();

    // render the button
    return (
        <Fragment>
            <Button color="primary" onClick={() => removeObservations()}>Remove all selected observations</Button>
        </Fragment>
    );
};
