import React, { Fragment, useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
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

    // used to set the dialog view state
    const [open, setOpen] = useState(false);

    /**
     * create the query string that can be used to share the current view
     */
    const createLink = (comment) => {
        // get the list of selected layers from state
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
            // copy the link to the cut/paste buffer
            copyTextToClipboard(encodeURI(window.location.origin + '/#share=run_id:' + run_id + "~comment=" + comment + '~obs=[' + observations + ']')).then();
        }
        // no layers were selected on the map
        else
            alert('There were no layers selected.');
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
        setOpen(false);
    };

    return (
        <Fragment>
            <IconButton onClick={handleClickOpen}>Share&nbsp;
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
                        handleClose();
                    }}}>
                <DialogTitle>Share this view</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a comment below that describes what you are sharing. When ready, select the &quot;Create&quot; button
                        and you will have the share link copied into your cut/paste buffer.
                    </DialogContentText>
                    <TextField autoFocus margin="dense" id="comment" name="comment" fullWidth variant="standard"/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Create</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};
