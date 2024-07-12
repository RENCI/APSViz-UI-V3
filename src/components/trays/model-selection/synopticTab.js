import React, { Fragment, useState, useEffect } from 'react';
import { Button, Divider, Select, Stack } from '@mui/joy';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DropDownOptions from "@model-selection/DropDownOptions";
import CatalogItems from "@model-selection/catalogItems";
import { getNamespacedEnvParam } from "@utils/map-utils";

/**
 * Form to filter/select synoptic runs
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const SynopticTabForm = () => {

    // declare all state variables for the synoptic tab dropdown data
    const [synopticDate, setSynopticDate] = useState(null);
    const [synopticCycle, setSynopticCycle] = useState(null);
    const [synopticGrid, setSynopticGrid] = useState(null);
    const [synopticInstance, setSynopticInstance] = useState(null);

    // init the data urls
    const rootUrl = `${ getNamespacedEnvParam('REACT_APP_UI_DATA_URL_LOCAL') }`;
    const basePulldownUrl = 'get_pulldown_data?met_class=synoptic&use_v3_sp=true';
    const baseDataUrl = 'get_ui_data_secure?limit=14&met_class=synoptic&use_v3_sp=true';
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
        // avoid doing the usual form submit operations
        event.preventDefault();

        // build the query string from the submitted form data
        let queryString =
            ((synopticDate) ? '&run_date=' + synopticDate.toISOString() : '') +
            ((synopticCycle) ? '&cycle=' + synopticCycle : '') +
            ((synopticGrid) ? '&grid_type=' + synopticGrid : '') +
            ((synopticInstance) ? '&instance=' + synopticInstance : '');

        // set different limits on the data returned if no filter params were passed
        if (queryString === '') {
            queryString += '&limit=60';
        } else {
            queryString += '&limit=10';
        }

        // set the url to go after ui data
        setFinalDataUrl(rootUrl + baseDataUrl + queryString);
    };

    /**
     * Retrieves and returns the model data in json format
     *
     * @param url
     * @returns { json }
     */
    useQuery({
        // specify the data key and url to use
        queryKey: ['apsviz-synoptic-model-data', finalDataUrl],

        // create the function to call for data
        queryFn: async () => {
            // create the authorization header
            const requestOptions = {
                method: 'GET',
                headers: { Authorization: `Bearer ${ getNamespacedEnvParam('REACT_APP_UI_DATA_TOKEN') }` }
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
        buildDropDownDataUrl();
    });

    /**
     * resets the form
     */
    function resetForm() {
        // reset the form controls
        setSynopticDate(null);
        setSynopticCycle(null);
        setSynopticGrid(null);
        setSynopticInstance(null);

        // and clear out any data retrieved
        setCatalogData(null);
    }

    /**
     * method to build the query sting to get data
     *
     */
    function buildDropDownDataUrl() {
        // init the query string
        let queryString = '';

        // set the query string
        if (synopticDate !== '' && synopticDate != null) {
            queryString += '&run_date=' + synopticDate.toISOString().split("T")[0];
        }

        // set the query string
        if (synopticCycle !== '' && synopticCycle != null) {
            queryString += '&cycle=' + synopticCycle;
        }

        // set the query string
        if (synopticGrid !== '' && synopticGrid != null) {
            queryString += '&grid_type=' + synopticGrid;
        }

        // set the query string
        if (synopticInstance !== '' && synopticInstance != null) {
            queryString += '&instance_name=' + synopticInstance;
        }

        // set the pulldown data url. this will trigger data gathering
        setFinalDataUrl(rootUrl + basePulldownUrl + queryString);
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
            <form name={"Synoptic"} onSubmit={formSynopticSubmit}>
                <Stack spacing={1}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            name="synoptic-date"
                            shouldDisableDate={disableDate}
                            slotProps={{textField: {size: 'small'}, field: {clearable: true}}}
                            onChange={(newValue) => {
                                setSynopticDate(newValue.$d);
                            }}/>
                    </LocalizationProvider>

                    <Select name="synoptic-cycle" value={synopticCycle} placeholder="Please select a cycle" onChange={(e, newValue) => {
                        setSynopticCycle(newValue);
                    }}>
                        <DropDownOptions data={dropDownData} type={'cycles'}/>
                    </Select>

                    <Select name="synoptic-grid" value={synopticGrid} placeholder="Please select a grid" onChange={(e, newValue) => {
                        setSynopticGrid(newValue);
                    }}>
                        <DropDownOptions data={dropDownData} type={'grid_types'}/>
                    </Select>

                    <Select name="synoptic-instance" value={synopticInstance} placeholder="Please select an instance" onChange={(e, newValue) => {
                        setSynopticInstance(newValue);
                    }}>
                        <DropDownOptions data={dropDownData} type={'instance_names'}/>
                    </Select>

                    <Button type="submit">Submit</Button>
                    <Button type="reset" onClick={resetForm}>Reset</Button>
                </Stack>

                <Divider sx={{m: 2}}/>

                <Stack>
                    {<CatalogItems data={catalogData} isTropical={false}/>}
                </Stack>
            </form>
        </Fragment>
    );
};