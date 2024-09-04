import React, { Fragment, useState } from 'react';
import { Stack, Typography, Box, Button, Card, Accordion, AccordionSummary, AccordionDetails, AccordionGroup } from '@mui/joy';
import { useLayers, useSettings } from '@context';
import { getNamespacedEnvParam } from "@utils/map-utils";
import { SwapVerticalCircleSharp as SwapLayersIcon } from '@mui/icons-material';
import 'leaflet-side-by-side';

/**
 * collect the list of unique layer groups
 *
 * @param layers
 * @returns {*[]}
 */
const getModelRunGroupList = (layers) => {
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
        map,
        defaultModelLayers,
        setDefaultModelLayers,
        layerTypes,
        setSideBySideLayers,
        removeSideBySideLayers,
        getAllLayersInvisible
    } = useLayers();

    const {
        mapStyle,
    } = useSettings();

    // default for the pane compare name
    const defaultSelected = 'Not Selected';

    // create some state for the left/right name selections
    const [leftPaneType, setLeftPaneType] = useState(defaultSelected);
    const [rightPaneType, setRightPaneType] = useState(defaultSelected);

    // create some state for the left/right ID selections
    const [leftPaneID, setLeftPaneID] = useState(defaultSelected);
    const [rightPaneID, setRightPaneID] = useState(defaultSelected);

    // used to collapse other open accordions
    const [accordionIndex, setAccordionIndex] = useState(null);

    // get the default model run layers
    const layers = [...defaultModelLayers];

    // get the unique groups in the selected model runs
    const groupList = getModelRunGroupList(layers);

    /**
     * clears any captured compare selection data and layers
     *
     */
    const clearPaneInfo = () => {
        // clear the left layer type/ID
        setLeftPaneType(defaultSelected);
        setLeftPaneID(defaultSelected);

        // clear the right pane ID/Name
        setRightPaneType(defaultSelected);
        setRightPaneID(defaultSelected);

        // remove the side by side layers
        removeSideBySideLayers();

        // rollup the accordions
        setAccordionIndex(null);
    };

    /**
     * Save the layer info to state
     *
     * @param paneSide
     * @param paneID
     * @param paneType
     */
    const setPaneInfo = (paneSide, paneType, paneID) => {
        // save the ID and name of the left pane layer selection
        if (paneSide === 'left') {
            // set the layer name
            setLeftPaneType(paneType);

            // set the layer id
            setLeftPaneID(paneID);
        }
        // save the ID and name of the right pane layer selection
        else {
            // set the layer name
            setRightPaneType(paneType);

            // set the layer id
            setRightPaneID(paneID);
        }
    };

    /**
     * swaps the selected layer position in the compare panes
     *
     */
    const swapPanes = () => {
        // get the original left pane data
        const origLeftPaneType = leftPaneType;
        const origLeftPaneID = leftPaneID;

        // clear the left layer type/ID
        setLeftPaneType(rightPaneType);
        setLeftPaneID(rightPaneID);

        // clear the right pane ID/Name
        setRightPaneType(origLeftPaneType);
        setRightPaneID(origLeftPaneID);
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
     * gets the default SLD style for this product type
     *
     * @param product_type
     */
    const getSLDStyleInfo = ( product_type ) => {
        // init a return value
        let ret_val;

        // get the SLD style by the type of product
        switch( product_type ) {
            // max wind speed
            case ("maxwvel63"):
                ret_val = mapStyle.maxwvel.current;
                break;
            // max significant wave height
            case ("swan_HS_max63"):
                ret_val = mapStyle.swan.current;
                break;
            // max water levels
            default:
                ret_val = mapStyle.maxele.current;
                break;
        }

        // return the style or not
        return ret_val;
    };

    /**
     *  switch on/off the compare layer view
     *
     * @param event
     */
    const compareLayers = () => {
        // if we have legit layers to compare
        if (leftPaneType !== defaultSelected && rightPaneType !== defaultSelected) {
            // get a handle to the leaflet component
            const L = window.L;

            // remove the side by side layers if any already exist
            removeSideBySideLayers();

            // hide all layers except the observations
            setDefaultModelLayers(getAllLayersInvisible());

            // get the URL to the geoserver
            const gs_wfs_url = `${ getNamespacedEnvParam('REACT_APP_GS_DATA_URL') }`;
            const gs_wms_url = gs_wfs_url + 'wms';

            // get the left layer properties
            const leftLayerProps = layers.filter(item => item.id === leftPaneID);

            // get the SLD style info for the left pane
            const leftSldStyle = getSLDStyleInfo(leftLayerProps[0].properties['product_type']);

            // create a left pane layer
            const selectedLeftLayer = L.tileLayer.wms(gs_wms_url,
                {
                    format: 'image/png',
                    transparent: true,
                    name: leftPaneType,
                    layers: leftLayerProps[0].layers,
                    sld_body: leftSldStyle
                }
            ).addTo(map);

            // get the right layer properties
            const rightLayerProps = layers.filter(item => item.id === rightPaneID);

            // get the SLD style info for the right pane
            const rightSldStyle = getSLDStyleInfo(rightLayerProps[0].properties['product_type']);

            // create the right pane layer
            const selectedRightLayer = L.tileLayer.wms(gs_wms_url,
                {
                    format: 'image/png',
                    transparent: true,
                    name: rightPaneType,
                    layers: rightLayerProps[0].layers,
                    sld_body: rightSldStyle
                }
            ).addTo(map);

            // add the selected layers to the map
            const sideBySideLayer = L.control.sideBySide(selectedLeftLayer, selectedRightLayer, { padding: 0 }).addTo(map);

            // add the handle to the new layers to state so we can remove it later
            setSideBySideLayers(sideBySideLayer);
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
            // sort by the product name
            .sort((a, b) => a.properties['product_name'] < b.properties['product_name'] ? -1 : 1)
            // display the model run layer icons and select buttons
            .map((layer, idx) => {
                layerCards.push(
                     <Card key={ idx }>
                         <Stack direction="row" alignItems="center" gap={ 1 }>
                             { getLayerIcon(layer.properties['product_type']) }
                             <Typography level="body-sm">{ layer.properties['product_name'] }</Typography>
                         </Stack>

                         <Box textAlign="center">
                             <Button size="md" color={ (layer.id === leftPaneID) ? 'success' : 'primary' }
                                     sx={{ mr: 4 }}
                                     onClick={ () => setPaneInfo('left', layer.properties['product_name'], layer.id) }>Left pane</Button>
                             <Button size="md" color={ (layer.id === rightPaneID) ? 'success' : 'primary' }
                                     sx={{ m: 0 }}
                                     onClick={ () => setPaneInfo('right', layer.properties['product_name'], layer.id) }>Right pane</Button>
                         </Box>
                     </Card>
                );
            });

        // return to the caller
        return layerCards;
    };

    // render the controls
    return (
        <Fragment>
            <AccordionGroup
                sx={{
                    '.MuiAccordionDetails-content': {
                        p: 1,
                    },
                    '.MuiAccordionSummary-button': {
                        alignItems: 'center',
                    }
                }}>
            {
                // display the model runs to choose from
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
                // validate the user selections, no same layer comparisons
                (( leftPaneID !== defaultSelected || rightPaneID !== defaultSelected ) && (leftPaneID === rightPaneID )) ?
                    <Fragment>
                        <Typography sx={{ ml: 2, color: 'red' }} level="body-sm" >You can not compare a layer against itself.</Typography>
                    </Fragment> : ''
            }

            {
                // display the selected product details for each pane
                ( leftPaneID !== defaultSelected || rightPaneID !== defaultSelected ) ?
                    <Fragment>
                        <Card>
                            <Stack direction={"column"} gap={ 1 }>
                                {
                                    // render the left pane selections
                                    <Fragment>
                                        <Typography sx={{ ml: 1 }} level="body-sm">Left pane:</Typography>
                                        <Typography sx={{ ml: 2 }} level="body-sm">Type: { leftPaneType } </Typography>
                                        <Typography sx={{ ml: 2, mb: 2 }} level="body-sm">ID: { leftPaneID } </Typography>
                                    </Fragment>
                                }

                                <Box textAlign='center'>
                                    <Button size="md" color="success" sx={{ mt: 0, mb: 1 }} onClick={ swapPanes }><SwapLayersIcon/></Button>
                                </Box>

                                {
                                    <Fragment>
                                        <Typography sx={{ ml: 1 }} level="body-sm">Right pane:</Typography>
                                        <Typography sx={{ ml: 2 }} level="body-sm">Type: { rightPaneType }</Typography>
                                        <Typography sx={{ ml: 2 }} level="body-sm">ID: { rightPaneID }</Typography>
                                    </Fragment>
                                }
                            </Stack>

                            <Box textAlign="center">
                                <Button size="md" sx={{ mr: 3 }} onClick={ clearPaneInfo }>Reset</Button>

                                {
                                    // show the compare button if it looks good to go
                                    ( leftPaneID !== defaultSelected && rightPaneID !== defaultSelected && leftPaneID !== rightPaneID ) ?
                                        <Button size="md" onClick={ compareLayers }>Compare</Button> : ''
                                }
                            </Box>
                        </Card>
                    </Fragment>: ''
            }

        </Fragment>
        );
};
