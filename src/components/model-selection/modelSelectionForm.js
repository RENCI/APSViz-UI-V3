import React, {Fragment, useState} from 'react';
import {Button, Divider, Option, Select, Stack, Tab, Tabs, TabList, TabPanel} from '@mui/joy';
import {useLayers} from "@context";
import {DatePicker} from '@mui/x-date-pickers';
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";

import dayjs from 'dayjs';

// import {LayerCard} from "@components/trays/layers/layer-card";

/**
 * This component renders the layer selection form
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const ModelSelectionForm = () => {
    // get references to the filtered layer state
    const {
        //filteredModelLayers
    } = useLayers();

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
     * method to initiate a model search with the filter selections on the synoptic form
     *
     * @param event
     */
    const formSynopticHandler = (event) => {
        alert(synopticDate);
        event.preventDefault();
        const formData = new FormData(event.target);
        const formJson = Object.fromEntries(formData.entries());
        alert(JSON.stringify(formJson));
    };

    // declare state variables for all tropical tab controls
    const [tropicalStorm, setTropicalStorm] = useState('');
    const [tropicalAdvisory, setTropicalAdvisory] = useState('');
    const [tropicalGrid, setTropicalGrid] = useState('');
    const [tropicalInstance, setTropicalInstance] = useState('');

    // declare all state variables for the synoptic tab
    const [synopticDate, setSynopticDate] = useState(new Date());
    const [synopticCycle, setSynopticCycle] = useState('');
    const [synopticGrid, setSynopticGrid] = useState('');
    const [synopticInstance, setSynopticInstance] = useState('');

    /**
     * build the query string to ge the data
     */
    function buildQueryString(formData, event) {
        // ['grid_type', 'instance_name', 'met_class', 'storm_name', 'cycle', 'advisory_number', 'run_date']

        const queryString = tropicalStorm + tropicalAdvisory + tropicalGrid + tropicalInstance + synopticCycle + synopticGrid + synopticInstance;

        alert(queryString);

        event.preventDefault();
        const formJson = Object.fromEntries(formData.entries());
        alert(JSON.stringify(formJson));
    }

    // render the form
    return (
        <Fragment>
            <Tabs aria-label="Type tabs" defaultValue={0}>
                <TabList>
                    <Tab>Tropical</Tab>
                    <Tab>Synoptic</Tab>
                </TabList>

                <TabPanel value={0}>
                    <form name={"Tropical"} onSubmit={formTropicalHandler}>
                        <Stack spacing={1}>
                            <Select name="tropical-storm-name" placeholder="Select a tropical storm" onChange={(newValue) => {
                                setTropicalStorm(newValue); }}>
                                <Option value="Tropical storm 1">Tropical storm 1</Option>
                                <Option value="Tropical storm 2">Tropical storm 2</Option>
                            </Select>
                            <Select name="tropical-advisory" placeholder="Select an advisory" onChange={(newValue) => {
                                setTropicalAdvisory(newValue); }}>
                                <Option value="Tropical advisory 1">Tropical advisory 1</Option>
                                <Option value="Tropical advisory 2">Tropical advisory 2</Option>
                            </Select>
                            <Select name="tropical-grid" placeholder="Select a grid" onChange={(newValue) => {
                                setTropicalGrid(newValue); }}>
                                <Option value="Tropical grid 1">Tropical grid 1</Option>
                                <Option value="Tropical grid 2">Tropical grid 2</Option>
                            </Select>
                            <Select name="tropical-instance" placeholder="Select an instance" onChange={(newValue) => {
                                setTropicalInstance(newValue); }}>
                                <Option value="Tropical instance 1">Tropical instance 1</Option>
                                <Option value="Tropical instance 2">Tropical instance 2</Option>
                            </Select>

                            <Button type="submit">Submit</Button>
                            <Button type="reset">Reset</Button>
                        </Stack>

                        <Divider sx={{m: 2}}/>

                        <Stack sx={{maxHeight: "400px", overflow: "auto"}}>
                            {/* list of search results goes here
                                may be able to leverage trays/layers/layer-card />
                            */}
                        </Stack>
                    </form>
                </TabPanel>
                <TabPanel value={1}>
                    <form name={"Synoptic"} onSubmit={formSynopticHandler}>
                        <Stack spacing={1}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    name="synoptic-date"
                                    label="Date"
                                    slotProps={{textField: {size: 'small'}}}
                                    value={dayjs(synopticDate)} onChange={(newValue) => { setSynopticDate(newValue); }}
                               />
                            </LocalizationProvider>

                            <Select name="synoptic-cycle" placeholder="Synoptic cycle control" onChange={(newValue) => {
                                setSynopticCycle(newValue); }}>
                                <Option value="Synoptic cycle 1">Synoptic cycle 1</Option>
                                <Option value="Synoptic cycle 2">Synoptic cycle 2</Option>
                            </Select>

                            <Select name="synoptic-grid" placeholder="Synoptic grid control" onChange={(newValue) => {
                                setSynopticGrid(newValue); }}>
                                <Option value="Synoptic grid 1">Synoptic grid 1</Option>
                                <Option value="Synoptic grid 2">Synoptic grid 2</Option>
                            </Select>

                            <Select name="synoptic-instance" placeholder="Synoptic instance control" onChange={(newValue) => {
                                setSynopticInstance(newValue); }}>
                                <Option value="Synoptic instance 1">Synoptic instance 1</Option>
                                <Option value="Synoptic instance 2">Synoptic instance 2</Option>
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
                </TabPanel>
            </Tabs>
        </Fragment>
    );
};

/**
 * this method populates the controls on the form.
 *
 */
// const dataLoader = () => {
//
// };
