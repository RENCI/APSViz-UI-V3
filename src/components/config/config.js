import { useEffect, useState } from "react";
import { useLayers } from "@context";
import { getNamespacedEnvParam } from "@utils";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

/**
 * gets the default instance name for startup layers
 *
 */
export const getDefaultInstanceName = () => {
    // init the return
    let ret_val = '';

    // get the state variable that suppresses using the instance name
    const {
        defaultInstanceName
    } = useLayers();

    // if there is a valid default instance name
    if (!defaultInstanceName.includes('Error') && defaultInstanceName.length) {
        // build the extended query string
        ret_val = '&instance_name=' + defaultInstanceName;
    }

    // return the query string addition
    return ret_val;
};

/**
 * handles getting the default instance name
 *
 * @returns React.ReactElement
 * @constructor
 */
export const Config = () => {
    // get the message alert details from state
    const { setDefaultInstanceName } = useLayers();

    // use this to trigger the data retrieval
    const [ dataUrl, setDataUrl ] = useState(null);

    /**
     * create a url to get the instance name
     */
    useEffect( () => {
        // get the site branding for the query string
        const theUrl = 'get_ui_instance_name?reset=false&site_branding=' + (window.location.href.includes('nopp') ? 'NOPP' : 'APSViz');

        // set the data url. this will spawn a data request
        setDataUrl(getNamespacedEnvParam('REACT_APP_UI_DATA_URL') + theUrl);
    }, [] );

    /**
     *  grab the default instance name
     */
    useQuery( {
        // specify the data key and url to use
        queryKey: ['get_ui_instance_name', dataUrl],

        // create the function to call for data
        queryFn: async () => {
            // create the authorization header
            const requestOptions = {
                method: 'GET',
                headers: { Authorization: `Bearer ${ getNamespacedEnvParam('REACT_APP_UI_DATA_TOKEN') }`}
            };

            // make the call to get the data
            const ret_val = await axios
                // make the call to get the data
                .get(dataUrl, requestOptions)
                // use the data returned
                .then (( response ) => {
                    // return the data
                    return response.data;
                })
                .catch (( error ) => {
                    // make sure we do not render anything
                    return error.response.status;
                });

            // if the retrieval did not have an issue
            if (typeof ret_val === 'string' && !ret_val.includes('Error'))
                // save the instance name value
                setDefaultInstanceName(ret_val);
            else
                // blank the instance name on any http or data gathering error.
                setDefaultInstanceName('');

            // return something
            return true;
        }, refetchOnWindowFocus: false
    });
};