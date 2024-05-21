import React, {Fragment, useState, useEffect} from 'react';
import {Button, Divider, Select, Stack} from '@mui/joy';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DropDownOptions from "@model-selection/DropDownOptions";
//import DropDownOptions from "@model-selection/DropDownOptions";

// import {LayerCard} from "@components/trays/layers/layer-card";

export const TropicalTabForm = () => {
    // declare state variables for all tropical tab controls
    const [tropicalStorm, setTropicalStorm] = useState('');
    const [tropicalAdvisory, setTropicalAdvisory] = useState('');
    const [tropicalGrid, setTropicalGrid] = useState('');
    const [tropicalInstance, setTropicalInstance] = useState('');

    const base_dropDownDataUrl = `${process.env.REACT_APP_UI_DATA_URL}get_pulldown_data?met_class=tropical`;
    const [dropDownDataUrl, setDropDownDataUrl] = useState(base_dropDownDataUrl);
    const [dropDownData, setDropDownData] = useState(null);

    const base_modelDataUrl = `${process.env.REACT_APP_UI_DATA_URL}get_pulldown_data?met_class=tropical`;
    const [modelDataUrl, setModelDataUrl] = useState(base_modelDataUrl);
    const [modelData, setModelData] = useState(null);
    /**
     * method to initiate a model search with the filter selections on the tropical form
     *
     * @param event
     */
    const formTropicalHandler = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const formJson = Object.fromEntries(formData.entries());

        alert(JSON.stringify(formJson));
    };

    /**
     * Retrieves and returns the dropdown data in json format
     *
     * @param url
     * @returns { json }
     */
    // return the data to the caller
    const {data} = useQuery( {
        // specify the data key and url to use
        queryKey: ['apsviz-tropical-dropdown-data', dropDownDataUrl],

        // create the function to call for data
        queryFn: async () => {
            // create the authorization header
            const requestOptions = {
                method: 'GET',
                headers: {Authorization: `Bearer ${process.env.REACT_APP_UI_DATA_TOKEN}`}
            };

            // make the call to get the data
            const {data} = await axios.get(dropDownDataUrl, requestOptions);

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
        buildDropDownDataUrl();
    });

    /**
     * method to build the query sting to get data
     *
     */
    function buildDropDownDataUrl() {
        // init the query string
        let query_string = '';

        // set the storm query string
        if (tropicalStorm !== '') { query_string += '&storm_name=' + tropicalStorm; }

        // set the advisory query string
        if (tropicalAdvisory !== '') { query_string += '&advisory_numbers=' + tropicalAdvisory; }

        // set the grin query string
        if (tropicalGrid !== '') {query_string += '&grid_type=' + tropicalGrid; }

        // set the instance query string
        if (tropicalInstance !== '') {query_string += '&instance_name=' + tropicalInstance; }

        // set the new data url. this will trigger a data gathering
        setDropDownDataUrl(base_modelDataUrl + query_string);
    }

    /**
     * return the rendered component
     */
    return (
        <Fragment>
            <form name={"Tropical"} onSubmit={formTropicalHandler}>
                <Stack spacing={1}>
                    <Select name="tropical-storm-name" placeholder="Select a tropical storm" onChange={(e, newValue) => {
                        setTropicalStorm(newValue);
                    }}>
                        <DropDownOptions data={dropDownData} type={'storm_names'} />
                    </Select>
                    <Select name="tropical-advisory" placeholder="Select an advisory" onChange={(e, newValue) => {
                        setTropicalAdvisory(newValue);
                    }}>
                        <DropDownOptions data={ dropDownData } type={ 'advisory_numbers' } />
                    </Select>
                    <Select name="tropical-grid" placeholder="Select a grid" onChange={(e, newValue) => {
                        setTropicalGrid(newValue);
                    }}>
                        <DropDownOptions data={ dropDownData } type={ 'grid_types' } />
                    </Select>
                    <Select name="tropical-instance" placeholder="Select an instance" onChange={(e, newValue) => {
                        setTropicalInstance(newValue);
                    }}>
                        <DropDownOptions data={ dropDownData } type={ 'instance_names' } />
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
    </Fragment>);
};
