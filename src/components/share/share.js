import React, { Fragment } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * renders the shared content on the app as defined in the query string
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const Share = () => {
    // get the query string
    const [searchParams] = useSearchParams();

    return (
        <Fragment>
            <div>Sharing. params: {JSON.stringify(searchParams.get('test'))}</div>
        </Fragment>
    );
};
