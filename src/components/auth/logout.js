import React, { Fragment } from "react";
import { useAuth } from "@auth";
import {Button, Typography, Stack, Box} from '@mui/joy';

/**
 * page to collect the user credentials and verify them
 *
 * @returns React.ReactElement
 * @constructor
 */
export const Logout = () => {
    // attach to the logout functionality
    const { logout } = useAuth();

    const onLogoutClicked = async () => {
        logout();
    };

    return (
        <Fragment>
            <Box sx={{ display: 'flex',
                 justifyContent: 'center',
                 minHeight: '100',
                alignItems: 'center'
            }}>
                <Box sx={{ m: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 1,
                    borderColor: 'primary.main'}}>
                    <Stack spacing={1} sx={{ m: 2 }}>
                        <Typography variant="h1" sx={{ mt: 1, mb: 2, fontSize: 20 }}>Log out</Typography>
                        <Button onClick={ onLogoutClicked }>Log out</Button>
                    </Stack>
                </Box>
            </Box>
        </Fragment>
    );
};
