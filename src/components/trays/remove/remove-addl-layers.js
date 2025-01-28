import React, { Fragment } from 'react';
import { Button } from '@mui/joy';
import { useLayers } from "@context";

/**
 * component that handles the removal of Additional layers.
 *
 * @returns React.ReactElement
 * @constructor
 */
export const RemoveAdditionalLayers = () => {
    // get the method to remove the observation items in state
    const { removeAdditionalLayers } = useLayers();

    // render the button
    return (
        <Fragment>
            <Button color="primary" onClick={() => removeAdditionalLayers()}>Remove selected additional layers</Button>
        </Fragment>
    );
};
