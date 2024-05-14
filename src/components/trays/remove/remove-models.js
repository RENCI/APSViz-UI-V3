import React, { Fragment } from 'react';
import { Button } from '@mui/joy';
import {useLayers} from "@context";

/**
 * component that handles the removal of models.
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const RemoveModels = () => {
    // get references to the model data/list
    const {

    } = useLayers();

    /**
     * remove the observation selections from state and map
     */
    function removeModels() {
        alert("Not ready yet.");
    }

    // render the button
    return (
        <Fragment>
            <Button color="primary" onClick={() => removeModels()}>Remove selected models</Button>
        </Fragment>
  );
};
