import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionGroup,
    AccordionSummary,
    Box,
    Divider,
    IconButton,
} from '@mui/joy';
import { useLayers } from '@context';
import { LayerCard } from './layer-card';
import { DeleteModelRunButton } from "@components/trays/layers/delete-layer-button";
import { Typography } from '@mui/joy';
import { DragHandleRounded as HandleIcon } from '@mui/icons-material';
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
        .filter((group, idx, self) =>
            (idx === self.findIndex((t) => (t['group'] === group['group']))))
        // at this point we have the distinct runs
        .map((layer) => {
            groupList.push(layer);
        });

    // return the list of groups
    return groupList;
};

/**
 * reorder the list of groups
 *
 * @param grpList
 * @param startIndex
 * @param endIndex
 * @returns {unknown[]}
 */
const reOrderGroups = (grpList, startIndex, endIndex) => {
    // copy the list
    const ret_val = Array.from(grpList);

    // get the item that is moving
    const [removed] = ret_val.splice(startIndex, 1);

    // put it in the new position
    ret_val.splice(endIndex, 0, removed);

    // return the result
    return ret_val;
};

/**
 * adds or updates the visibility of the layer on the map surface.
 *
 * presumably this will have to take the met class into consideration.
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
    // remove layer visibility
    else
        // make this layer invisible
        return ({ visible: false, opacity: 1.0 });
};

/**
 * render the layers for the selected run groups
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const LayersList = () => {
    // get a handle to the layer state
    const {defaultModelLayers, setDefaultModelLayers} = useLayers();

    // get the default layers
    const layers = [...defaultModelLayers];

    // get the unique groups in the selected model runs
    const groupList = getGroupList(layers);

    /**
     * handle the drag event
     *
     * @param result
     */
    const onDragEnd = (result) => {
        // handle case that there is no destination (could have been dragged out of the drop area)
        if (!result.destination) {
          return;
        }

        // create an array of group ids
        let grpList = [];

        // get the current layer groups
        getGroupList(layers).map((item) => (grpList.push(item['group'])));

        // swap the elements
        grpList = reOrderGroups(grpList, result.source.index, result.destination.index);

        // reorder the layers and put them back in state
        reOrderLayers(grpList);
    };

    /**
     * order the layers in state based on the new group list order
     *
     * @param grpList
     * @returns {*[]}
     */
    const reOrderLayers = (grpList) => {
        // init the return
        const newLayerList = [];

        // reorder the layers into a new array
        grpList
            // soin through the groups
            .map((group) => (
                // spin through the layers
                defaultModelLayers
                    // get the layers for this group
                    .filter((layer) =>
                        (layer['group'] === group))
                    // add the group layers into a new list
                    .map((layer) =>
                        (newLayerList.push(layer)))));

        // reset the visible layer states for all model runs in the layer tray.
        [...newLayerList].forEach((layer) => {
            // perform the visible state logic
            layer.state = newLayerDefaultState(layer, layer.group);
        });

        // now update the visible layer state for the top most model run
        [...newLayerList].forEach((layer) => {
            // perform the visible state logic
            layer.state = newLayerDefaultState(layer, newLayerList[0].group);
        });

        // update the layer list in state
        setDefaultModelLayers(newLayerList);
    };

    /**
     * render the layers on the tray
      */
    return (
        <DragDropContext onDragEnd={ onDragEnd }>
            <Droppable droppableId="model-runs">
                { (provided) => (
                    <AccordionGroup
                        variant="soft"
                        { ...provided['droppableProps'] }
                        ref={ provided['innerRef'] }
                        sx={{
                            '.MuiAccordionDetails-content': {
                                p: 0,
                            },
                            '.MuiAccordionSummary-button': {
                                alignItems: 'center',
                            },
                        }}
                    >
                        {
                            // loop through the layer groups and put them away
                            groupList
                                // filter by the group name
                                .filter((groups, idx, self) =>
                                    (idx === self.findIndex((t) => (t['group'] === groups['group']))))
                                // at this point we have the distinct runs
                                .map((layer, idx) => (
                                    <Draggable key={ layer['group'] } draggableId={ layer['group'] } index={ idx }>
                                        {(provided) => (
                                            <Box ref={ provided['innerRef'] } { ...provided['draggableProps'] }>
                                                <Accordion>
                                                    <AccordionSummary>
                                                        <IconButton
                                                            className="drag-handle"
                                                            variant="soft"
                                                            color="neutral"
                                                            { ...provided['dragHandleProps'] }
                                                        >
                                                            <HandleIcon fontSize="xl" />
                                                        </IconButton>
                                                        <Typography level="body-xs">
                                                            { getHeaderSummary(layer['properties']) }
                                                        </Typography>
                                                        <DeleteModelRunButton groupId={ layer['group'] }/>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        { renderLayerCards(layers, layer['group'] )}
                                                    </AccordionDetails>
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

