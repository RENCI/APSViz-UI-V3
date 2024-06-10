import React, {Fragment, useState} from "react";
import PropTypes from 'prop-types';
import {AccordionGroup, Accordion, AccordionSummary, AccordionDetails, Stack, Checkbox} from '@mui/joy';
import { useLayers } from "@context/map-context";

// set component prop types
CatalogItems.propTypes = { data: PropTypes.any};

/**
 * returns a list of drop down options for that data/type.
 *
 * @param data
 * @param type
 * @constructor
 */
export default function CatalogItems(data) {
    const { defaultModelLayers, setDefaultModelLayers } = useLayers();

    // create some state for what catalog accordian is expanded/not expanded
    const [accordianDateIndex, setAccordianDateIndex] = useState(-1);

    // variables for the data display
    let stormOrModelName = null;
    let stormOrModelEle = null;
    let numberName = null;
    let numberEle = null;

    /**
     * handles the model selection click
     *
     * @param catalogMembers
     * @param layerGroup
     */
    const handleCheckBox = (catalogMembers, layerGroup, checked) => {
        // get the layers selected
        const layers = catalogMembers.filter( catalogMembers => catalogMembers.group === layerGroup );

        // add or remove the layer group
        handleSelectedLayers(layerGroup, layers, checked);
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
        else if (!defaultModelLayers.find(layer => layer.group === layerGroup) && checked) {
            // loop through the select layers in the group and add the default layer state
            selectedLayers.forEach((layer) => {
                // add the item to the list with the default state
                newLayers.push({ ...layer, state: { visible: false }});
            });

            // reset the visible layer states for all layers in the layer tray.
            [...newLayers, ...defaultModelLayers].forEach((layer) => {
                // perform the visible state logic
                layer.state = newLayerDefaultState(layer, layerGroup);
            });

            // save the items to state so they can be rendered
            setDefaultModelLayers([...newLayers, ...defaultModelLayers]);
        }
        else
            // TODO: the checkbox checked value should follow what is in the defaultModelLayers state
            console.warn(`Layer group ${layerGroup} already exists.`);
    };

    /**
     * adds or updates the visibility of the layer on the map surface.
     *
     * presumably this will have to take the met class into consideration.
     *
     * @param layer
     * @param group
     * @returns {{visible: boolean}}
     */
    const newLayerDefaultState = (layer, group) => {
        // if this is an obs layer and is the one just added
        if (layer.group === group &&
            (layer.properties['product_type'] === 'obs' || layer.properties['product_type'] === 'maxele63'))
            // make this layer visible
            return ({ visible: true });
        else
            // make this layer invisible
            return ({ visible: false });
    };

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
        else if(data.data['Error'] !== undefined) {
            return (
                <div>
                    Error: {data.data['Error']}
                </div>
            );
        }
        // return all the data cards
        else {
            // save the name of the element for tropical storms and advisory numbers
            if (data.isTropical) {
                stormOrModelName = 'Storm: ';
                stormOrModelEle = 'storm_name';
                numberName = ' Advisory: ';
                numberEle = 'advisory_number';
            }
            // save the name of the synoptic ADCIRC models and cycle numbers
            else if (!data.isTropical) {
                stormOrModelName = 'Model: ';
                stormOrModelEle = 'model';
                numberName = ' Cycle: ';
                numberEle = 'cycle';
            }

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
                                            sx={{ p: 0 }}
                                            expanded={accordianDateIndex === itemIndex}
                                            onChange={(event, expanded) => {
                                                setAccordianDateIndex(expanded ? itemIndex : null);
                                            }}>
                                            <AccordionSummary>
                                                {catalog['id']}
                                            </AccordionSummary>

                                            <AccordionDetails> {
                                                // loop through the data members and put them away
                                                catalog['members']
                                                    // filter by the group name
                                                    .filter((val, idx, self) => (
                                                        idx === self.findIndex((t)=> (
                                                            t['group'] === val['group']))))
                                                    // output summarized details of each group member
                                                    .map((mbr, mbrIdx) => (
                                                        // create the checkbox
                                                        <Checkbox
                                                            sx={{ m: .5 }}
                                                            key={ mbrIdx }
                                                            label={
                                                                stormOrModelName + mbr['properties'][stormOrModelEle].toUpperCase() + ', ' +
                                                                numberName + mbr['properties'][numberEle] +
                                                                ', Type: ' + mbr['properties']['event_type']
                                                            }
                                                            onChange={ (event) => handleCheckBox( catalog['members'], mbr['group'], event.target.checked) }
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