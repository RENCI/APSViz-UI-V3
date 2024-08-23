import React, { Fragment, useState } from 'react';
import { Stack, Typography, Box, Switch, Divider, Button, Card, Accordion, AccordionDetails, AccordionGroup } from '@mui/joy';
import { useLayers } from '@context';
import { ActionButton } from "@components/buttons";
import { CompareArrows as CompareLayersIcon, KeyboardArrowDown as ExpandIcon } from '@mui/icons-material';

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
 * This component renders the model selection tray
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const CompareLayersTray = () => {
    // get the context for the compare layers view
    const {
        showCompareLayers,
        toggleCompareLayersView,
        defaultModelLayers,
        layerTypes
    } = useLayers();

    const defaultPlaceholder = 'Not Selected';

    // create some state for the left/right name selections
    const [leftPaneName, setLeftPaneName] = useState(defaultPlaceholder);
    const [rightPaneName, setRightPaneName] = useState(defaultPlaceholder);

    // create some state for the left/right ID selections
    const [leftPaneID, setLeftPaneID] = useState('');
    const [rightPaneID, setRightPaneID] = useState('');

    // set some state for the accordion expansion view
    const [expandedAccordion, setExpandedAccordion] = useState( []);

    // get the default layers
    const layers = [...defaultModelLayers];

    // get the unique groups in the selected model runs
    const groupList = getGroupList(layers);

    /**
     * renders the layer cards for a model run
     *
     * @param layers
     * @param group
     * @returns {*[]}
     */
    const renderLayerCards = (group) => {
        // init the return
        const layerCards = [];

        // filter/map the layers to create/return the layer card list
        layers
            // capture the layers for this group, do not return the observation layer
            .filter(layer => (layer['group'] === group && layer.properties['product_type'] !== 'obs'))
            // at this point we have the distinct runs
            .map((layer, idx) => {
                layerCards.push(
                     <Card key={ idx }>
                         <Stack direction="row" alignItems="center" gap={ 1 }>
                             { getLayerIcon(layer.properties['product_type']) }
                             <Typography level="body-sm">{ layer.properties['product_name'] }</Typography>
                         </Stack>
                         <Stack direction="row" gap={ 4 } alignItems="center">
                             <Button size="small" sx={{ m: 0 }} onClick={ () => setPaneInfo('left', layer.id, layer.properties['product_name']) }>Left pane</Button>
                             <Button size="small" sx={{ m: 0 }} onClick={ () => setPaneInfo('right', layer.id, layer.properties['product_name']) }>Right pane</Button>
                         </Stack>
                     </Card>
                );
            });

        // return to the caller
        return layerCards;
    };

    /**
     * toggles the accordion view in state
     *
     * @param id
     */
    const toggleAccordionExpandedView = (id) => {
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
    const getAccordionExpandedState = (id) => {
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
     * Save the layer info to state
     *
     * @param paneType
     * @param paneID
     * @param paneName
     */
    const setPaneInfo = (paneType, paneID, paneName) => {
        // save the ID and name of the left pane layer selection
        if (paneType === 'left') {
            // set the layer name
            setLeftPaneName(paneName);

            // set the layer id
            setLeftPaneID(paneID);
        }
        // save the ID and name of the right pane layer selection
        else {
            // set the layer name
            setRightPaneName(paneName);

            // set the layer id
            setRightPaneID(paneID);
        }
    };

    /**
     * get the layer icon
     *
     * @param productType
     * @returns {JSX.Element}
     */
    const getLayerIcon = ( productType )=> {
        // grab the icon
        const Icon = layerTypes[productType].icon;

        // return the icon
        return <Icon/>;
    };

    // render the controls
    return (
        <Fragment>
            <Stack direction="row" alignItems="center" gap={ 1 }>
			    <Switch id="compare-layers" size="sm" checked={ showCompareLayers } onChange={ toggleCompareLayersView } />
			    <Typography level="body-sm">Enable layer compare.</Typography>
			</Stack>
            <Divider/>
            <AccordionGroup
                // variant="soft"
                sx={{
                    '.MuiAccordionDetails-content': {
                        p: 1,
                    },
                    '.MuiAccordionSummary-button': {
                        alignItems: 'center',
                    }
                }}>
            {
                // loop through the layer groups and put them away
                groupList
                // filter by the group name
                .filter((groups, idx, self) =>
                    (idx === self.findIndex((t) => (t['group'] === groups['group']))))
                // at this point we have the distinct runs
                .map((layer, idx) => (

                    <Box key={ idx } sx={{ p: 0 }}>
                        <Accordion
                            expanded={ getAccordionExpandedState(layer['group']) }
                            onChange={ () => toggleAccordionExpandedView(layer['group']) }>

                            <Stack direction="row" alignItems="center" gap={ 1 }>
                                    <ActionButton onClick={ () => toggleAccordionExpandedView( layer['group']) }>
                                        <ExpandIcon
                                            fontSize="sm"
                                            sx={{
                                            transform: getAccordionExpandedState(layer['group']) ? 'rotate(180deg)' : 'rotate(0)',
                                            transition: 'transform 100ms',
                                            }} />
                                    </ActionButton>
                                <Typography level="body-sm">{ layer['group'] }</Typography>
                            </Stack>

                            <AccordionDetails>
                                { renderLayerCards(layer['group']) }
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                ))
            }
            </AccordionGroup>
            {
                // if we are in compare mode
                ( showCompareLayers ) ?
                    // show the user selections
                    ((leftPaneID || rightPaneID) ?
                        <Fragment>
                            <Typography level="body-sm">Comparing: </Typography>
                            <Stack direction={"column"}>
                                <Typography sx={{ ml: 1 }} level="body-sm">Left pane:</Typography>
                                <Typography sx={{ ml: 2 }} level="body-sm">Layer ID: { leftPaneID } </Typography>
                                <Typography sx={{ ml: 2, mb: 2 }} level="body-sm">Name: { leftPaneName } </Typography>

                                <Typography sx={{ ml: 1 }} level="body-sm">Right pane:</Typography>
                                <Typography sx={{ ml: 2 }} level="body-sm">Layer ID: { rightPaneID }</Typography>
                                <Typography sx={{ ml: 2 }} level="body-sm">Name: { rightPaneName }</Typography>
                            </Stack>
                        </Fragment> : '') : ''
            }

            {
                // if we are in compare mode
                ( showCompareLayers ) ?
                    // verify that the user has not selected the same item for each pane
                    (((leftPaneID === rightPaneID) && (leftPaneID && rightPaneID)) ?
                    <Typography sx={{ ml: 2, color: 'red' }} level="body-sm" >You can not have the same layer in both comparison panes.
                    </Typography> : '') : ''
            }
        </Fragment>
        );
};
