import React, { Fragment } from 'react';
import { Typography, Card, IconButton } from '@mui/joy';
import { parseSharedURL} from "@utils/map-utils";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useLayers } from "@context";

/**
 * renders the shared content on the app as defined in the query string
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const ShareComment = () => {
    // get the show shared comment state
    const { showShareComment, setShowShareComment } = useLayers();

    // parse the hash of the sharing URL
    const shared_params = parseSharedURL();

    /**
    * the close dialog handler
    */
    const handleClose = () => {
        setShowShareComment(false);
    };

    // if there was a comment, display it
    if ( shared_params['comment'] !== '' && showShareComment ) {
        return (
            <Card variant="outlined" sx={{maxWidth: '100%'}}>
                <Typography sx={{ wordBreak: "break-word" }} color={"primary"}>Share comment: { shared_params['comment']}</Typography>

                <IconButton size="small" autoFocus onClick={ handleClose } sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseOutlinedIcon color={"primary"}/>
                </IconButton>
            </Card>
        );
    }
    else
        // return nothing (basically)
        return ( <Fragment></Fragment> );
};
