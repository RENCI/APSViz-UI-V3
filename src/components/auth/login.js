import React, { useState} from "react";
import axios from 'axios';
import { userAuth } from "@auth";
import { getNamespacedEnvParam } from "@utils";
import { Button, Divider, Typography, Input, Stack, Box } from '@mui/joy';
import { Branding } from "@control-panel";

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
export const Login = () => {
    // state for the date validation error
    const [ error, setError ] = useState(null);

    // storage for the username and password
    const [ emailValue, setEmailValue ] = useState('');
    const [ passwordValue, setPasswordValue ] = useState('');

    // methods to log into to the app and redirect to the main page
    const { login, navAddUser } = userAuth();

    // create a default guest account profile
    const guest_acct = {
        "success": true,
        "role": {"type": "User"},
        "profile": {
            "email": "Guest",
            "role_id": 0,
            "details": {"useUTC": "false", "basemap": "USGS Topo", "darkMode": "light", "last_name": "Guest", "speedType": "knots", "unitsType": "imperial", "created_on": "", "first_name": "Guest", "swan_opacity": "1", "maxele_opacity": "1", "maxwvel_opacity": "1"},
            "maxelestyle": null,
            "maxwvelstyle": null,
            "swanstyle": null
        }
    };

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
                // handle an axios error
                if(error.name === 'AxiosError')
                    return 500;
                // else handle an error coming from the web service
                else
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
            // if the call was successful and it is the correct password
            if (ret_val['success'] &&
                // validate the password
                (bcrypt.compareSync(passwordValue, ret_val['profile']['password_hash']) || ret_val['profile']['email'] === 'guest')) {

                // save the new user profile
                login(ret_val);
            }
            else {
                // show the error
                setError('Incorrect password or user doesnt exist.');
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

            <form name={"login"} onSubmit={ onLogInClicked }>
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
                        borderColor: '#245F97'
                    }}>
                        <Stack spacing={ 2 } sx={{ m: 2 }}>
                            <Box sx={{
                                m: 2,
                                border: 3,
                                borderColor: '#245F97'
                            }}>
                                <Branding/>
                            </Box>

                            {error && <Typography sx={{ fontSize: 15, color: 'red' }}>{error}</Typography>}

                            <Input
                                value={emailValue}
                                onChange={ e => setEmailValue(e.target.value) }
                                placeholder="User name (Email address)"/>

                            <Input
                                type="password"
                                value={ passwordValue }
                                onChange={ e => setPasswordValue(e.target.value )}
                                placeholder="Password"/>

                            <Divider/>

                            <Button type="submit" disabled={ (!emailValue || !passwordValue) }>Log in</Button>
                            <Button onClick={ () => login(guest_acct) }>Log in as guest</Button>
                            <Button onClick={ () => navAddUser() }>Sign up for an account</Button>
                        </Stack>
                    </Box>
                </Box>
            </form>
        </div>
    );
};
