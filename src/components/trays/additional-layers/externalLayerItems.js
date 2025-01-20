import React, { Fragment } from "react";
import { AccordionGroup, Accordion, AccordionSummary, AccordionDetails,
    Stack, Checkbox, Typography, Divider, Tab, Tabs, TabPanel, TabList, Box } from '@mui/joy';
import { useLayers } from "@context/map-context";
import PropTypes from 'prop-types';

// set component prop types
ExternalLayerItems.propTypes = { data: PropTypes.any };

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
     * render the external layers
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
                                <Stack key={ itemIndex } spacing={ .1 } direction="column" gap={ .1 }>
                                    <Typography level="sm" sx={{ fontWeight: 'bold' }}> { layer['source'] }</Typography>
                                    {
                                        // output checkboxes for each layer name/url
                                        externalLayers
                                            // get the layer names for this source type
                                            .filter(item => item.source === layer.source)
                                            // output the checkboxes
                                            .map ((layer, itemIndex) =>
                                                <AccordionGroup key={ itemIndex } sx={{ maxWidth: 415, size: "sm", variant: "soft", p: 0 }}>
                                                    <Accordion sx={{ p: 0 }}>
                                                        <AccordionSummary>
                                                            <Checkbox
                                                                size="sm"
                                                                checked={ getCheckedState( layer.name ) }
                                                                label={ <Typography sx={{ fontSize: "xs" }}> { layer['name'] } </Typography> }
                                                                onChange={ () => toggleLayerVisibility(layer['name']) }
                                                            />
                                                        </AccordionSummary>

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
                                                                            { JSON.stringify(layer, null, 2) }
                                                                    </Box>
                                                                </TabPanel>
                                                            </Tabs>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                </AccordionGroup>
                                            )
                                    }
                                   <Divider />
                                </Stack>
                            )
                        )
                    }
                </Fragment>
            );
        }
    }
}