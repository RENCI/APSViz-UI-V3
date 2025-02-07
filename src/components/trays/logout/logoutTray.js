import React, { Fragment, useState, useEffect } from "react";
import { userAuth } from "@auth";
import { Button, Stack } from '@mui/joy';
import { useLayers, useSettings } from "@context";
import { getNamespacedEnvParam } from "@utils";
import axios from 'axios';

/**
 * page to collect the user credentials and verify them
 *
 * @returns React.ReactElement
 * @constructor
 */
export const LogoutTray = () => {
    // attach to the logout functionality
    const { userProfile, logout } = userAuth();

    // get the flag to indicate unsaved changes from state
    const { changesMade } = useSettings();

    // set controls disabled
    const [isDisabled, setIsDisabled] = useState(false);

        // get the user selected settings
    const { useUTC, unitsType, mapStyle, layerOpacity, speedType, darkMode } = useSettings();
    const { baseMap } = useLayers();

    /**
     * gets/sets the enabled state of the save button based on the user role
     *
     */
    useEffect( () => {
        // disable update functionality for guest logons
        if (userProfile.userProfile.profile.role_id === 0)
            setIsDisabled(true);
    }, [] );

    /**
     * Returns the user profile details
     *
     * @param first_name
     * @param last_name
     * @returns {string}
     */
    const getUserDetails = () => {
        // return the user profile details
        return `{"first_name":"${ userProfile.userProfile.profile.details.first_name }",` +
            `"last_name":"${userProfile.userProfile.profile.details.last_name }",`+
            `"useUTC":"${ useUTC.enabled }",`+
            `"basemap":"${ baseMap.title }",` +
            `"darkMode":"${ (darkMode.enabled) ? 'dark' : "light" }",`+
            `"speedType":"${ speedType.current }",` +
            `"unitsType":"${ unitsType.current }",` +
            `"maxele_opacity":"${ layerOpacity.maxele.current }",` +
            `"maxwvel_opacity":"${ layerOpacity.maxele.current }",` +
            `"swan_opacity": "${ layerOpacity.swan.current }"}`;
    };

    /**
     * handles user update button event
     *
     * @returns {Promise<void>}
     */
    const onUpdateUserClicked = async () => {
        // call to update the data
        const ret_val = await axios
                // make the call to update the data
                .post(`${getNamespacedEnvParam('REACT_APP_UI_DATA_URL')}update_user`,
                {
                    email: userProfile.userProfile.profile.email,
                    password_hash: null,
                    details: getUserDetails(),
                    maxele_style: (mapStyle.maxele.current) ? mapStyle.maxele.current : null,
                    maxwvel_style: (mapStyle.maxwvel.current) ? mapStyle.maxwvel.current : null,
                    swan_style: (mapStyle.swan.current) ? mapStyle.swan.current : null
                },
                {
                    headers: { Authorization: `Bearer ${getNamespacedEnvParam('REACT_APP_UI_DATA_TOKEN')}` }
                })
            // use the data returned
            .then((response) => {
                // return the data
                return response.data;
            })
            .catch((error) => {
                // handle an axios error
                if(error.name === 'AxiosError')
                    return 500;
                // else handle an error coming from the web service
                else
                    return error.response.status;
            });

        // if the user was not found
        if (ret_val === 404)
            console.log('User name was not found');
        // serious error on the server
        else if (ret_val === 500)
            console.log("Error updating your user profile.");
    };

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
