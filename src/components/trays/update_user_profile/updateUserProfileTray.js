import React, {useState, Fragment, useEffect} from "react";
import {Button, Divider, Typography, Input, Stack} from '@mui/joy';
import {useAuth} from "@auth";
import {getNamespacedEnvParam} from "@utils";
import axios from 'axios';

// load the encryption library
import bcrypt from "react-native-bcrypt";
import isaac from "isaac";

// override using unsecure math.random when generating hashes
bcrypt.setRandomFallback((len) => {
	const buf = new Uint8Array(len);

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
    const [error, setError] = useState(null);
    const [msg, setMsg] = useState(null);

    // storage for the username and password
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [newPasswordValue, setNewPasswordValue] = useState('');
    const [firstNameValue, setFirstNameValue] = useState('');
    const [lastNameValue, setLastNameValue] = useState('');

    // redirect to the main page on successful account addition
    const { updateUser, userProfile } = useAuth();

    /**
     * populate the controls with their current values
     */
    useEffect( () => {
        setEmailValue(userProfile.userProfile.profile.email);
        setFirstNameValue(userProfile.userProfile.profile['details']['first_name']);
        setLastNameValue(userProfile.userProfile.profile['details']['last_name']);
    }, [] );

    /**
     * Returns the user profile details
     *
     * @param first_name
     * @param last_name
     * @returns {string}
     */
    const getUserDetails = (first_name, last_name) => {
        // return the user profile details
        return `{"first_name": "${ first_name }", "last_name": "${ last_name }", "created_on": "${ new Date().toISOString() }"}`;
    };

    /**
     * returns the hashed password
     *
     * @param passwordValue
     * @returns {string}
     */
    const getPasswordHash = (passwordValue) => {
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
    const validateUpdateParams = (first_name, last_name, password, new_password) => {
        // init the return value
        let ret_val = true;

        // create a regex to validate the password
        const pwd_regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;

        // all fields are mandatory
        if (password !== new_password) {
            // let the user know
            setError('The passwords you entered do not match.');

            setPasswordValue('');
            setNewPasswordValue('');

            ret_val = false;
        }
        // make sure the password is formatted properly
        else if (new_password && !pwd_regex.test(new_password)) {
            // let the user know
            setError('Legitimate passwords are between 7 to 15 characters which contain at least one numeric digit and a special character.');

            setPasswordValue('');
            setNewPasswordValue('');

            ret_val = false;
        }

        // return to the caller
        return ret_val;
    };

    /**
     * generates the query string
     *
     * @param email
     * @param first_name
     * @param last_name
     * @param password
     * @returns {*|boolean}
     */
    const getQueryString = () => {
        // if the user added all the params
        if (validateUpdateParams(firstNameValue, lastNameValue, passwordValue, newPasswordValue)) {
            // if there wasn't new password specified do not update it
            const new_password_qs = (newPasswordValue) ? `&password_hash=${ getPasswordHash(newPasswordValue) }` : '';

            // return the query string
            return `${getNamespacedEnvParam('REACT_APP_UI_DATA_URL')}` +
                `update_user?email=${ emailValue }&role_id=2${ new_password_qs }&details=${ getUserDetails(firstNameValue, lastNameValue) }`;
        }
        else {
            return false;
        }
    };

    /**
     * handles user add button event
     *
     * @returns {Promise<void>}
     */
    const onUpdateUserClicked = async () => {
        // generate the query string
        const data_url = getQueryString();

        // if the query string was created successfully
        if (data_url !== false) {
            // create the authorization header
            const requestOptions = {
                method: 'GET',
                headers: {Authorization: `Bearer ${ getNamespacedEnvParam('REACT_APP_UI_DATA_TOKEN') }`}
            };

            // call for data
            const ret_val = await axios
                // make the call to get the data
                .get(data_url, requestOptions)
                // use the data returned
                .then((response) => {
                    // return the data
                    return response.data;
                })
                .catch((error) => {
                    // make sure we do not render anything
                    return error.response.status;
                });

            // if the user was not found
            if (ret_val === 404)
                setError('User name not found');
            // serious error on the server
            else if (ret_val === 500)
                setError("Error updating the user.");
            // continue to validate the credentials
            else {
                // if the call successful and it is the correct password
                if (ret_val['success']) {
                    // save the new user profile
                    updateUser(ret_val);
                    setMsg('Your profile has been updated successfully.');
                }
                else {
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
                <Typography level="title-lg" sx={{ mt: 1, mb: 2 }}>Update your account ({ emailValue })</Typography>

                { error && <Typography sx={{ fontSize: 15, color: 'red' }}>{ error }</Typography> }
                { msg && <Typography sx={{ fontSize: 15, color: 'green' }}>{ msg }</Typography> }

                <Input
                    value={ firstNameValue }
                    onChange={ e => setFirstNameValue(e.target.value) }
                    placeholder="First name"/>

                <Input
                    value={ lastNameValue }
                    onChange={ e => setLastNameValue(e.target.value) }
                    placeholder="Last name"/>

                <Input
                    type="password"
                    value={ passwordValue }
                    onChange={ e => setPasswordValue(e.target.value) }
                    placeholder="New password"/>

                <Input
                    type="password"
                    value={ newPasswordValue }
                    onChange={e => setNewPasswordValue(e.target.value)}
                    placeholder="Verify your new password"/>

                <Divider/>

                <Button
                    disabled={ !firstNameValue || !lastNameValue }
                    onClick={ onUpdateUserClicked }>Submit
                </Button>
            </Stack>
        </Fragment>
    );
};
