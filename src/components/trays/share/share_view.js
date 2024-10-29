import React, { Fragment } from 'react';
import { ShareViewTray } from "@share/shareViewTray.js";

/**
 * component that handles the filtered selections of layers for the map.
 *
 * @returns React.ReactElement
 * @constructor
 */
export const ShareView = () => {
    // render the layer selection component
    return (
        <Fragment>
            <ShareViewTray />
        </Fragment>
  );
};
