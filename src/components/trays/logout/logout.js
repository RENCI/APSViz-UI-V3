import React, { Fragment } from 'react';
import { LogoutTray } from "./logoutTray.js";

/**
 * component that renders the update user profile tray.
 *
 * @returns React.ReactElement
 * @constructor
 */
export const Logout = () => {
    // render the layer selection component
    return (
        <Fragment>
            <LogoutTray />
        </Fragment>
  );
};
