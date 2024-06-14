import React, { Fragment } from 'react';
import {screenRef} from "../../../index";
import {ScreenShot} from "@components/trays/screen-shot/screen_shot";

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
            <ScreenShot ref={ screenRef }/>
        </Fragment>
    );
};
