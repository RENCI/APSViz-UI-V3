import React, { Fragment } from "react";
import { userAuth } from "@auth";
import {Button, Stack } from '@mui/joy';

/**
 * page to collect the user credentials and verify them
 *
 * @returns React.ReactElement
 * @constructor
 */
export const LogoutTray = () => {
    // attach to the logout functionality
    const { logout } = userAuth();

    const onLogoutClicked = async () => {
        logout();
    };

    return (
        <Fragment>
            <Stack spacing={1}>
                <Button onClick={ onLogoutClicked }>Log out</Button>
            </Stack>
        </Fragment>
    );
};
