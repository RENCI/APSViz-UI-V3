import React, { Fragment, useState, useEffect } from 'react';
import { Button, Divider, Select, Stack } from '@mui/joy';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DropDownOptions from "@model-selection/DropDownOptions";
import CatalogItems from "@model-selection/catalogItems";
import { getNamespacedEnvParam, getBrandingHandler } from "@utils/map-utils";

/**
 * Form to filter/selt tropical runs
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const TropicalTabForm = () => {
    // declare state variables for all tropical tab controls
    const [tropicalStorm, setTropicalStorm] = useState(null);
    const [tropicalAdvisory, setTropicalAdvisory] = useState(null);
    const [tropicalGrid, setTropicalGrid] = useState(null);
    const [tropicalInstance, setTropicalInstance] = useState(null);

    // init the data urls
    const rootUrl = getNamespacedEnvParam('REACT_APP_UI_DATA_URL') ;
    const basePulldownUrl = `get_pulldown_data?met_class=tropical&use_v3_sp=true${ getBrandingHandler() }`;
    const baseDataUrl = `get_ui_data_secure?met_class=tropical&use_v3_sp=true${ getBrandingHandler() }`;
    const [finalDataUrl, setFinalDataUrl] = useState(rootUrl + basePulldownUrl);

    // storage for received data to render pulldowns
    const [dropDownData, setDropDownData] = useState(null);
    const [catalogData, setCatalogData] = useState(null);

    /**
     * method to initiate a model search with the filter selections on the tropical form
     *
     * @param event
     */
    const formTropicalHandler = (event) => {
        // avoid doing the usual submit operations
        event.preventDefault();

        // build the query string from the submitted form data
        let queryString =
            ((tropicalStorm) ? '&storm_name=' + tropicalStorm : '') +
            ((tropicalAdvisory) ? '&advisory_number=' + tropicalAdvisory : '') +
            ((tropicalGrid) ? '&grid_type=' + tropicalGrid : '') +
            ((tropicalInstance) ? '&instance=' + tropicalInstance : '');

        // set different limits on the data returned if no filter params were passed (in days)
        if (queryString === '') {
            queryString += '&limit=60';
        }
        else {
            queryString += '&limit=10';
        }

        // build the url to get the ui data
        setFinalDataUrl(rootUrl + baseDataUrl + queryString);
    };

    /**
     * Retrieves and returns the dropdown data in json format
     *
     * @param url
     * @returns { json }
     */
    // return the data to the caller
    useQuery( {
        // specify the data key and url to use
        queryKey: ['apsviz-tropical-dropdown-data', finalDataUrl],

        // create the function to call for data
        queryFn: async () => {
            // create the authorization header
            const requestOptions = {
                method: 'GET',
                headers: { Authorization: `Bearer ${ getNamespacedEnvParam('REACT_APP_UI_DATA_TOKEN') }`}
            };
            // make the call to get the data
            const {data} = await axios.get(finalDataUrl, requestOptions);

            // check the request type
            if (finalDataUrl.indexOf('get_pulldown_data') !== -1) {
                // save the dropdown data
                setDropDownData(data);
            }
            else {
                // save the catalog data
                setCatalogData(data);
            }

            // return something
            return true;
        },

        refetchOnWindowFocus: false

    });

    /**
     * this will build the data url and will cause a DB hit
     */
    useEffect(() => {
        // build the data url
        buildDropDownDataUrl();
    });

    /**
     * resets the form
     */
    function resetForm() {
        // reset the form controls
        setTropicalStorm(null);
        setTropicalAdvisory(null);
        setTropicalGrid(null);
        setTropicalInstance(null);

        // and clear out any data retrieved
        setCatalogData(null);
    }

    // buildDropDownDataUrl();
    /**
     * method to build the query sting to get data
     *
     */
    function buildDropDownDataUrl() {
        // init the query string
        let queryString = '';

        // set the storm query string
        if (tropicalStorm !== '' && tropicalStorm !== null) { queryString += '&storm_name=' + tropicalStorm; }

        // set the advisory query string
        if (tropicalAdvisory !== '' && tropicalAdvisory !== null) { queryString += '&advisory_number=' + tropicalAdvisory; }

        // set the grin query string
        if (tropicalGrid !== '' && tropicalGrid !== null) { queryString += '&grid_type=' + tropicalGrid; }

        // set the instance query string
        if (tropicalInstance !== '' && tropicalInstance !== null) { queryString += '&instance_name=' + tropicalInstance; }

        // set the pulldown data url. this will trigger a data pull
        setFinalDataUrl(rootUrl + basePulldownUrl + queryString);
    }

    /**
     * return the rendered component
     */
    return (
        <Fragment>
            <form name={ "Tropical" } onSubmit={ formTropicalHandler }>
                <Stack spacing={1}>
                    <Select name="tropical-storm-name" sx={{ fontSize: 'md'}} value={ tropicalStorm } placeholder="Please select a tropical storm" onChange={(e, newValue) => {
                        setTropicalStorm(newValue); }}>
                        <DropDownOptions data={dropDownData} type={'storm_names'}/>
                    </Select>
                    <Select name="tropical-advisory" sx={{ fontSize: 'md'}} value={ tropicalAdvisory } placeholder="Please select an advisory" onChange={(e, newValue) => {
                        setTropicalAdvisory(newValue); }}>
                        <DropDownOptions data={ dropDownData } type={ 'advisory_numbers' } />
                    </Select>
                    <Select name="tropical-grid" sx={{ fontSize: 'md'}} value={ tropicalGrid } placeholder="Please select a grid" onChange={(e, newValue) => {
                        setTropicalGrid(newValue); }}>
                        <DropDownOptions data={ dropDownData } type={ 'grid_types' } />
                    </Select>
                    <Select name="tropical-instance" sx={{ fontSize: 'md'}} value={ tropicalInstance } placeholder="Please select an instance" onChange={(e, newValue) => {
                        setTropicalInstance(newValue); }}>
                        <DropDownOptions data={ dropDownData } type={ 'instance_names' } />
                    </Select>

                    <Button type="submit">Submit</Button>
                    <Button type="reset" onClick={ resetForm }>Reset</Button>
                </Stack>

                <Divider sx={{ m: 2 }}/>

                <Stack>
                { <CatalogItems data={ catalogData } isTropical={ true } /> }
                </Stack>
            </form>
    </Fragment>);
};
