import React, { Fragment } from 'react';
import { ModelSelectionTray } from "@model-selection/modelSelectionTray.js";

/**
 * component that handles the filtered selections of layers for the map.
 *
 * @returns React.ReactElement
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
