import React, {useState, Fragment} from "react";
import {useAuth} from "@auth";
import {getNamespacedEnvParam} from "@utils";
import axios from 'axios';
import {Button, Divider, Typography, Input, Stack, Box} from '@mui/joy';
import isaac from "isaac";

// load the encryption library
const bcrypt = require('react-native-bcrypt');

// override using unsecure math.random when generating hashes
bcrypt.setRandomFallback = (len) => {
    const buf = new Uint8Array(len);

    return buf.map(() => Math.floor(isaac.random() * 256));
};

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
    const { addUser } = useAuth();

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
     * @param email
     * @param first_name
     * @param last_name
     * @param password
     * @param new_password
     *
     * @returns { boolean }
     */
    const validateAddParams = (email, first_name, last_name, password, new_password) => {
        // all fields are mandatory
        if (email && first_name && last_name && password && new_password && (password === new_password)) {
            // TODO: perform formatting validations for each param

            return true;
        }
        else {
            // let the user know
            setError('Please check to make sure you have entered data properly in all fields.');

            // return failure
            return false;
        }
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
    };

    /**
     * handles user add button event
     *
     * @returns {Promise<void>}
     */
    const onAddUserClicked = async () => {
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

            // if the user was not found
            if (ret_val === 404)
                setError('User not found');
            // serious error on the server
            else if (ret_val === 500)
                setError("Error adding the user.");
            // continue to validate the credentials
            else {
                // if the call successful and it is the correct password
                if (ret_val['success'])
                    // save the new user profile
                    addUser();
                else {
                    // show the error
                    setError('Error adding the user. Please contact an administrator.');
                }
            }
        }
    };

    // render the page
    return (
        <Fragment>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                minHeight: '100',
                alignItems: 'center'
            }}>
                <Box sx={{
                    m: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 1,
                    borderColor: 'primary.main'
                }}>
                    <Stack spacing={1} sx={{m: 2}}>
                        <Typography variant="h1" sx={{mt: 1, mb: 2, fontSize: 20}}>Create an account</Typography>

                        { error && <Typography sx={{fontSize: 15, color: 'red'}}>{ error }</Typography> }

                        <Input
                            value={ firstNameValue }
                            onChange={ e => setFirstNameValue(e.target.value) }
                            placeholder="First name"/>

                        <Input
                            value={ lastNameValue }
                            onChange={ e => setLastNameValue(e.target.value) }
                            placeholder="Last name"/>

                        <Input
                            value={ emailValue }
                            onChange={ e => setEmailValue(e.target.value)}
                            placeholder="Email address"/>

                        <Input
                            type="password"
                            value={ passwordValue }
                            onChange={ e => setPasswordValue( e.target.value) }
                            placeholder="Password"/>

                        <Input
                            type="password"
                            value={ newPasswordValue }
                            onChange={ e => setNewPasswordValue(e.target.value) }
                            placeholder="Verify your password"/>

                        <Divider/>

                        <Button
                            disabled={ !emailValue || !firstNameValue || !lastNameValue || !passwordValue || !newPasswordValue || !(passwordValue === newPasswordValue) }
                            onClick={ onAddUserClicked }>Create your account
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Fragment>
    );
};
