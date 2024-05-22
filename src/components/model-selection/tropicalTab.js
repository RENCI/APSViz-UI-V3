import React, {Fragment, useState, useEffect} from 'react';
import {Button, Divider, Select, Stack} from '@mui/joy';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DropDownOptions from "@model-selection/DropDownOptions";
import CatalogItems from "@model-selection/catalogItems";

export const TropicalTabForm = () => {
    // declare state variables for all tropical tab controls
    const [tropicalStorm, setTropicalStorm] = useState('');
    const [tropicalAdvisory, setTropicalAdvisory] = useState('');
    const [tropicalGrid, setTropicalGrid] = useState('');
    const [tropicalInstance, setTropicalInstance] = useState('');


    // init the data urls
    const rootUrl = `${process.env.REACT_APP_UI_DATA_URL}`;
    const basePulldownUrl = 'get_pulldown_data?met_class=tropical&use_v3_sp=true';
    const baseDataUrl = 'get_ui_data_secure?met_class=tropical&use_v3_sp=true';
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
        // dont do the usual submit operations
        event.preventDefault();

        // gather all the form data
        const formData = new FormData(event.target);
        const formJson = Object.fromEntries(formData.entries());

        // build the query string from the submitted form data
        const queryString =
            ((formJson['tropical-storm-name'] !== "") ? '&storm_name=' + formJson['tropical-storm-name'] : '') +
            ((formJson['tropical-advisory'] !== "") ? '&advisory_number=' + formJson['tropical-advisory'] : '') +
            ((formJson['tropical-grid'] !== "") ? '&grid_type=' + formJson['tropical-grid'] : '') +
            ((formJson['tropical-instance'] !== "") ? '&instance=' + formJson['tropical-instance'] : '');

        // set the url to go after ui data
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
                headers: {Authorization: `Bearer ${process.env.REACT_APP_UI_DATA_TOKEN}`}
            };
            // make the call to get the data
            const {data} = await axios.get(finalDataUrl, requestOptions);

            // check the request type
            if (finalDataUrl.indexOf('get_pulldown_data') !== -1) {
                // save the dropdown data
                setDropDownData(data);
            }
            else {
                // re-group the data
                /**
                    the tropical result tree will look like:

                    date (YYYY-MM-DD)
                        advisory (4350-001-ofc)
                            product (4370-001-ofcl-obs)
                            product...
                        advisory...
                    date...
                */

                // save the catalog data
                setCatalogData(data);
            }

            // return something
            return true;
        }
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
        setTropicalStorm('');
        setTropicalAdvisory('');
        setTropicalGrid('');
        setTropicalInstance('');

        buildDropDownDataUrl();
    }

    /**
     * method to build the query sting to get data
     *
     */
    function buildDropDownDataUrl() {
        // init the query string
        let query_string = '';

        // set the storm query string
        if (tropicalStorm !== '' && tropicalStorm !== null) { query_string += '&storm_name=' + tropicalStorm; }

        // set the advisory query string
        if (tropicalAdvisory !== '' && tropicalAdvisory !== null) { query_string += '&advisory_number=' + tropicalAdvisory; }

        // set the grin query string
        if (tropicalGrid !== '' && tropicalGrid !== null) {query_string += '&grid_type=' + tropicalGrid; }

        // set the instance query string
        if (tropicalInstance !== '' && tropicalInstance !== null) {query_string += '&instance_name=' + tropicalInstance; }

        // set the pulldown data url. this will trigger a data gathering
        setFinalDataUrl(rootUrl + basePulldownUrl + query_string);
    }

    /**
     * return the rendered component
     */
    return (
        <Fragment>
            <form name={"Tropical"} onSubmit={formTropicalHandler}>
                <Stack spacing={1}>
                    <Select name="tropical-storm-name" defaultValue="" placeholder="Please select a tropical storm" onChange={(e, newValue) => {
                        setTropicalStorm(newValue); }}>
                        <DropDownOptions data={dropDownData} type={'storm_names'} />
                    </Select>
                    <Select name="tropical-advisory" placeholder="Please select an advisory" onChange={(e, newValue) => {
                        setTropicalAdvisory(newValue); }}>
                        <DropDownOptions data={ dropDownData } type={ 'advisory_numbers' } />
                    </Select>
                    <Select name="tropical-grid" placeholder="Please select a grid" onChange={(e, newValue) => {
                        setTropicalGrid(newValue); }}>
                        <DropDownOptions data={ dropDownData } type={ 'grid_types' } />
                    </Select>
                    <Select name="tropical-instance" placeholder="Please select an instance" onChange={(e, newValue) => {
                        setTropicalInstance(newValue); }}>
                        <DropDownOptions data={ dropDownData } type={ 'instance_names' } />
                    </Select>

                    <Button type="submit">Submit</Button>
                    <Button type="reset" onClick={ resetForm }>Reset</Button>
                </Stack>

                <Divider sx={{m: 2}}/>

                <Stack sx={{maxHeight: "400px", overflow: "auto"}}>
                {
                    <CatalogItems data={ catalogData } />
                }
                </Stack>
            </form>
    </Fragment>);
};
