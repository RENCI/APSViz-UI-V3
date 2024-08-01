import React from 'react';
import { AccordionGroup, Box,  Divider, Accordion, AccordionSummary, AccordionDetails, Stack } from '@mui/joy';
import { useLayers } from '@context';
import { LayerCard } from './layer-card';
import { DeleteModelRunButton } from "@components/trays/layers/delete-layer-button";
import { DragHandleRounded as Handle } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

/**
 * gets the header data property name index
 * This takes into account the two types of runs (tropical, synoptic)
 *
 * @param layerProps
 * @param type
 * @returns {string}
 */
const getPropertyName = (layerProps, element_name) => {
    // init the return
    let ret_val = undefined;

    // capture the name of the element for tropical storms and advisory numbers
    if (layerProps['met_class'] === 'tropical') {
        // by the element name
        switch (element_name) {
            case 'stormOrModelEle':
                ret_val = layerProps['storm_name'];
                break;
            case 'numberName':
                ret_val = ' Adv: ';
                break;
            case 'numberEle':
                ret_val = layerProps['advisory_number'];
                break;
        }
    }
    // capture the name of the synoptic ADCIRC models and cycle numbers
    else {
        switch (element_name) {
            case 'stormOrModelEle':
                ret_val = layerProps['model'];
                break;
            case 'numberName':
                ret_val = ' Cycle: ';
                break;
            case 'numberEle':
                ret_val = layerProps['cycle'];
                break;
        }
    }

    // return to the caller
    return ret_val;
};


/**
 * gets the summary header text for the layer groups.
 * This takes into account the two types of runs (tropical, synoptic)
 *
 * @param layerProps
 * @returns {string}
 */
const getHeaderSummary = (layerProps) => {
    // get the full accordian summary text
    return layerProps['run_date'] + ': ' +
        ((getPropertyName(layerProps, 'stormOrModelEle') === undefined) ? 'Data error' : getPropertyName(layerProps, 'stormOrModelEle').toUpperCase()) +
        ', ' + getPropertyName(layerProps, 'numberName') + getPropertyName(layerProps, 'numberEle') +
        ', Type: ' + layerProps['event_type'] +
        ', Grid: ' + layerProps['grid_type'] +
        ((layerProps['meteorological_model'] === 'None') ? '' : ', ' + layerProps['meteorological_model']);
};

/**
 * renders the layer cards for a model run
 *
 * @param layers
 * @param group
 * @returns {*[]}
 */
const renderLayerCards = (layers, group) => {
    // init the return
    const layerCards = [];

    // filter/map the layers to create/return the layer card list
    layers
        // capture the layers for this group
        .filter(layer => (layer['group'] === group))
        // at this point we have the distinct runs
        .map((layer, idx) => {
            layerCards.push(<LayerCard key={`layer-${idx}`} layer={layer} index={idx}> </LayerCard>);
        });

    // return to the caller
    return layerCards;
};

/**
 * collect the list of unique layer groups
 *
 * @param layers
 * @returns {*[]}
 */
const getGroupList = (layers) => {
    // init the group list
    const groupList = [];

    // loop through the layers and get the unique groups
    layers
        // filter by the group name
        .filter((groups, idx, self) =>
            (idx === self.findIndex((t) => (t['group'] === groups['group']))))
        // at this point we have the distinct runs
        .map((layer) => {
            groupList.push(layer);
        });

    // return the list of groups
    return groupList;
};

/**
 * render the layers for the selected run groups
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const LayersList = () => {
    // get a handle to the layer state
    const {defaultModelLayers} = useLayers();

    // get the default layers
    const layers = [...defaultModelLayers];

    // get the unique groups in the selected run groups
    const groupList = getGroupList(layers);

    // handle the drag event
    const onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
          return;
        }

        // reorder the layer list
        reorder(
          layers,
          result.source.index,
          result.destination.index
        );
    };

    // a little function to help us with reordering the result
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    // loop through the layers and put them away
    return (
        <DragDropContext onDragEnd={ onDragEnd }>
            <Droppable droppableId="model-runs">
                { (provided) => (
                    <AccordionGroup variant="soft" { ...provided['droppableProps'] } ref={ provided['innerRef'] }>
                        {
                            // loop through the layer groups and put them away
                            groupList
                                // filter by the group name
                                .filter((group, idx, self) =>
                                    (idx === self.findIndex((t) => (t['group'] === group['group']))))
                                // at this point we have the distinct runs
                                .map((group, idx) => (
                                    <Draggable key={ group.id } draggableId={ group.id } index={ idx }>
                                        {(provided) => (
                                            <Box ref={ provided['innerRef'] } { ...provided['draggableProps'] } { ...provided['dragHandleProps'] }>
                                                <Accordion>
                                                    <Box sx={{display: "flex"}}>
                                                        <Stack direction="row" justifyContent="space-between">
                                                            <Box>
                                                                <AccordionSummary sx={{fontSize: 12}}>{ getHeaderSummary(group['properties']) } </AccordionSummary>
                                                            </Box>
                                                            <DeleteModelRunButton groupId={ group['group'] }/>
                                                            <Handle sx={{ fontSize: 25, marginTop: 1.5 }}/>
                                                        </Stack>
                                                    </Box>

                                                    <AccordionDetails> { renderLayerCards(layers, group['group'] )} </AccordionDetails>
                                                </Accordion>
                                                <Divider/>
                                            </Box> )}
                                    </Draggable> ))
                        } { provided.placeholder }
                    </AccordionGroup> )}
            </Droppable>
        </DragDropContext>
    );
};

