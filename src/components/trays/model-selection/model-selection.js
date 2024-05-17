import React, { Fragment } from 'react';
import { ModelSelectionForm } from "@model-selection/modelSelectionForm.js";

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
            <ModelSelectionForm />
        </Fragment>
  );
};
