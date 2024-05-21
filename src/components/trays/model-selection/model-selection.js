import React, { Fragment } from 'react';
import { ModelSelectionTray } from "@model-selection/modelSelectionTray.js";

/**
 * component that handles the selection of layers for the map.
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const ModelSelection = () => {
    // render the layer selection component
    return (
        <Fragment>
            <ModelSelectionTray />
        </Fragment>
  );
};
