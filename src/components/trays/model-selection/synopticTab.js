import React, { Fragment, useState, useEffect, useMemo } from 'react';
import { Button, Divider, Select, Stack } from '@mui/joy';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DropDownOptions from "@model-selection/DropDownOptions";
import CatalogItems from "@model-selection/catalogItems";
import { getNamespacedEnvParam, getBrandingHandler } from "@utils/map-utils";
import dayjs from 'dayjs';

/**
 * Form to filter/select synoptic runs
 *
 * @returns React.ReactElement
 * @constructor
 */
export const SynopticTabForm = () => {

    // declare all state variables for the synoptic tab dropdown data
    const [synopticDate, setSynopticDate] = useState(dayjs(new Date()));
    const [synopticCycle, setSynopticCycle] = useState(null);
    const [synopticGrid, setSynopticGrid] = useState(null);
    const [synopticInstance, setSynopticInstance] = useState(null);
    const [datePickerKey, setDatePickerKey] = useState("defaultKey");

    // init the data urls
    const rootUrl = `${ getNamespacedEnvParam('REACT_APP_UI_DATA_URL') }`;
    const basePulldownUrl = `get_pulldown_data?met_class=synoptic${ getBrandingHandler() }`;
    const baseDataUrl = `get_ui_data_secure?met_class=synoptic&use_v3_sp=true${ getBrandingHandler() }`;
    const [finalDataUrl, setFinalDataUrl] = useState(rootUrl + basePulldownUrl);

    // storage for received data to render pulldowns
    const [dropDownData, setDropDownData] = useState(null);
    const [catalogData, setCatalogData] = useState(null);

    // state for the date validation error
    const [error, setError] = useState(null);

    /**
     * sets the date, checks for validity
     *
     * @param newValue
     */
    const setChangedSynopticDate = (newValue) => {
        // if there was a valid date
        if (!isNaN(newValue) && newValue !== null) {
            //console.log('setChangedSynopticDate Good date: ' + newValue.$d + ', error: ' + error + ', newValue: ' + newValue);
            // save the date
            setSynopticDate(newValue.$d);
        }
        // else handle a bad date
        else {
            //console.log('setChangedSynopticDate Bad date: ' + newValue);
            // clear the date
            setSynopticDate(null);
        }
    };

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
            ((synopticInstance) ? '&instance_name=' + synopticInstance : '');

        // set different limits on the data returned if no filter params were passed
        if (queryString === '') {
            queryString += '&limit=30';
        } else {
            queryString += '&limit=10';
        }

        // set the url to go after ui data
        setFinalDataUrl(rootUrl + baseDataUrl + queryString);
    };

    /**
     * Retrieves and returns the model data in JSON format
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
            const ret_val = await axios
                // make the call to get the data
                .get(finalDataUrl, requestOptions)
                // use the data returned
                .then (( response ) => {
                    // return the data
                    return response.data;
                })
                .catch (( error ) => {
                    // make sure we do not render anything
                    return error.response.status;
                });

            // if there was an error from the web service
            if (ret_val !== 500) {
                // check the request type to save it to the correct place
                if (finalDataUrl.indexOf('get_pulldown_data') !== -1) {
                    // save the dropdown data
                    setDropDownData(ret_val);
                }
                else {
                    // save the catalog data
                    setCatalogData(ret_val);
                }
            }
            else
                // reset the form data
                resetForm();

            // return something
            return true;
        }, refetchOnWindowFocus: false
    });

    /**
     * this will build the data url and will cause a web service/DB hit
     */
    useEffect(() => {
        // build the new data url
        buildDropDownDataUrl();
    });

    /**
     * resets the form
     */
    function resetForm() {
        // reset the control's key
        setDatePickerKey(Math.random().toString());

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
        // if there was data returned
        if (dropDownData) {
            // return false if the date is not found in the list of available dates
            return !dropDownData['run_dates'].includes(date.toISOString().split("T")[0]);
        }
    };

    /**
     * handles date picker error text
     *
     * @type {string}
     */
    const errorMessage = useMemo(() => {
        // handle the error type
        switch (error) {
            case 'maxDate': {
                return 'Please select a date that is not in the future';
            }

            case 'minDate': {
                return 'Please select a date after 01/01/2020';
            }

            case 'invalidDate': {
                return 'This date is not yet valid';
            }

            case 'shouldDisableDate': {
                return 'There is no data available on this date';
            }

            default: {
                return '';
            }
        }
    }, [error]);

    /**
     * return the rendered component
     */
    return (
        <Fragment>
            <form name={ "Synoptic" } onSubmit={ formSynopticSubmit }>
                <Stack spacing={ 1 }>
                    <LocalizationProvider dateAdapter={ AdapterDayjs }>
                        <DatePicker
                            key={ datePickerKey }
                            defaultValue={ dayjs(new Date()) }
                            onError={ (newError) => setError(newError) }
                            disableFuture
                            name="synoptic-date"
                            shouldDisableDate={ disableDate }
                            minDate={ dayjs('2023-06-01') }
                            slotProps={{
                                textField: { size: 'small', helperText: errorMessage},
                                field: { clearable: true },
                                actionBar: { actions: ['clear'] }, fontSize: 10
                            }}
                            onChange={ setChangedSynopticDate }/>

                    </LocalizationProvider>

                    <Select name="synoptic-cycle" sx={{ fontSize: 'sm' }} value={ synopticCycle } placeholder="Please select a cycle" onChange={ (e, newValue) => {
                        setSynopticCycle(newValue);
                    }}>
                        <DropDownOptions data={ dropDownData } type={ 'cycles' }/>
                    </Select>

                    <Select name="synoptic-grid" sx={{ fontSize: 'sm' }} value={ synopticGrid } placeholder="Please select a grid" onChange={ (e, newValue) => {
                        setSynopticGrid(newValue);
                    }}>
                        <DropDownOptions data={ dropDownData } type={ 'grid_types' }/>
                    </Select>

                    <Select name="synoptic-instance" sx={{ fontSize: 'sm' }} value={ synopticInstance } placeholder="Please select an instance" onChange={ (e, newValue) => {
                        setSynopticInstance(newValue);
                    }}>
                        <DropDownOptions data={ dropDownData } type={'instance_names'}/>
                    </Select>

                    <Button type="submit" disabled={ !!error }>Submit</Button>
                    <Button type="reset" onClick={ resetForm }>Reset</Button>
                </Stack>

                <Divider sx={{ m: 2 }}/>

                <Stack>
        { <CatalogItems data={ catalogData } isTropical={ false }/> }
                </Stack>
            </form>
        </Fragment>
    );
};