import React, { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import PropTypes from "prop-types";

// create a new context
const AuthContext = createContext();

/**
 * component that provides the authentication of the user
 *
 * @param children
 * @returns React.ReactElement
 * @constructor
 */
export const AuthProvider = ({ children }) => {
    // assign local storage for the user profile
    const [userProfile, setUserProfile, removeUserProfile] = useCookies(['userProfile']);
    const navigate = useNavigate();

    // call this function to authenticate the user
    const login = async (userProfile) => {
        // set the user profile data
        setUserProfile('userProfile', userProfile, { path: '/', maxAge: 21600 });

        // redirect to the main page
        navigate('/');
    };

    // call this function to sign out a logged-in user
    const logout = () => {
        // remove the user data
        removeUserProfile('userProfile');

        // redirect to the login page
        navigate('/login');
    };

    // call this to navigate to the add-user page
    const addUser = () => {
        // remove the user data
        removeUserProfile('userProfile');

        // redirect to the add a user page
        navigate('/login', {replace: true});
    };

        // call this to navigate to the add-user page
    const navAddUser = () => {
        // remove the user data
        removeUserProfile('userProfile');

        // redirect to the add a user page
        navigate('/add-user', {replace: true});
    };

    // call this to navigate to the update user page
    const updateUser = (newUserProfile) => {
        // remove the user data
        setUserProfile('userProfile', newUserProfile, { path: '/', maxAge: 21600 });
    };

    // define methods and user profile
    const value = useMemo(
        () => ({
            userProfile,
            login,
            logout,
            navAddUser,
            addUser,
            updateUser
        }),
        [userProfile]
    );

    // return a new authentication provider
    return <AuthContext.Provider value={ value }>{ children }</AuthContext.Provider>;
};

// define the object properties
AuthProvider.propTypes = {
    children: PropTypes.node
};

/**
 * creates an authorization component
 *
 * @returns {*}
 */
export const useAuth = () => {
    return useContext(AuthContext);
};