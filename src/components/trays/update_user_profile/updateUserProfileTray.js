import React, { useState, Fragment, useEffect } from "react";
import { Button, Divider, Typography, Input, Stack } from '@mui/joy';
import { userAuth } from "@auth";
import { getNamespacedEnvParam } from "@utils";
import { useLayers, useSettings } from '@context';
import axios from 'axios';

// load the encryption library
const bcrypt = require('bcryptjs');

// load a library to upgrade to a secure random number generator
import isaac from "isaac";

/**
 *  override the unsecure math.random when generating hashes
 */
bcrypt.setRandomFallback((len) => {
    // create an array with size defined
	const buf = [...new Uint8Array(len)];

    // assign a new random number generator
	return buf.map(() => Math.floor(isaac.random() * 256));
});

/**
 * page to collect the user credentials and verify them
 *
 * @returns React.ReactElement
 * @constructor
 */
export const UpdateUserProfileTray = () => {
    // state for the date validation responses
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');

    // storage for the username and password
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [newPasswordValue, setNewPasswordValue] = useState('');
    const [firstNameValue, setFirstNameValue] = useState('');
    const [lastNameValue, setLastNameValue] = useState('');

    // redirect to the main page on successful account addition
    const { updateUser, userProfile } = userAuth();

    // set controls disabled
    const [isDisabled, setIsDisabled] = useState(false);

    // get the user selected settings
    const { useUTC, unitsType, mapStyle, layerOpacity, speedType, darkMode, setChangesMade } = useSettings();
    const { baseMap } = useLayers();

    /**
     * populate the controls with their current values
     */
    useEffect( () => {
        setEmailValue(userProfile.userProfile.profile.email);
        setFirstNameValue(userProfile.userProfile.profile.details.first_name);
        setLastNameValue(userProfile.userProfile.profile.details.last_name);

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
        return `{"first_name":"${ firstNameValue }",` +
            `"last_name":"${ lastNameValue }",`+
            `"basemap":"${ baseMap.title }",` +
            `"darkMode":"${ (darkMode.enabled) ? 'dark' : "light" }",`+
            `"unitsType":"${ unitsType.current }",` +
            `"useUTC":"${ useUTC.enabled }",`+
            `"speedType":"${ speedType.current }",` +
            `"maxele_opacity":"${ layerOpacity.maxele.current }",` +
            `"maxwvel_opacity":"${ layerOpacity.maxwvel.current }",` +
            `"swan_opacity": "${ layerOpacity.swan.current }"}`;
    };

    /**
     * returns the hashed password
     *
     * @param passwordValue
     * @returns {string}
     */
    const getPasswordHash = () => {
        // get the salt
        const salt = bcrypt.genSaltSync(10);

        // return the hashed password
        return bcrypt.hashSync(passwordValue, salt);
    };

    /**
     * validates the entered user params
     *
     * @param first_name
     * @param last_name
     * @param password
     * @param new_password
     *
     * @returns { boolean }
     */
    const validateUpdateParams = () => {
        // init the return value
        let ret_val = true;

        // if there is something to do
        if(passwordValue && newPasswordValue) {
            // create a regex to validate the password
            const pwd_regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;

            // all fields are mandatory
            if (passwordValue !== newPasswordValue) {
                // let the user know
                setError('The passwords you entered do not match.');

                setPasswordValue('');
                setNewPasswordValue('');

                ret_val = false;
            }
            // make sure the password is formatted properly
            else if (newPasswordValue && !pwd_regex.test(newPasswordValue)) {
                // let the user know
                setError('Legitimate passwords are between 7 to 15 characters which contain at least one numeric digit and a special character.');

                setPasswordValue('');
                setNewPasswordValue('');

                ret_val = false;
            }
        }

        // return to the caller
        return ret_val;
    };

    /**
     * handles user update button event
     *
     * @returns {Promise<void>}
     */
    const onUpdateUserClicked = async () => {
        // make sure the form params are legit
        if (validateUpdateParams()) {
            // clear all messages and errors for this run
            setError(null);
            setMsg(null);

            // call to update the data
            const ret_val = await axios
                // make the call to update the data
                .post(`${getNamespacedEnvParam('REACT_APP_UI_DATA_URL')}update_user`,
                {
                    email: emailValue,
                    password_hash: (newPasswordValue) ? getPasswordHash() : null,
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
                setError('User name was not found');
            // serious error on the server
            else if (ret_val === 500)
                setError("Error updating your user profile.");
            // continue to validate the response
            else {
                // if the call successful and it is the correct password
                if (ret_val['success']) {
                    // save the new user profile
                    updateUser(ret_val);
                    setChangesMade(false);
                    setMsg('Your profile has been updated successfully.');
                } else {
                    // show the error
                    setError('Error updating the user. Please contact an administrator.');
                }
            }
        }
    };

    // render the page
    return (
        <Fragment>
            <Stack spacing={1}>
                { !isDisabled && <Typography level="title-lg" sx={{ mt: 1, mb: 2 }}>Update your account ({ emailValue })</Typography> }
                { error && <Typography sx={{ fontSize: 15, color: 'red' }}>{ error }</Typography> }
                { msg && <Typography sx={{ fontSize: 15, color: 'green' }}>{ msg }</Typography> }

                <Input
                    value={ firstNameValue }
                    onChange={ e => setFirstNameValue(e.target.value) }
                    placeholder="First name"
                    disabled={ isDisabled }/>

                <Input
                    value={ lastNameValue }
                    onChange={ e => setLastNameValue(e.target.value) }
                    placeholder="Last name"
                    disabled={ isDisabled }/>

                <Input
                    type="password"
                    value={ passwordValue }
                    onChange={ e => setPasswordValue(e.target.value) }
                    placeholder="New password"
                    disabled={ isDisabled }/>

                <Input
                    type="password"
                    value={ newPasswordValue }
                    onChange={ e => setNewPasswordValue(e.target.value) }
                    placeholder="Verify your new password"
                    disabled={ isDisabled }/>

                <Divider/>

                <Button
                    disabled={ !firstNameValue || !lastNameValue || isDisabled }
                    onClick={ onUpdateUserClicked }>Submit
                </Button>
            </Stack>
        </Fragment>
    );
};
