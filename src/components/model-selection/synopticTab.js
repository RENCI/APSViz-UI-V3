import React, { Fragment, useState, useEffect } from 'react';
import { Button, Divider, Select, Stack } from '@mui/joy';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DropDownOptions from "@model-selection/DropDownOptions";
import CatalogItems from "@model-selection/catalogItems";

export const SynopticTabForm = () => {
    // declare all state variables for the synoptic tab dropdown data
    const [synopticDate, setSynopticDate] = useState('');
    const [synopticCycle, setSynopticCycle] = useState('');
    const [synopticGrid, setSynopticGrid] = useState('');
    const [synopticInstance, setSynopticInstance] = useState('');

    // init the data urls
    const rootUrl = `${process.env.REACT_APP_UI_DATA_URL}`;
    const basePulldownUrl = 'get_pulldown_data?met_class=synoptic&use_v3_sp=true';
    const baseDataUrl = 'get_ui_data_secure?met_class=synoptic&use_v3_sp=true';
    const [finalDataUrl, setFinalDataUrl] = useState(rootUrl + basePulldownUrl);

    // storage for received data to render pulldowns
    const [dropDownData, setDropDownData] = useState(null);
    const [catalogData, setCatalogData] = useState(null);

    /**
     * method to initiate a model search with the filter selections on the synoptic form
     *
     * @param event
     */
    const formSynopticSubmit = (event) => {
        // avoid the usual form submit operations
        event.preventDefault();

        // gather all the form data
        const formData = new FormData(event.target);
        const formJson = Object.fromEntries(formData.entries());

        // build the query string from the submitted form data
        const queryString =
            ((formJson['synoptic-date'] !== "") ? '&run_date=' + formJson['synoptic-date'] : '') +
            ((formJson['synoptic-cycle'] !== "") ? '&cycle=' + formJson['synoptic-cycle'] : '') +
            ((formJson['synoptic-grid'] !== "") ? '&grid_type=' + formJson['synoptic-grid'] : '') +
            ((formJson['synoptic-instance'] !== "") ? '&instance=' + formJson['synoptic-instance'] : '');

        // set the url to go after ui data
        setFinalDataUrl(rootUrl + baseDataUrl + queryString);
    };

     /**
     * Retrieves and returns the model data in json format
     *
     * @param url
     * @returns { json }
     */
    useQuery( {
        // specify the data key and url to use
        queryKey: ['apsviz-synoptic-model-data', finalDataUrl],

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
        // build the new data url
        buildDataUrl();
    });

    /**
     * method to build the query sting to get data
     *
     */
    function buildDataUrl() {
        // init the query string
        let query_string = '';

        // set the query string
        if (synopticDate !== '' && synopticDate != null) { query_string += '&run_date=' + synopticDate.toISOString().split("T")[0]; }

        // set the query string
        if (synopticCycle !== '' && synopticCycle != null) { query_string += '&cycle=' + synopticCycle; }

        // set the query string
        if (synopticGrid !== '' && synopticGrid != null) { query_string += '&grid_type=' + synopticGrid; }

        // set the query string
        if (synopticInstance !== '' && synopticInstance != null) { query_string += '&instance_name=' + synopticInstance; }

        // set the pulldown data url. this will trigger data gathering
        setFinalDataUrl(rootUrl + basePulldownUrl + query_string);
    }

    /**
     * filter the date picker to only allow certain dates to be selected
     *
     * @param date
     * @returns {boolean}
     */
    const disableDate = (date) => {
        // return false if the date is not found in the list of available dates
        return !dropDownData['run_dates'].includes(date.toISOString().split("T")[0]);
    };

    /**
     * return the rendered component
     */
    return (
        <Fragment>
            <form name={"Synoptic"} onSubmit={ formSynopticSubmit }>
                <Stack spacing={1}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            name="synoptic-date"
                            shouldDisableDate={ disableDate }
                            slotProps={{textField: {size: 'small'}, field: { clearable: true }}}
                            onChange={ (newValue) => { setSynopticDate(newValue); }}/>
                    </LocalizationProvider>

                    <Select name="synoptic-cycle" placeholder="Please select a cycle" onChange={(e, newValue) => {
                        setSynopticCycle(newValue); }}>
                        <DropDownOptions data={dropDownData} type={'cycles'} />
                    </Select>

                    <Select name="synoptic-grid" placeholder="Please select a grid" onChange={(e, newValue) => {
                        setSynopticGrid(newValue); }}>
                        <DropDownOptions data={dropDownData} type={'grid_types'} />
                    </Select>

                    <Select name="synoptic-instance" placeholder="Please select an instance" onChange={(e, newValue) => {
                        setSynopticInstance(newValue); }}>
                        <DropDownOptions data={dropDownData} type={'instance_names'} />
                    </Select>

                    <Button type="submit">Submit</Button>
                    <Button type="reset">Reset</Button>
                </Stack>

                <Divider sx={{m: 2}}/>

                <Stack sx={{maxHeight: "400px", overflow: "auto"}}>
                {
                    <CatalogItems data={ catalogData } isTropical = { false } />
                }
                </Stack>
            </form>
        </Fragment>
    );
};