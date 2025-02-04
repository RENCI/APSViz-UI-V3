import React, { Fragment } from "react";
import { userAuth } from "@auth";
import { Button, Stack } from '@mui/joy';
import { useSettings } from "@context";

/**
 * page to collect the user credentials and verify them
 *
 * @returns React.ReactElement
 * @constructor
 */
export const LogoutTray = () => {
    // attach to the logout functionality
    const { logout } = userAuth();

    // get the flag to indicate unsaved changes from state
    const { changesMade, setChangesMade } = useSettings();

    /**
     * handle the logout button click
     *
     * @param saveChanges
     * @returns {Promise<void>}
     */
    const onLogoutClicked = async (saveChanges) => {
        // if changes were made to settings
        if (saveChanges) {
            alert('saving changes');
            setChangesMade(false);
        }

        // log out of the application
        logout();
    };

    return (
        <Fragment>
            <Stack spacing={1}>
                { changesMade && <Button onClick={ () => onLogoutClicked(true) }>Save settings and log out</Button> }
                <Button onClick={ () => onLogoutClicked(false) }>Log out</Button>
            </Stack>
        </Fragment>
    );
};
