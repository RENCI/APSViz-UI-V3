import React, { Fragment, useState } from "react";
import {
    AccordionGroup, Accordion, AccordionDetails, AccordionSummary, Button, Stack,
    Checkbox, Typography, Tab, Tabs, TabPanel, TabList, Box } from '@mui/joy';
import { KeyboardArrowDown as ExpandIcon } from '@mui/icons-material';
import { useLayers } from "@context/map-context";
import PropTypes from 'prop-types';
import {ActionButton} from "@components/buttons";

// set component prop types
ExternalLayerItems.propTypes = {
    data: PropTypes.any,
    state: PropTypes.any
};

/**
 * renders a list of available external layers from the DB.
 *
 * @param data
 * @constructor
 */
export default function ExternalLayerItems(data) {
    // get the layers in state
    const {
        externalLayers, setExternalLayers
    } = useLayers();

    // set some state for the accordion expansion view
    const [expandedAccordion, setExpandedAccordion] = useState([]);

    /**
     * checks to see if this checkbox needs to be set based on the layers currently in layer state.
     *
     * @param sourceName
     */
    const getCheckedState = (sourceName) => {
        // if there was data
        if (externalLayers !== null) {
            // get the layer data
            const layer = externalLayers.filter(item => item.name === sourceName);

            // if the layer was found
            if (layer !== null)
                // return the current state of visibility
                return layer[0].state.visible;
        }
    };

    /**
     * clears the checkboxes on the tab
     */
    function resetCheckBoxes() {
        // loop through the layers
        externalLayers.map(layer => {
            // if this later is set to visible
            if (layer.state.visible) {
                // toggle the layer's visibility
                toggleLayerVisibility(layer.name);
            }
        });
    }

    /**
     * removes the "state" JSON branch for the metadata view
     *
     */
    const json_replacer = (key, value) => {
        // return nothing if this is the "state" branch
        if (key === "state")
            return undefined;
        // otherwise return the value
        else
            return value;
    };

    /**
     * handles updating the visibility of an external layers on the map surface
     *
     * @param selectedLayerName
     */
    const toggleLayerVisibility = selectedLayerName => {
        // get a copy of the external layers
        const newLayers = [...externalLayers];

        // get the index of the target layer in the array
        const index = newLayers.findIndex(l => l.name === selectedLayerName);

        // report an issue if the layer was not found
        if (index === -1) {
            console.error('Could not locate layer', selectedLayerName);
            return;
        }

        // get the target layer to toggle
        const alteredLayer = newLayers[index];

        // toggle the visibility
        alteredLayer.state.visible = !alteredLayer.state.visible;

        // save the layers
        setExternalLayers([...newLayers.slice(0, index), { ...alteredLayer }, ...newLayers.slice(index + 1)]);
    };

    /**
     * toggles the accordion view in state
     *
     * @param id
     */
    const toggleAccordionView = (id) => {
        // get a copy of the state list
        let newExpandedAccordion = [ ...expandedAccordion ];

        // find the index of this item in state
        const index = expandedAccordion.findIndex(l => l.id === id);

        // add a new one to the list if it doesn't exist
        if (index === -1) {
            // add a new item to the state list
            newExpandedAccordion = [...expandedAccordion, { id: id, enabled: true }];

            // update the state list
            setExpandedAccordion(newExpandedAccordion);
        } else {
            // get the target instance in the state array
            const alteredExpandedAccordion = newExpandedAccordion[index];

            // toggle the view state of the accordion
            alteredExpandedAccordion.enabled = !alteredExpandedAccordion.enabled;

            // rebuild the list of accordions with the altered view state
            setExpandedAccordion([
                ...newExpandedAccordion.slice(0, index),
                { alteredExpandedAccordion },
                ...newExpandedAccordion.slice(index + 1)
            ]);
        }
    };

    /**
     * gets the current state of the accordion
     *
     * @param id
     * @returns {boolean}
     */
    const getAccordionState = (id) => {
        // init the return
        let ret_val = false;

        // find the index of this item in state
        const index = expandedAccordion.findIndex(l => l.id === id);

        // add a new one to the list if it doesn't exist
        if (index !== -1) {
            // get the state
            ret_val = expandedAccordion[index].enabled;
        }

        // return the state
        return ret_val;
    };

    /**
     * render the external layers tray contents
     */
    // do not render if there is no data
    if (data.data != null) {
        // if there was a warning getting the result
        if (data.data['Warning'] !== undefined) {
            return (
                <div>
                    Warning: {data.data['Warning']}
                </div>
            );
        }
        // if there was an error getting the result
        else if (data.data['Error'] !== undefined) {
            return (
                <div>
                    Error: {data.data['Error']}
                </div>
            );
        }
        // if there were no external layers returned
        else if (!data.data) {
            return (
                <div>
                    Error: {'No external data layers retrieved.'}
                </div>
            );
        }
        // return all the data cards
        else {
            // render the results of the data query
            return (
                <Fragment>
                    <AccordionGroup
                        disableDivider
                        // variant="soft"
                        sx={{
                            '.MuiAccordionDetails-content': { p: .5 },
                            '.MuiAccordionSummary-button': {  alignItems: 'center' }
                        }}>
                        {
                            // loop through the external layers and create checkbox selections grouped by the source
                            externalLayers
                            // group by the source name
                            .filter((val, idx, self) => (
                                idx === self.findIndex((t)=> ( t['source'] === val['source']) ))
                            )
                            // output sources
                            .map(
                                (layer, itemIndex) => (
                                    <Accordion
                                        key={ itemIndex }
                                        expanded={ getAccordionState(layer['source']) }
                                        onChange={ () => toggleAccordionView(layer['source']) }>

                                        <AccordionSummary>
                                            <Typography sx={{ p: 0, fontWeight: 'bold', fontSize: "16px" }}> { layer['source'] }</Typography>
                                        </AccordionSummary>

                                        <AccordionDetails>
                                            <Stack spacing={ 0 } direction="column" gap={ 0 }>
                                            {
                                                // output checkboxes for each layer name/url
                                                externalLayers
                                                // get the layer names for this source type
                                                .filter(item => item.source === layer.source)
                                                // output the checkboxes
                                                .map ((layer, itemIndex) =>
                                                    <Accordion
                                                        key={ itemIndex }
                                                        sx={{ p: 0 }}
                                                        expanded={ getAccordionState(layer['name']) }
                                                        onChange={ () => toggleAccordionView(layer['name']) }>

                                                        <Stack
                                                            direction="row"
                                                            justifyContent="space-between"
                                                            alignItems="stretch"
                                                            gap={ 1 }
                                                            >
                                                                <Checkbox
                                                                    size="sm"
                                                                    checked={ getCheckedState( layer.name ) }
                                                                    label={ <Typography sx={{ fontSize: "xs" }}> { layer['name'] } </Typography> }
                                                                    onChange={ () => toggleLayerVisibility(layer['name']) }
                                                                />

                                                                <ActionButton onClick={ () => toggleAccordionView( layer['name']) }>
                                                                    <ExpandIcon
                                                                        fontSize="sm"
                                                                        sx={{ transform: getAccordionState(layer['name']) ? 'rotate(180deg)' : 'rotate(0)',
                                                                            transition: 'transform 100ms' }} />
                                                                </ActionButton>
                                                        </Stack>

                                                        <AccordionDetails>
                                                            <Tabs defaultValue={0}>
                                                                <Stack
                                                                    direction="row"
                                                                    justifyContent="space-between"
                                                                >
                                                                    <TabList size="sm" sx={{ flex: 1 }}>
                                                                        <Tab variant="plain" color="primary">
                                                                            Metadata
                                                                        </Tab>
                                                                    </TabList>
                                                                </Stack>

                                                                <TabPanel value={ 0 }>
                                                                    <Box component="pre" sx={{
                                                                        fontSize: '75%',
                                                                        color: 'text.primary',
                                                                        backgroundColor: 'transparent',
                                                                        overflowX: 'auto',
                                                                        m: 0, p: 1,
                                                                        height: '100px',
                                                                        }}>
                                                                            { JSON.stringify(layer, json_replacer, 2) }
                                                                    </Box>
                                                                </TabPanel>
                                                            </Tabs>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                )
                                            }
                                            </Stack>
                                        </AccordionDetails>
                                    </Accordion>
                                )
                            )
                        }
                    </AccordionGroup>

                    <Button type="reset" onClick={ resetCheckBoxes }>Reset</Button>
                </Fragment>
            );
        }
    }
}