import React, { Fragment } from 'react';
import { IconButton } from '@mui/joy';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';

/**
 * renders the link builder to recreate the current view elsewhere
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const BuildLink = () => {
    // get the query string
    const createLink = () => {
        alert('A link has been created.');
    };

    return (
        <Fragment>
            <IconButton sx={{ marginLeft: 2 }} onClick={ createLink }>
                <ShareRoundedIcon color={'primary'} />
            </IconButton>
        </Fragment>
    );
};
