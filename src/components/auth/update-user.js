import React, {useState, Fragment, useEffect} from "react";
import {useAuth} from "@auth";
import {getNamespacedEnvParam} from "@utils";
import axios from 'axios';
import {Button, Divider, Typography, Input, Stack, Box} from '@mui/joy';

/**
 * page to collect the user credentials and verify them
 *
 * @returns React.ReactElement
 * @constructor
 */
export const UpdateUser = () => {
    // state for the date validation error
    const [error, setError] = useState(null);

    // storage for the username and password
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [newPasswordValue, setNewPasswordValue] = useState('');
    const [firstNameValue, setFirstNameValue] = useState('');
    const [lastNameValue, setLastNameValue] = useState('');

    // save the user details and redirect to the main page
    const {login, userProfile, updateUser} = useAuth();

    /**
     * populate the controls with their current values
     */
    useEffect( () => {
        setEmailValue(userProfile['ret_val']['profile']['email']);
        setFirstNameValue(userProfile['ret_val']['profile']['details']['first_name']);
        setLastNameValue(userProfile['ret_val']['profile']['details']['last_name']);
    }, [] );

    /**
     * handles the update user details button event
     * TODO: use tanstack in here
     *
     * @returns {Promise<void>}
     */
    const onUpdateUserClicked = async () => {
        // create the authorization header
        const requestOptions = {
            method: 'GET',
            headers: {Authorization: `Bearer ${getNamespacedEnvParam('REACT_APP_UI_DATA_TOKEN')}`}
        };

        // build up the url
        const data_url = `${getNamespacedEnvParam('REACT_APP_UI_DATA_URL')}update_user?email=${emailValue}`;

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
            setError("Error validating the user.");
        // continue to validate the credentials
        else {
            // crytography library
            const bcrypt = require('react-native-bcrypt');

            // to encrypt a password
            // const salt = bcrypt.genSaltSync(10);
            // const password_hash = bcrypt.hashSync(passwordValue, salt);

            // if the call successful and it is the correct password
            if (ret_val['success'])
                // save the new user profile
                login({ret_val});
            else {
                // show the error
                setError('Error.');
            }
        }
    };

    // render the page
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
                        <Typography variant="h1" sx={{ mt: 1, mb: 2, fontSize: 20 }}>Update your account</Typography>

                        {error && <Typography sx={{ fontSize: 15, color: 'red' }}>{ error }</Typography>}

                        <Input
                            value={firstNameValue}
                            onChange={e => setFirstNameValue(e.target.value)}
                            placeholder="First name"/>

                        <Input
                            value={lastNameValue}
                            onChange={e => setLastNameValue(e.target.value)}
                            placeholder="Last name"/>

                        <Input
                            value={emailValue}
                            onChange={e => setEmailValue(e.target.value)}
                            placeholder="Email address"/>

                        <Input
                            type="password"
                            value={passwordValue}
                            onChange={e => setPasswordValue(e.target.value)}
                            placeholder="New password"/>

                        <Input
                            type="password"
                            value={newPasswordValue}
                            onChange={e => setNewPasswordValue(e.target.value)}
                            placeholder="Verify your new password"/>

                        <Divider sx={{ mb: 3 }}/>

                        <Button onClick={ onUpdateUserClicked }>Update your account</Button>
                    </Stack>
                </Box>
            </Box>
        </Fragment>
    );
};
