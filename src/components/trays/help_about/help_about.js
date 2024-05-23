import React, { Fragment } from 'react';
import { HelpAboutTray } from "@help-about/helpAboutTray.js";

/**
 * component that handles the selection of layers for the map.
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const HelpAbout = () => {
    // render the layer selection component
    return (
        <Fragment>
            <HelpAboutTray />
        </Fragment>
  );
};
