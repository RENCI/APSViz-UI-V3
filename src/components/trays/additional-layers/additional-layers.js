import React, { Fragment } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Stack } from '@mui/joy';
import { getNamespacedEnvParam } from "@utils/map-utils";
import ExternalLayerItems from "@additional-layers/externalLayerItems.js";
import { useLayers } from "@context";

/**
 * Select MaraCoos external layers
 *
 * @returns React.ReactElement
 * @constructor
 */
export const AdditionalLayers = () => {
    // init the data urls
    const rootUrl = getNamespacedEnvParam('REACT_APP_UI_DATA_URL');
    const baseDataUrl = `get_external_layers`;
    const finalDataUrl = rootUrl + baseDataUrl;

    // storage from state for rendering external layers
    const {
        externalLayers, setExternalLayers
    } = useLayers();

    /**
     * Retrieves and returns the dropdown data in JSON format
     *
     * @param url
     * @returns { json }
     */
    // return the data to the caller
    useQuery( {
        // specify the data key and url to use
        queryKey: ['apsviz-maracoos-data', finalDataUrl],

        // create the function to call for data
        queryFn: async () => {
            // create the authorization header
            const requestOptions = {
                method: 'GET',
                headers: { Authorization: `Bearer ${ getNamespacedEnvParam('REACT_APP_UI_DATA_TOKEN') }`}
            };

            // make the call to get the data
            const { data } = await axios.get(finalDataUrl, requestOptions);

            // add the default visibility state if data was returned
            if (data !== null) {
                // for each layer
                data.forEach(r => {
                    // set the default visibility
                    r.state = newLayerDefaultState();
                });

                // save the external layers data in state
                setExternalLayers(data);
            }

            // return something
            return true;
        },

        // do not reload this again
        refetchOnWindowFocus: false
    });

    /**
     * method to return the layer state properties
     *
     * @returns {{visible: boolean, opacity: number}}
     */
    const newLayerDefaultState = () => {
        // return the default state of not visible
        return ({ visible: false, opacity: 1.0 });
    };

    /**
     * return the rendered component if there is data
     */
    if (externalLayers != null) {
        return (
            <Fragment>
                <Stack spacing={ 1 } >
                    <ExternalLayerItems data={ externalLayers }/>
                </Stack>
            </Fragment>
        );
    }
};