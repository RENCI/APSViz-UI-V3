import React, { useRef, Fragment } from 'react';
import { ScreenShot } from './screenshot.js';

/**
 * tests rendering the screenshot component
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const TestScreenshot = () => {
    // create a reference
    const ref = useRef(null);

    // render the test
    return (
        <Fragment>
            <div ref={ref}>This is a test of the screenshot component.</div>

            <ScreenShot ref={ref}/>
        </Fragment>
    );
};