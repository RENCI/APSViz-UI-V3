import React, { useState, Fragment } from "react";
import { useSettings } from "@context";
import { Dialog, DialogContent, Button, Typography, Stack } from '@mui/material';

export const SaveProfile = () => {
    // get the flag to indicate unsaved changes from state
    const { changesMade, setChangesMade } = useSettings();

    // declare state for the view/hide of the dialog
    const [ open, setOpen ] = useState(true);

    /**
     * saves the user selected settings
     */
    const saveSettingChanges = () => {
        setChangesMade(false);
        setOpen(false);
    };

    /**
     * closes the dialog
     *
     */
    const setCancel = () => {
        setOpen(false);
    };

    // render the dialog
    return(
        // render a dialog only if there are changes to be saved
        (changesMade === 'false') ? (
            <Fragment>
                <Dialog open={ open } >
                    <DialogContent sx={{ p:0, m: .5, fontSize: 10, fontStyle: 'italic'}}>
                        <Stack direction={ 'column' } spacing={2}>
                            <Typography> Changes made, save them? </Typography>
                            <Stack direction={'row'} spacing={1}>
                                <Button onClick={ () => saveSettingChanges() }>Save</Button>
                                <Button onClick={ () => setCancel() }>Cancel</Button>
                            </Stack>
                        </Stack>
                    </DialogContent>
               </Dialog>
            </Fragment>
        ) : ''
    );
};