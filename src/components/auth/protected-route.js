import React from 'react';
import { Navigate } from "react-router-dom";
import { userAuth } from "@auth";
import PropTypes from "prop-types";

/**
 * defines a protected route, a route that can only be accessed when logged in
 *
 * @param children
 * @returns React.ReactElement
 */
export const ProtectedRoute = ({children}) => {
    // grab an auth object
    const { userProfile } = userAuth();

    // if the user was not authenticated
    if (Object.keys(userProfile).length === 0) {
        // user is not authenticated
        return <Navigate to="/login"/>;
    }

    // else go to the page requested
    return children;
};

// define the object properties
ProtectedRoute.propTypes = {
    children: PropTypes.node
};
