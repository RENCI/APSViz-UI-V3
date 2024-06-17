import React, { Fragment } from 'react';
import { IconButton } from '@mui/joy';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import {useLayers} from "@context/map-context";

/**
 * renders the link builder to recreate the current view elsewhere
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const BuildLink = () => {
    // get the layers in state
    const { defaultModelLayers } = useLayers();

    /**
     * create the query string that can be used to share the current view
     */
    const createLink = () => {
        // get the list of selected layers
        const groups = defaultModelLayers
            // get all the distinct groups
            .filter((val, idx, self) =>
                ( idx === self.findIndex((t)=> ( t['group'] === val['group']))))
            // return the group name
            .map((mbr) => (
                mbr['group']
            ))
            // generate a query string
            .join(',');

        // check to see if there was one or more groups selected
        if (groups !== '') {
            // copy the link to the cut/paste buffer
            copyTextToClipboard(window.location.href + 'share?groups=' + groups).then();

            // tell the user what just happened
            alert('The share link has been copied to the clipboard.');
        }
        else
            // no layers were selected on the map
            alert('There were no layers selected.');
    };

    // async function to copy the share link to the clipboard
    async function copyTextToClipboard(text) {
        // wait for the copy to complete
        return await navigator.clipboard.writeText(text);
    }

    return (
        <Fragment>
            <IconButton sx={{ marginLeft: 2 }} onClick={ createLink }>
                <ShareRoundedIcon color={'primary'} />
            </IconButton>
        </Fragment>
    );
};
