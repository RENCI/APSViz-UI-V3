import React, { Fragment } from 'react';
import { Button } from '@mui/joy';
import {useLayers} from "@context";

/**
 * component that handles the removal of observations.
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const RemoveObservations = () => {
    // get references to the observation data/list
    const {
        map,
        selectedObservations,
        setSelectedObservations
    } = useLayers();

    /**
     * remove the observation selections from state and map
     */
    function removeObservations() {
        // remove all the targets on the map
        map.eachLayer((layer) => {
            // if this is an observation selection marker
            if (layer.options && layer.options.pane === "markerPane") {
                // remove the layer
                map.removeLayer(layer);
            }
        });

        // remove all the dialog items from the data list
        setSelectedObservations(selectedObservations.filter(item => item === undefined));
    }

    // render the button
    return (
        <Fragment>
            <Button color="primary" onClick={() => removeObservations()}>Remove selected observations</Button>
        </Fragment>
  );
};
