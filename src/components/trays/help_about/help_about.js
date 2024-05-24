import React, { Fragment } from 'react';
import { HelpAboutTray } from "@help-about/helpAboutTray.js";

/**
 * component that renders the help/about tray.
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
