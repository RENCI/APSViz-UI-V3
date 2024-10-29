import React, { Fragment } from 'react';
import { Button } from '@mui/joy';
import { useLayers } from "@context";

/**
 * component that handles the removal of all model runs.
 *
 * @returns React.ReactElement
 * @constructor
 */
export const RemoveModels = () => {
    // get the method to remove the observation items in state
    const { removeAllModelRuns } = useLayers();

    // render the button
    return (
        <Fragment>
            <Button color="primary" onClick={ () => removeAllModelRuns() }>Remove all selected model runs</Button>
        </Fragment>
    );
};
