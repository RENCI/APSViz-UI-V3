import React, { createRef, Fragment } from 'react';
import { ScreenShot } from './screenshot.js';

/**
 * tests rendering the screenshot component
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const TestScreenshot = () => {
    // create a reference
    const ref = createRef(null);

    // render the test
    return (
        <Fragment>
            <div ref={ref}>This is a test of the screenshot component.</div>

            <ScreenShot ref={ref}/>
        </Fragment>
    );
};