import React, { Fragment } from "react";
import { useLayers } from "@context";
import { Dialog, DialogContent, Alert, Tooltip } from '@mui/material';

export const AlertUser = () => {
    // get the message alert details from state
    const { alertMsg, setAlertMsg } = useLayers();

    return(
        // render an alert only if there is one
        (alertMsg !== null) ? (
            <Fragment>
                <Dialog open={ true } disableEnforceFocus onClick={ () => setAlertMsg(null) }>
                    <DialogContent sx={{ p:0, m: .5, fontSize: 10, fontStyle: 'italic'}}>
                        <Tooltip title="Click to close" placement="top">
                            <Alert variant="outlined" severity={ alertMsg['severity'] }>{ alertMsg['msg'] }</Alert>
                        </Tooltip>
                    </DialogContent>
               </Dialog>
            </Fragment>
        ) : ''
    );
};