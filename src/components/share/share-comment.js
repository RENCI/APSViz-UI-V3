import React, { Fragment } from 'react';
import { Typography, Card } from '@mui/joy';
import { useLocation } from "react-router-dom";

/**
 * renders the shared content on the app as defined in the query string
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const ShareComment = () => {

    // get the hash location (if any)
    const { hash } = useLocation();

    // decompose the hash link
    let comment = '';

    // if we got a hash link
    if (hash !== '') {
        // get the payload
        let payload = hash.split('=')[1];

        // split the payload into run id and comment
        payload = payload.split(',');

        // did we get a valid payload
        if (payload.length === 2) {
            // get the comment
            comment = decodeURI(payload[1]);
        }
    }

    // if there was a comment, display it
    if (comment !== '') {
        return (
            <Card variant="outlined" sx={{maxWidth: '100%'}}>
                <Typography sx={{ wordBreak: "break-word" }} color={"primary"}>Share comment: {comment}</Typography>
            </Card>
        );
    }
    else
        return ( <Fragment></Fragment> );
};
