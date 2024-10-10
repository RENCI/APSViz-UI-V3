import React, { Fragment, useState } from "react";
import { AccordionGroup, Accordion, AccordionSummary, AccordionDetails, Stack, Checkbox, Typography } from '@mui/joy';
import PropTypes from 'prop-types';
import { getHeaderSummary } from "@utils/map-utils";
import { useLayers } from "@context/map-context";

// set component prop types
CatalogItems.propTypes = { data: PropTypes.any };

/**
 * returns a list of drop down options for that data/type.
 *
 * @param data
 * @param type
 * @constructor
 */
export default function CatalogItems(data) {
    // get the layers in state
    const {
        removeObservations,
        defaultModelLayers,
        setDefaultModelLayers,
        } = useLayers();

    // create some state for what catalog accordian is expanded/not expanded
    const [accordianDateIndex, setAccordianDateIndex] = useState(-1);

    /**
     * handles the model checkbox click
     *
     * @param catalogMembers
     * @param layerGroup
     * @param checked
     */
    const handleCBClick = (catalogMembers, layerGroup, checked) => {
        // get the layers selected
        const layers = catalogMembers.filter( catalogMembers => catalogMembers.group === layerGroup );

        // add or remove the layer group
        handleSelectedLayers(layerGroup, layers, checked);

        // remove all selected observations
        removeObservations();
    };

    /**
     * checks to see if this checkbox needs to be set based on the layers currently in layer state.
     *
     * @param layerGroup
     */
    const getCheckedState = ( layerGroup ) => {
        // return the checked state
        return defaultModelLayers.some(item => item.group === layerGroup);
    };

    /**
     * handles updating the default layers on the map surface
     *
     * @param layerGroup
     * @param selectedLayers
     * @param checked
     */
    const handleSelectedLayers = (layerGroup, selectedLayers, checked) => {
        // add visibility state property to retrieved catalog layers
        let newLayers = [];

        // first see if this set of layers already exists in state, and remove them if the selection was unchecked
        if (defaultModelLayers.find(layer => layer.group === layerGroup) && !checked) {
            // remove the layers from the layer list in state
            newLayers = defaultModelLayers.filter(layer => layer.group !== layerGroup);

            // reset the visible layer states for all layers in the layer tray.
            [...newLayers].forEach((layer) => {
                // here we use whatever group is at the top of the list to set the visible layers
                layer.state = newLayerDefaultState(layer, newLayers[0].group);
            });

            // reload the default layers less the layer group that was unselected
            setDefaultModelLayers(newLayers);
        }
        // else add these layers to state
        else if (!defaultModelLayers.find(layer => layer.group === layerGroup) && checked) {
            // loop through the select layers in the group and add the default layer state
            selectedLayers.forEach((layer) => {
                // add the item to the list with the default state
                newLayers.push({ ...layer, state: { visible: false, opacity: 1.0 }});
            });

            // reset the visible layer states for all layers in the layer tray.
            [...newLayers, ...defaultModelLayers].forEach((layer) => {
                // perform the visible state logic
                layer.state = newLayerDefaultState(layer, layerGroup);
            });

            // save the items to state so they can be rendered
            setDefaultModelLayers([...newLayers, ...defaultModelLayers]);
        }
    };

    /**
     * adds or updates the visibility of the layer on the map surface.
     *
     * @param layer
     * @param group
     * @returns {{ visible: boolean, opacity: 1.0 }}
     */
    const newLayerDefaultState = (layer, group) => {
        // if this is an obs layer and is the one just added
        if (layer.group === group &&
            (layer.properties['product_type'] === 'obs' || layer.properties['product_type'] === 'maxele63'))
            // make this layer visible
            return ({ visible: true, opacity: 1.0 });
        else
            // make this layer invisible
            return ({ visible: false, opacity: 1.0 });
    };

    /**
     * render the selected model runs
     */
    // do not render if there is no data
    if (data.data != null) {
        // if there was a warning getting the result
        if (data.data['Warning'] !== undefined) {
            return (
                <div>
                    Warning: { data.data['Warning'] }
                </div>
            );
        }
        // if there was an error getting the result
        else if(data.data['Error'] !== undefined) {
            return (
                <div>
                    Error: { data.data['Error'] }
                </div>
            );
        }
        // if there were no catalog data returned
        else if(data.data['catalog'] === undefined || data.data['catalog'] === null) {
            return (
                <div>
                    Error: { 'No catalog data retrieved.' }
                </div>
            );
        }
        // return all the data cards
        else {
            // get the sorting parameter
            const sortParam = (data.isTropical) ? 'advisory_number' : 'cycle';

            // simple sort comparer for more than 1 level of strings
            const compare = (x, y) => (x > y) - (x < y);

            // render the results of the data query
            return (
                <Fragment>
                    <AccordionGroup sx={{ maxWidth: 415, size: "sm", variant: "soft" }}>
                        {
                            // loop through the catalog data and create checkbox selections
                            data.data['catalog']
                            .filter(catalogs => catalogs !== "")
                            .map(
                                (catalog, itemIndex) =>
                                (
                                    <Stack key={ itemIndex } spacing={ 1 }>
                                        <Accordion
                                            key={ itemIndex }
                                            sx={{ p: 0, fontSize: "sm" }}
                                            expanded={accordianDateIndex === itemIndex}
                                            onChange={(event, expanded) => { setAccordianDateIndex(expanded ? itemIndex : null); }}>

                                            <AccordionSummary sx={{ fontSize: 'sm' }}> { catalog['id'] } </AccordionSummary>

                                            <AccordionDetails> {
                                                // loop through the data members and put them away
                                                catalog['members']
                                                    // filter by the group name, get the top 1
                                                    .filter((val, idx, self) =>
                                                        ( idx === self.findIndex((t)=> ( t['group'] === val['group']) )))
                                                    .sort((a, b) => compare(b.properties[sortParam], a.properties[sortParam]) || compare(a.properties['event_type'], b.properties['event_type']))
                                                        //((b.properties[sortParam] + b.properties['event_type']).localeCompare(a.properties[sortParam] + a.properties['event_type'])))
                                                    // output summarized details of each group member
                                                    .map((mbr, mbrIdx) => (
                                                        // create the checkbox
                                                        <Checkbox
                                                            size="sm"
                                                            sx={{ m: .5 }}
                                                            key={ mbrIdx }
                                                            checked={ getCheckedState(mbr.group) }
                                                            label={ <Typography sx={{ fontSize: "xs" }}>{ getHeaderSummary(mbr['properties']) } </Typography> }
                                                            onChange={ (event) => handleCBClick( catalog['members'], mbr['group'],
                                                                event.target.checked) }
                                                        />
                                                    ))
                                                }
                                            </AccordionDetails>
                                        </Accordion>
                                    </Stack>
                                )
                            )
                        }
                    </AccordionGroup>
                </Fragment>
            );
        }
    }
}