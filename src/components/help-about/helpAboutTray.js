import React, {Fragment} from 'react';

/**
 * This component renders the help/about try
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const HelpAboutTray = () => {
    // render the form
    return (
        <Fragment>
            <div>App version: {process.env.REACT_APP_VERSION}</div>
        </Fragment>
    );
};

/**
 * this method populates the controls on the form.
 *
 */
// const dataLoader = () => {
//
// };
