import React, { Fragment } from 'react';
import { LayerSelectionForm } from "@layer-selection/layerSelectionForm.js";

/**
 * component that handles the selection of layers for the map.
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const LayerSelectionTray = () => {
    // render the layer selection component
    return (
        <Fragment>
            <LayerSelectionForm />
        </Fragment>
  );
};
