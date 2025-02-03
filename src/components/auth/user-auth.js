import React, { createContext, useContext, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import PropTypes from "prop-types";
import { useLayers, useSettings } from '@context';
import { BasemapList } from "@utils";
import { useColorScheme } from '@mui/joy/styles';
import { maxeleStyle, maxwvelStyle, swanStyle } from '@utils';

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
    const { setBaseMap } = useLayers();

    // get all the associated setting handles
    const { useUTC, unitsType, mapStyle, layerOpacity, speedType } = useSettings();
    const { mode, setMode } = useColorScheme();

    // define methods and the user profile
    const value = useMemo(() => (
            {
                userProfile,
                login,
                logout,
                navAddUser,
                addUser,
                updateUser
            }
        ),
        [userProfile]
    );

    // call this function to authenticate the user
    const login = async (userProfile) => {
        // set the user profile data
        setUserProfile('userProfile', userProfile, { path: '/', maxAge: 21600 });

        // apply the settings from the user profile
        applyUserSettings(userProfile);

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

    /**
     * loads app settings with the user's selections
     *
     * @param userProfile
     */
    const applyUserSettings = (userProfile) => {
        // apply all settings found in the user's profile details
        if (userProfile !== undefined) {
            // load the layer styles
            loadSelectedLayerStyles(userProfile.profile);

            // load the profile details
            loadProfileDetails(userProfile.profile.details);
        }
    };

    /**
     * sets the UI dark mode
     */
    const toggleDarkMode = useCallback((darkMode) => {
        // set the mode
        setMode(darkMode ? 'dark' : 'light');
    }, [mode]);

    /**
     * load the layer styles
     *
     * @param userProfile
     */
    const loadSelectedLayerStyles = (profile) => {
        if (profile.maxelestyle)
            mapStyle.maxele.set(profile.maxelestyle);
        else
            mapStyle.maxele.set(maxeleStyle);

        if (profile.maxwvelstyle)
            mapStyle.maxwvel.set(profile.maxwvelstyle);
        else
            mapStyle.maxwvel.set(maxwvelStyle);

        if (profile.swanstyle)
            mapStyle.swan.set(profile.swanstyle);
        else
            mapStyle.swan.set(swanStyle);
    };

    /**
     * loads the profile details
     *
     * @param userProfile
     */
    const loadProfileDetails = (profile) => {
        // use the base map if it was specified
        if (profile.basemap) {
            // get the basemap entry from the list
            const selectedBasemap = BasemapList.filter((map) => map.title === profile.basemap);

            // if the entry was found
            if (selectedBasemap.length === 1) {
                // set the base map in state
                setBaseMap(selectedBasemap[0]);

                // set the basemap in local storage
                localStorage.setItem('basemap', JSON.stringify(selectedBasemap[0].title));
            }
        }

        // set the dark mode
        toggleDarkMode(profile.darkMode === "dark");

        if (profile.unitsType) unitsType.set(profile.unitsType);
        if (profile.useUTC === 'true') useUTC.unset(); // confusing, I know. the control is labeled "use your locale"
        if (profile.speedType) speedType.set(profile.speedType);
        if (profile.maxwvel_opacity) layerOpacity.maxwvel.set(parseFloat(profile.maxwvel_opacity));
        if (profile.maxele_opacity) layerOpacity.maxele.set(parseFloat(profile.maxele_opacity));
        if (profile.swan_opacity) layerOpacity.swan.set(parseFloat(profile.swan_opacity));
    };

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
export const userAuth = () => {
    return useContext(AuthContext);
};