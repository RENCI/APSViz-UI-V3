import React, { Fragment } from 'react';
import { HelpAboutTray } from "./helpAboutTray.js";

/**
 * component that renders the help/about tray.
 *
 * @returns React.ReactElement
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
