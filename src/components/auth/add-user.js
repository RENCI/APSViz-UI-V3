import React, { useState } from "react";
import { Button, Divider, Typography, Input, Box, Tooltip } from '@mui/joy';
import { useAuth } from "@auth";
import { getNamespacedEnvParam } from "@utils";
import { Branding } from "@control-panel";
import axios from 'axios';

// load the encryption library
const bcrypt = require('bcryptjs');
import isaac from "isaac";

// override using unsecure math.random when generating hashes
bcrypt.setRandomFallback((len) => {
    // create an array with size defined
	const buf = new Uint8Array(len);

    // assign a new random number generator
	return buf.map(() => Math.floor(isaac.random() * 256));
});

/**
 * page to collect the user credentials and verify them
 *
 * @returns React.ReactElement
 * @constructor
 */
export const AddUser = () => {
    // state for the date validation error
    const [error, setError] = useState(null);

    // storage for the username and password
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [newPasswordValue, setNewPasswordValue] = useState('');
    const [firstNameValue, setFirstNameValue] = useState('');
    const [lastNameValue, setLastNameValue] = useState('');

    // redirect to the main page on successful account addition
    const { login, addUser } = useAuth();

    /**
     * Returns the user profile details
     *
     * @param first_name
     * @param last_name
     * @returns {string}
     */
    const getUserDetails = (first_name, last_name) => {
        // return the user profile details
        return `{"first_name": "${first_name}", "last_name": "${last_name}", "created_on": "${new Date().toISOString()}"}`;
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
     * @param email
     * @param first_name
     * @param last_name
     * @param password
     * @param new_password
     *
     * @returns { boolean }
     */
    const validateAddParams = (email, first_name, last_name, password, new_password) => {
        // init the return value
        let ret_val = true;

        // create a regex to validate the email address and password
        const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const pwd_regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;

        // if a valid email address entered
        if (!email_regex.test(email)) {
            // let the user know
            setError('The email address you have entered is invalid.');

            setEmailValue('');

            ret_val = false;
        }
        // if the password entries do not match
        else if (password !== new_password) {
            // let the user know
            setError('The passwords you entered do not match.');

            setPasswordValue('');
            setNewPasswordValue('');

            ret_val = false;
        }
        // make sure the password is formatted properly
        else if (!pwd_regex.test(password)) {
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
    const getQueryString = (email, first_name, last_name, password) => {
        // if the user added all the params
        if (validateAddParams(emailValue, firstNameValue, lastNameValue, passwordValue, newPasswordValue)) {
            // return the query string
            return `${getNamespacedEnvParam('REACT_APP_UI_DATA_URL')}` +
                `add_user?email=${email}&password_hash=${getPasswordHash(password)}&role_id=2&details=${getUserDetails(first_name, last_name)}`;
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
    const onAddUserClicked = async (e) => {
        e.preventDefault();

        // generate the query string
        const data_url = getQueryString(emailValue, firstNameValue, lastNameValue, passwordValue);

        // if the query string was created successfully
        if (data_url !== false) {
            // create the authorization header
            const requestOptions = {
                method: 'GET',
                headers: {Authorization: `Bearer ${getNamespacedEnvParam('REACT_APP_UI_DATA_TOKEN')}`}
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

            // error on the server
            if (ret_val === 500)
                setError("There was an error creating the account.");
            // continue to validate the credentials
            else {
                // if the call successful and it is the correct password
                if (ret_val['success']) {
                    // save the new user profile
                    addUser();

                    // go to the login page
                    login();
                }
                else {
                    // show the error
                    setError('The user name may already exist.');
                }
            }
        }
    };

    // render the page
    return (
        <div
            style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '350px'
            }}>
            <form name={"add-user"} onSubmit={ onAddUserClicked }>
                <Box bgcolor="white" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: 3,
                    borderColor: '#245F97',
                    gap: 1
                }}>

                    <Box sx={{
                        m: 1,
                        border: 3,
                        borderColor: '#245F97'
                    }}>
                        <Branding/>
                    </Box>

                    {error && <Typography sx={{ml: 1, mr: 1, mb: 1, display: 'flex', fontSize: 15, color: 'red'}}>{error}</Typography>}

                    <Input
                        sx={{width: '75%'}}
                        value={firstNameValue}
                        onChange={e => setFirstNameValue(e.target.value)}
                        placeholder="First name"/>

                    <Input
                        sx={{width: '75%'}}
                        value={lastNameValue}
                        onChange={e => setLastNameValue(e.target.value)}
                        placeholder="Last name"/>

                    <Input
                        sx={{width: '75%'}}
                        value={emailValue}
                        onChange={e => setEmailValue(e.target.value)}
                        placeholder="User name (Email address)"/>

                    <Tooltip
                        sx={{width: '300px'}}
                        title={"Legitimate passwords are between 7 to 15 characters which contain at least one numeric digit and a special character."}
                    >
                        <Input
                            sx={{width: '75%'}}
                            type="password"
                            value={passwordValue}
                            onChange={e => setPasswordValue(e.target.value)}
                            placeholder="Password"/>
                    </Tooltip>

                    <Input
                        sx={{width: '75%'}}
                        type="password"
                        value={newPasswordValue}
                        onChange={e => setNewPasswordValue(e.target.value)}
                        placeholder="Verify your password"/>

                    <Divider sx={{m: 1}}/>

                    <Button
                        type="submit"
                        sx={{mb: 1, width: '90%'}}
                        disabled={!emailValue || !firstNameValue || !lastNameValue || !passwordValue || !newPasswordValue}
                        // onClick={ onAddUserClicked }
                    >
                        Sign me up
                    </Button>
                </Box>
            </form>
        </div>
    );
};