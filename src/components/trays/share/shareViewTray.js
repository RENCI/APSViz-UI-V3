import React, { Fragment, useState } from 'react';
import { Button, TextField, Typography, Link } from '@mui/material';
import { useLayers } from "@context/map-context";
import { ShareComment } from "@share/share-comment";

/**
 * renders the shared content on the app as defined in the query string
 *
 * @returns React.ReactElement
 * @constructor
 */
export const ShareViewTray = () => {
    // get the layers from state
    const { defaultModelLayers, selectedObservations } = useLayers();

    // store the result message of the share link building
    const [ buildLinkMessage, setBuildLinkMessage ] = useState('');

    // storage for the share link
    const [shareLink, setShareLink] = useState('');

    // create the query string that can be used to share the current view
    const formShareViewHandler = (event) => {
        // avoid doing the usual submit operations
        event.preventDefault();

        // get the list of selected layers from state
        // this forces the group at the top to be the reproduced in the share line
        const run_id = defaultModelLayers
            // get all the distinct groups
            .filter((val, idx, self) =>
                ( idx === self.findIndex((t)=> ( t['group'] === val['group'] ))))
            // return the group name
            .map((mbr) => (
                mbr['group']
            )).join(',').split(',')[0];

        // capture the selected observations from state
        const observations = selectedObservations.map(
            (x) => (
                JSON.stringify({'id': x.id, 'lat': x.lat, 'lng': x.lon, 'location_name': x.location_name, 'station_name': x.station_name, 'csvurl': x.csvurl})
            )
        ).join(',');

        // check to see if there was one or more groups selected
        if (run_id !== '') {
            // create the link
            const theLink = encodeURI(window.location.origin + '/#share=run_id:' + run_id + "~comment=" + event.target.elements.comment.value + '~obs=[' + observations + ']');

            // copy the link to the cut/paste buffer
            copyTextToClipboard(theLink).then();

            // set the user feedback
            setBuildLinkMessage(`Your share link is now in your clipboard.`);
            setShareLink(theLink);
        }
        // no layers were selected on the map
        else {
            // set the error message
            setBuildLinkMessage('There are no layers selected. Please try again.');
            setShareLink('');
        }
    };

    /**
     *  async function to copy the share link to the clipboard
     *
     * @param text
     * @returns {Promise<void>}
     */
    async function copyTextToClipboard(text) {
        // wait for the copy to complete
        return await navigator.clipboard.writeText(text);
    }

    /**
     * resets the form
     */
    function resetForm() {
        // reset the form controls
        setBuildLinkMessage('');
        setShareLink('');
    }

    /**
     * return the rendered component
     */
    return (
        <Fragment>
            <form name={"ShareView"} onSubmit={formShareViewHandler}>
                <Typography>
                    Please enter a comment below that describes the view you are sharing. <br/><br/> When ready, select the &quot;Create&quot; button
                    and your share URL will be copied into your clipboard. You can then send it to your colleagues.
                </Typography>

                {/* output the result of the link building/saving */}
                {(buildLinkMessage.length) ? <Typography component={ 'span' }><br/>{buildLinkMessage}</Typography> : ''}

                {/* output the link */}
                {(shareLink.length) ? <Link target="_blank" sx={{ marginLeft: 1 }} href={ shareLink }>Test it!</Link> : ''}

                <TextField autoFocus margin="dense" id="comment" name="comment" fullWidth variant="standard"/>

                <Button type="submit">Create</Button>
                <Button type="reset" onClick={ resetForm }>Reset</Button>
            </form>
            <ShareComment/>
        </Fragment>
    );
};
