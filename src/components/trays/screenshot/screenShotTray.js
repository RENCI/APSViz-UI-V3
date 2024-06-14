import React, { Fragment } from 'react';
import {screenRef} from "../../../index";
import {Screenshot} from "./screenshot";

/**
 * This component renders the model selection tray
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const ScreenShotTray = () => {
    // render the form
    return (
        <Fragment>
            <Screenshot ref={ screenRef }/>
        </Fragment>
    );
};
