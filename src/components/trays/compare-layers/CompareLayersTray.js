import React, { Fragment, useState } from 'react';
import { Stack, Typography, Box, Button, Card, Accordion, AccordionSummary, AccordionDetails, AccordionGroup } from '@mui/joy';
import { useLayers } from '@context';
import 'leaflet-side-by-side';
import { getNamespacedEnvParam } from "@utils/map-utils";

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
        map,
        defaultModelLayers,
        layerTypes
    } = useLayers();

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
    const [sideBySideLayer, setSideBySideLayer] = useState(null);

    // get the default model run layers
    const layers = [...defaultModelLayers];

    // get the unique groups in the selected model runs
    const groupList = getGroupList(layers);

    /**
     * removes the side by side layers
     *
     */
    const removeSideBySideLayers = () => {
        // remove the current compare layers if they exist
        if (sideBySideLayer) {
            // remove the layers on each pane
            map.removeLayer(sideBySideLayer['_leftLayer']);
            map.removeLayer(sideBySideLayer['_rightLayer']);

            // remove the side by side layer
            sideBySideLayer.remove();

            // reset the compared layers
            setSideBySideLayer(null);
        }
    };

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

        // remove the side by side layers
        removeSideBySideLayers();

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
    const setPaneInfo = (paneType, paneName, paneID) => {
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
        // if we have legit layers to compare
        if (leftPaneName !== defaultSelected && rightPaneName !== defaultSelected) {
            // get a handle to the leaflet component
            const L = window.L;

            // remove the side by side layers
            removeSideBySideLayers();

            // get the URL to the geoserver
            const gs_wfs_url = `${ getNamespacedEnvParam('REACT_APP_GS_DATA_URL') }`;
            const gs_wms_url = gs_wfs_url + 'wms';

            // get the left layer properties
            const leftLayerProps = layers.filter(item => item.id === leftPaneID);

            // create a left pane layer
            const selectedLeftLayer = L.tileLayer.wms(gs_wms_url,
                {
                    format: 'image/png',
                    transparent: true,
                    name: leftPaneName,
                    layers: leftLayerProps[0].layers,
                    sld_body: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:se="http://www.opengis.net/se"><NamedLayer><Name>' + leftLayerProps[0].layers + '</Name><UserStyle><Name>' + leftLayerProps[0].layers + '</Name><Title>' + leftLayerProps[0].layers + '</Title><FeatureTypeStyle><Rule><RasterSymbolizer><ColorMap><ColorMapEntry color="#30123B" quantity="0" label="0.0 m"/><ColorMapEntry color="#3D3790" quantity="1" label="1.0 m"/><ColorMapEntry color="#455ACD" quantity="2" label="2.0 m"/><ColorMapEntry color="#467BF3" quantity="3" label="3.0 m"/><ColorMapEntry color="#3E9BFF" quantity="4" label="4.0 m"/><ColorMapEntry color="#28BBEC" quantity="5" label="5.0 m"/><ColorMapEntry color="#18D7CC" quantity="6" label="6.0 m"/><ColorMapEntry color="#21EBAC" quantity="7" label="7.0 m"/><ColorMapEntry color="#46F884" quantity="8" label="8.0 m"/><ColorMapEntry color="#78FF5A" quantity="9" label="9.0 m"/><ColorMapEntry color="#A3FD3C" quantity="10" label="10.0 m"/><ColorMapEntry color="#C4F133" quantity="11" label="11.0 m"/><ColorMapEntry color="#E2DD37" quantity="12" label="12.0 m"/><ColorMapEntry color="#F6C33A" quantity="13" label="13.0 m"/><ColorMapEntry color="#FEA531" quantity="14" label="14.0 m"/><ColorMapEntry color="#FC8021" quantity="15" label="15.0 m"/><ColorMapEntry color="#F05B11" quantity="16" label="16.0 m"/><ColorMapEntry color="#DE3D08" quantity="17" label="17.0 m"/><ColorMapEntry color="#C42502" quantity="18" label="18.0 m"/><ColorMapEntry color="#A31201" quantity="19" label="19.0 m"/><ColorMapEntry color="#7A0402" quantity="20" label="20.0 m"/></ColorMap><ChannelSelection><GrayChannel><SourceChannelName>1</SourceChannelName><ContrastEnhancement><GammaValue>1</GammaValue></ContrastEnhancement></GrayChannel></ChannelSelection></RasterSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>'
                }
            ).addTo(map);

            // get the right layer properties
            const rightLayerProps = layers.filter(item => item.id === rightPaneID);

            // create the right pane layer
            const selectedRightLayer = L.tileLayer.wms(gs_wms_url,
                {
                    format: 'image/png',
                    transparent: true,
                    name: rightPaneName,
                    layers: rightLayerProps[0].layers,
                    sld_body: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:se="http://www.opengis.net/se"><NamedLayer><Name>' + rightLayerProps[0].layers + '</Name><UserStyle><Name>' + leftLayerProps[0].layers + '</Name><Title>' + leftLayerProps[0].layers + '</Title><FeatureTypeStyle><Rule><RasterSymbolizer><ColorMap><ColorMapEntry color="#30123B" quantity="0" label="0.0 m"/><ColorMapEntry color="#3D3790" quantity="1" label="1.0 m"/><ColorMapEntry color="#455ACD" quantity="2" label="2.0 m"/><ColorMapEntry color="#467BF3" quantity="3" label="3.0 m"/><ColorMapEntry color="#3E9BFF" quantity="4" label="4.0 m"/><ColorMapEntry color="#28BBEC" quantity="5" label="5.0 m"/><ColorMapEntry color="#18D7CC" quantity="6" label="6.0 m"/><ColorMapEntry color="#21EBAC" quantity="7" label="7.0 m"/><ColorMapEntry color="#46F884" quantity="8" label="8.0 m"/><ColorMapEntry color="#78FF5A" quantity="9" label="9.0 m"/><ColorMapEntry color="#A3FD3C" quantity="10" label="10.0 m"/><ColorMapEntry color="#C4F133" quantity="11" label="11.0 m"/><ColorMapEntry color="#E2DD37" quantity="12" label="12.0 m"/><ColorMapEntry color="#F6C33A" quantity="13" label="13.0 m"/><ColorMapEntry color="#FEA531" quantity="14" label="14.0 m"/><ColorMapEntry color="#FC8021" quantity="15" label="15.0 m"/><ColorMapEntry color="#F05B11" quantity="16" label="16.0 m"/><ColorMapEntry color="#DE3D08" quantity="17" label="17.0 m"/><ColorMapEntry color="#C42502" quantity="18" label="18.0 m"/><ColorMapEntry color="#A31201" quantity="19" label="19.0 m"/><ColorMapEntry color="#7A0402" quantity="20" label="20.0 m"/></ColorMap><ChannelSelection><GrayChannel><SourceChannelName>1</SourceChannelName><ContrastEnhancement><GammaValue>1</GammaValue></ContrastEnhancement></GrayChannel></ChannelSelection></RasterSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>'
                }
            ).addTo(map);

            // add the selected layers to the map
            const sideBySideLayer = L.control.sideBySide(selectedLeftLayer, selectedRightLayer, { padding: 0 }).addTo(map);

            // add the handle to the new layers to state so we can remove it later
            setSideBySideLayer(sideBySideLayer);
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
            .sort((a, b) => a['properties']['product_name'] < b['properties']['product_name'] ? -1 : 1)
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
                                     onClick={ () => setPaneInfo('left', layer.properties['product_name'], layer.id) }>Left pane</Button>
                             <Button size="md" color={ (layer.id === rightPaneID) ? 'success' : 'primary' }
                                     sx={{ m: 0 }}
                                     onClick={ () => setPaneInfo('right', layer.properties['product_name'], layer.id) }>Right pane</Button>
                         </Stack>
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

            <Button size="md" onClick={ clearPaneInfo }>Reset</Button>

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
                // display panel selections
                ( leftPaneID !== defaultSelected || rightPaneID !== defaultSelected ) ?
                    <Fragment>
                        <Card>
                            <Stack direction={"column"} gap={ 1 }>
                                {
                                    // render the left pane selections
                                    ( leftPaneID !== defaultSelected ) ?
                                        <Fragment>
                                            <Typography sx={{ ml: 1 }} level="body-sm">Left pane:</Typography>
                                            <Typography sx={{ ml: 2 }} level="body-sm">Name: { leftPaneName } </Typography>
                                            <Typography sx={{ ml: 2, mb: 2 }} level="body-sm">Layer: { leftPaneID } </Typography>
                                        </Fragment> : ''
                                }

                                {
                                    // render the right pane selections
                                    ( rightPaneID !== defaultSelected ) ?
                                        <Fragment>
                                            <Typography sx={{ ml: 1 }} level="body-sm">Right pane:</Typography>
                                            <Typography sx={{ ml: 2 }} level="body-sm">Name: { rightPaneName }</Typography>
                                            <Typography sx={{ ml: 2 }} level="body-sm">Layer: { rightPaneID }</Typography>
                                        </Fragment> : ''
                                }

                            </Stack>
                            {
                                // show the compare button if it looks good to go
                                ( leftPaneID !== defaultSelected && rightPaneID !== defaultSelected && leftPaneID !== rightPaneID ) ?
                                    <Fragment>
                                        <Button size="md" onClick={ compareLayers }>Compare</Button>
                                    </Fragment> : ''
                            }
                        </Card>
                    </Fragment>: ''
            }
        </Fragment>
        );
};
