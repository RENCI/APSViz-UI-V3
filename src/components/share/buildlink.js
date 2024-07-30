import React, { Fragment, useState } from 'react';
import { Button, TextField, Dialog, DialogActions,
        DialogContent, DialogContentText, DialogTitle,
        Typography, Link } from '@mui/material';
import { IconButton } from '@mui/joy';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import { useLayers } from "@context/map-context";

/**
 * renders the link builder to recreate the current view elsewhere
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const BuildLink = () => {
    // get the layers from state
    const { defaultModelLayers, selectedObservations } = useLayers();

    // store the result message of the share link building
    const [ buildLinkMessage, setBuildLinkMessage ] = useState('');

    // used to set the dialog view state
    const [open, setOpen] = useState(false);

    // storage for the share link
    const [shareLink, setShareLink] = useState('');

    // create the query string that can be used to share the current view
    const createLink = (comment) => {
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
            const theLink = encodeURI(window.location.origin + '/#share=run_id:' + run_id + "~comment=" + comment + '~obs=[' + observations + ']');

            // copy the link to the cut/paste buffer
            copyTextToClipboard(theLink).then();

            // set the user feedback
            setBuildLinkMessage(`The Share link is now in your clipboard.`);
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

    // handles the dialog open event
    const handleClickOpen = () => {
        setOpen(true);
    };

    // handles the dialog close event
    const handleClose = () => {
        setBuildLinkMessage('');
        setShareLink('');
        setOpen(false);
    };

    return (
        <Fragment>
            <IconButton width="100" onClick={handleClickOpen}>
                <ShareRoundedIcon color={'primary'} />
            </IconButton>
            <Dialog
                open={ open }
                onClose={ handleClose }
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const comment = formJson.comment;
                        createLink(comment);
                    }}}>
                <DialogTitle>Share this view</DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Please enter a comment below that describes what you are sharing. When ready, select the &quot;Create&quot; button
                        and you will have the share link copied into your cut/paste buffer.
                    </DialogContentText>

                    {/* output the result of the link building/saving */}
                    { ( buildLinkMessage.length ) ? <Typography component={'span'}>{ buildLinkMessage }</Typography> : '' }

                    {/* output the link */}
                    { ( shareLink.length ) ? <Link target="_blank" sx={{ marginLeft: 1 }} href={ shareLink }>Test it!</Link> : '' }

                    <TextField autoFocus margin="dense" id="comment" name="comment" fullWidth variant="standard"/>
                </DialogContent>

                <DialogActions>
                    <Button onClick={ handleClose }>Cancel</Button>
                    <Button type="submit">Create</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};
