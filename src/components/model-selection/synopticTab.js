import React, { Fragment, useState, useEffect } from 'react';
import { Button, Divider, Select, Stack } from '@mui/joy';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import axios from 'axios';
import DropDownOptions from "@model-selection/DropDownOptions";

// import { LayerCard } from "@components/trays/layers/layer-card";

export const SynopticTabForm = () => {
    // declare all state variables for the synoptic tab dropdown data
    const [synopticDate, setSynopticDate] = useState('');
    const [synopticCycle, setSynopticCycle] = useState('');
    const [synopticGrid, setSynopticGrid] = useState('');
    const [synopticInstance, setSynopticInstance] = useState('');

    const base_dataUrl = `${process.env.REACT_APP_UI_DATA_URL}get_pulldown_data?met_class=synoptic`;
    const [dataUrl, setDataUrl] = useState(base_dataUrl);
    const [dropDownData, setDropDownData] = useState(null);

    /**
     * method to initiate a model search with the filter selections on the synoptic form
     *
     * @param event
     */
    const formSynopticHandler = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const formJson = Object.fromEntries(formData.entries());

        alert(JSON.stringify(formJson));

        const queryString =
            ((formJson['synoptic-date'] !== "") ? '&run_date=' + formJson['synoptic-date'] : '') +
            ((formJson['synoptic-cycle'] !== "") ? '&cycle=' + formJson['synoptic-cycle'] : '') +
            ((formJson['synoptic-grid'] !== "") ? '&grid_type=' + formJson['synoptic-grid'] : '') +
            ((formJson['synoptic-instance'] !== "") ? '&instance=' + formJson['synoptic-instance'] : '');
    };

     /**
     * Retrieves and returns the model data in json format
     *
     * @param url
     * @returns { json }
     */
    // return the data to the caller
    const {isPending, error, data} = useQuery( {
        // specify the data key and url to use
        queryKey: ['apsviz-synoptic-model-data', dataUrl],

        // create the function to call for data
        queryFn: async () => {
            // create the authorization header
            const requestOptions = {
                method: 'GET',
                headers: {Authorization: `Bearer ${process.env.REACT_APP_UI_DATA_TOKEN}`}
            };

            console.log('Getting data with: ' + dataUrl);

            // make the call to get the data
            const {data} = await axios.get(dataUrl, requestOptions);

            // save the dropdown data
            setDropDownData(data);

            return data;
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
        if (synopticDate !== '') { query_string += '&run_date=' + synopticDate.toISOString().split("T")[0]; }

        // set the query string
        if (synopticCycle !== '') { query_string += '&cycle=' + synopticCycle; }

        // set the query string
        if (synopticGrid !== '') { query_string += '&grid_type=' + synopticGrid; }

        // set the query string
        if (synopticInstance !== '') { query_string += '&instance_name=' + synopticInstance; }

        // set the new data url. this will trigger data gathering
        setDataUrl(base_dataUrl + query_string);
    }

    /**
     * return the rendered component
     */
    return (
        <Fragment>
            <form name={"Synoptic"} onSubmit={formSynopticHandler}>
                <Stack spacing={1}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            name="synoptic-date"
                            slotProps={{textField: {size: 'small'}}}
                            onChange={ (newValue) => setSynopticDate(newValue) } />
                    </LocalizationProvider>

                    <Select name="synoptic-cycle" placeholder="Synoptic cycle control" onChange={(e, newValue) => {
                        setSynopticCycle(newValue);
                    }}>
                        <DropDownOptions data={dropDownData} type={'cycles'} />
                    </Select>

                    <Select name="synoptic-grid" placeholder="Synoptic grid control" onChange={(e, newValue) => {
                        setSynopticGrid(newValue);
                    }}>
                        <DropDownOptions data={dropDownData} type={'grid_types'} />
                    </Select>

                    <Select name="synoptic-instance" placeholder="Synoptic instance control" onChange={(e, newValue) => {
                        setSynopticInstance(newValue);
                    }}>
                        <DropDownOptions data={dropDownData} type={'instance_names'} />
                    </Select>

                    <Button type="submit">Submit</Button>
                    <Button type="reset">Reset</Button>
                </Stack>

                <Divider sx={{m: 2}}/>

                <Stack sx={{maxHeight: "400px", overflow: "auto"}}>
                {
                    /*
                    list of search results goes here
                    may be able to leverage trays/layers/layer-card />
                    */
                }
                </Stack>
            </form>
        </Fragment>
    );
};