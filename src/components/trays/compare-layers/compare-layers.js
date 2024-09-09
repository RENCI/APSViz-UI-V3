import React, { Fragment } from 'react';
import { CompareLayersTray } from "@compare-layers/CompareLayersTray.js";

/**
 * component that handles the comparison of layers on the map.
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const CompareLayers = () => {
    // render the layer selection component
    return (
        <Fragment>
            <CompareLayersTray />
        </Fragment>
  );
};
