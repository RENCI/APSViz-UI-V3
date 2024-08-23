import React, { Fragment, useState } from 'react';
import { Stack, Typography, Box, Button, Card, Divider,
    Accordion, AccordionSummary, AccordionDetails, AccordionGroup } from '@mui/joy';
import { useLayers } from '@context';

import 'leaflet-side-by-side';
import "leaflet-swipe-mode";

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
        // showCompareLayers,
        // toggleCompareLayersView,
        map,
        defaultModelLayers,
        layerTypes
    } = useLayers();

    // declare some state for the compare layers switch
    //const [showCompareLayers, setShowCompareLayers] = useState(false);

    // default for the pane compare name
    const defaultSelected = 'Not Selected';

    // create some state for the left/right name selections
    const [leftPaneName, setLeftPaneName] = useState(defaultSelected);
    const [rightPaneName, setRightPaneName] = useState(defaultSelected);

    // create some state for the left/right ID selections
    const [leftPaneID, setLeftPaneID] = useState(defaultSelected);
    const [rightPaneID, setRightPaneID] = useState(defaultSelected);

    // used to collapse other open accordions
    const [accordionIndex, setAccordionIndex] = useState(null);

    // used to track the layers added
    const [addedCompareLayer, setAddedCompareLayer] = useState();

    // get the default layers
    const layers = [...defaultModelLayers];

    // get the unique groups in the selected model runs
    const groupList = getGroupList(layers);

    /**
     * clears any captured compare selection data
     *
     */
    const clearPaneInfo = () => {
        // clear the left ID/Name
        setLeftPaneName(defaultSelected);
        setLeftPaneID(defaultSelected);

        // clear the right pane ID/Name
        setRightPaneName(defaultSelected);
        setRightPaneID(defaultSelected);

        // rollup the accordions
        setAccordionIndex(null);
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

    /**
     *  switch on/off the compare layer view
     *
     * @param event
     */
    const compareLayers = () => {
        // if we can compare
        if (leftPaneName !== defaultSelected && rightPaneName !== defaultSelected) {
            // get a handle to the leaflet component
            const L = window.L;

            // set the swipe mode comparison options
            // const options = {
                //button: document.getElementById("compare-layers"),
                // position: 'topright',
                // thumbSize: 5,
                // padding: 100,
                // noControl: false,
                // text: {
                //     title: 'Enable Swipe Mode',
                //     leftLayerSelector: 'Left Layer',
                //     rightLayerSelector: 'Right Layer',
                // }
            // };

                // clear the compare layers
                if (addedCompareLayer) {
                    map.removeLayer(addedCompareLayer._leftLayer);
                    map.removeLayer(addedCompareLayer._rightLayer);
                }

            const myLayer1 = L.tileLayer.wms('https://apsviz-geoserver-dev.apps.renci.org/geoserver/wms',
                {
                    name: leftPaneName,
                    layers: 'ADCIRC_2024:' + leftPaneName
                }
            ).addTo(map);

            const myLayer2 = L.tileLayer.wms('https://apsviz-geoserver-dev.apps.renci.org/geoserver/wms',
                {
                    name: rightPaneName,
                    layers: 'ADCIRC_2024:' + rightPaneName
                }
            ).addTo(map);

            const compareLayer = L.control.sideBySide(myLayer1, myLayer2).addTo(map);

            // add the new layers
            setAddedCompareLayer(compareLayer);
        }
    };

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
                             <Button size="md" color={ (layer.id === leftPaneID) ? 'success' : 'primary' }
                                     sx={{ m: 0, color: (layer.id === leftPaneID) ? 'success' : '' }}
                                     onClick={ () => setPaneInfo('left', layer.id, layer.properties['product_name']) }>Left pane</Button>
                             <Button size="md" color={ (layer.id === rightPaneID) ? 'success' : 'primary' }
                                     sx={{ m: 0 }}
                                     onClick={ () => setPaneInfo('right', layer.id, layer.properties['product_name']) }>Right pane</Button>
                         </Stack>
                     </Card>
                );
            });

        // return to the caller
        return layerCards;
    };

    const validateSelections = () => {
        return ((leftPaneID !== defaultSelected || rightPaneID !== defaultSelected) &&
                    (leftPaneID === rightPaneID) && (leftPaneID && rightPaneID));
    };

    // render the controls
    return (
        <Fragment>
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
                    <Box key={ idx }>
                        <Accordion
                            expanded={accordionIndex === idx}
                            onChange={ (event, expanded) => { setAccordionIndex(expanded ? idx : null); }}
                        >
                            <AccordionSummary>
                                <Typography level="body-sm">{ layer['group'] }</Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                                { renderLayerCards(layer['group']) }
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                ))
            }

            </AccordionGroup>

            {
                // verify that the user has not selected the same item for each pane
                (( leftPaneID !== defaultSelected || rightPaneID !== defaultSelected ) && (leftPaneID === rightPaneID )) ?
                    <Fragment>
                        <Typography sx={{ ml: 2, color: 'red' }} level="body-sm" >You can not have the same layer in both comparison panes.</Typography>
                    </Fragment> : ''
            }

            {
                ( leftPaneID !== defaultSelected || rightPaneID !== defaultSelected ) ?
                    <Fragment>
                        <Card>
                            <Stack direction={"column"} gap={ 1 }>
                                {
                                    ( leftPaneID !== defaultSelected ) ?
                                        <Fragment>
                                            <Typography sx={{ ml: 1 }} level="body-sm">Left pane:</Typography>
                                            <Typography sx={{ ml: 2 }} level="body-sm">Name: { leftPaneName } </Typography>
                                            <Typography sx={{ ml: 2, mb: 2 }} level="body-sm">Layer: { leftPaneID } </Typography>
                                        </Fragment> : ''
                                }

                                {
                                    ( rightPaneID !== defaultSelected ) ?
                                        <Fragment>
                                            <Typography sx={{ ml: 1 }} level="body-sm">Right pane:</Typography>
                                            <Typography sx={{ ml: 2 }} level="body-sm">Name: { rightPaneName }</Typography>
                                            <Typography sx={{ ml: 2 }} level="body-sm">Layer: { rightPaneID }</Typography>
                                        </Fragment> : ''
                                }

                            </Stack>
                            {
                                ( leftPaneID !== defaultSelected && rightPaneID !== defaultSelected && leftPaneID !== rightPaneID ) ?
                                    <Fragment>
                                        <Button size="md" onClick={ compareLayers }>Compare</Button>
                                    </Fragment> : ''
                            }
                        </Card>
                    </Fragment>: ''
            }

            <Button size="md" onClick={ clearPaneInfo }>Reset</Button>
        </Fragment>
        );
};
