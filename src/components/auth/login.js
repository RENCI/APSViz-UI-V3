import React, {useState, Fragment } from "react";
import {useAuth} from "@auth";
import {getNamespacedEnvParam} from "@utils";
import axios from 'axios';
import {Button, Divider, Typography, Input, Stack, Box} from '@mui/joy';
import { Branding } from "@control-panel";

/**
 * page to collect the user credentials and verify them
 *
 * @returns React.ReactElement
 * @constructor
 */
export const Login = () => {
    // state for the date validation error
    const [error, setError] = useState(null);

    // storage for the username and password
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    // save the user details and redirect to the main page
    const {login, navAddUser} = useAuth();

    /**
     * handles the login button event
     *
     * @returns
     */
    const onLogInClicked = async (e) => {
        e.preventDefault();

        // create the authorization header
        const requestOptions = {
            method: 'GET',
            headers: {Authorization: `Bearer ${getNamespacedEnvParam('REACT_APP_UI_DATA_TOKEN')}`}
        };

        // build up the url
        const data_url = `${getNamespacedEnvParam('REACT_APP_UI_DATA_URL')}verify_user?email=${emailValue}`;

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
            setError('User not found');
        // serious error on the server
        else if (ret_val === 500)
            setError("Error validating the user.");
        // continue to validate the credentials
        else {
            // crytography library
            const bcrypt = require('react-native-bcrypt');

            // if the call successful and it is the correct password
            if (ret_val['success'] && bcrypt.compareSync(passwordValue, ret_val['profile']['password_hash']))
                // save the new user profile
                login(ret_val);
            else {
                // show the error
                setError('Denied.');
            }
        }
    };

    // render the page
    return (
        <Fragment>
            <form name={"Synoptic"} onSubmit={ onLogInClicked }>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    minHeight: '100',
                    alignItems: 'center'
                }}>
                    <Box bgcolor="white" sx={{
                        m: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: 3,
                        borderColor: '#6495ED'
                    }}>
                        <Stack spacing={ 2 } sx={{ m: 2 }}>
                            <Box sx={{
                                m: 2,
                                border: 3,
                                borderColor: '#6495ED'
                            }}>
                                <Branding/>
                            </Box>

                            {error && <Typography sx={{ fontSize: 15, color: 'red' }}>{ error }</Typography> }

                            <Input
                                value={ emailValue }
                                onChange={ e => setEmailValue(e.target.value) }
                                placeholder="Email address"/>

                            <Input
                                type="password"
                                value={ passwordValue }
                                onChange={ e => setPasswordValue(e.target.value) }
                                placeholder="Password"/>

                            <Divider/>

                            <Button
                                type="submit"
                                disabled={ !emailValue || !passwordValue }
                            >Log in
                            </Button>

                            <Button onClick={ () => navAddUser() }>Don&#39;t have an account? Sign Up</Button>
                        </Stack>
                    </Box>
                </Box>
            </form>
        </Fragment>
    );
};
