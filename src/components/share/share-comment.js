import React, { Fragment } from 'react';
import { Typography, Card } from '@mui/joy';
import { parseSharedURL } from "@utils/map-utils";

/**
 * renders the shared content on the app as defined in the query string
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const ShareComment = () => {
    // parse the hash of the sharing URL
    const shared_params = parseSharedURL();

    // if there was a comment, display it
    if ( shared_params['comment'] !== '') {
        return (
            <Card variant="outlined" sx={{maxWidth: '100%'}}>
                <Typography sx={{ wordBreak: "break-word" }} color={"primary"}>Share comment: { shared_params['comment']}</Typography>
            </Card>
        );
    }
    else
        // return nothing (basically)
        return ( <Fragment></Fragment> );
};
