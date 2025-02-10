import React, { Fragment } from 'react';
import { UpdateUserProfileTray } from "./updateUserProfileTray.js";

/**
 * component that renders the update user profile tray.
 *
 * @returns React.ReactElement
 * @constructor
 */
export const UpdateUserProfile = () => {
    // render the layer selection component
    return (
        <Fragment>
            <UpdateUserProfileTray />
        </Fragment>
  );
};
