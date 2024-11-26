import React, {createContext, useContext, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {useLocalStorage} from '@hooks';
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
    const [userProfile, setUserProfile] = useLocalStorage("user", null);
    const navigate = useNavigate();

    // call this function to authenticate the user
    const login = async (userProfile) => {
        // set the user profile data
        setUserProfile(userProfile);

        // redirect to the main page
        navigate("/");
    };

    // call this function to sign out a logged-in user
    const logout = () => {
        // remove the user data
        setUserProfile(null);

        // redirect to the login page
        navigate("/login");
    };

    // call this to navigate to the add user page
    const addUser = () => {
        // redirect to the add a user page
        navigate("/add-user", {replace: true});
    };

    // call this to navigate to the update user page
    const updateUser = () => {
        // redirect to the update user profile page
        navigate("/update-user", {replace: true});
    };

    // define methods and user profile
    const value = useMemo(
        () => ({
            userProfile,
            login,
            logout,
            addUser,
            updateUser
        }),
        [userProfile]
    );

    // return a new authentication provider
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
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