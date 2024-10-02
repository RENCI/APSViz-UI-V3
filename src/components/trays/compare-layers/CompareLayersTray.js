import React, { Fragment, useState, useEffect } from 'react';
import { Stack, Typography, Box, Button, Card, Accordion, AccordionSummary, AccordionDetails, AccordionGroup } from '@mui/joy';
import { useLayers, useSettings } from '@context';
import { getNamespacedEnvParam } from "@utils/map-utils";
import SldStyleParser from 'geostyler-sld-parser';
import { getHeaderSummary } from "@utils/map-utils";

// install the side by side compare control
require('@side-by-side');

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
 * @returns JSX.Element
 * @constructor
 */
export const CompareLayersTray = () => {
    // get the context for the compare layers view
    const {
        map,
        getLayerIcon,

        defaultModelLayers, setDefaultModelLayers, getAllRasterLayersInvisible,

        // declare access to the compare mode items
        defaultSelected,
        leftPaneID, setLeftPaneID,
        rightPaneID, setRightPaneID,
        leftPaneType, setLeftPaneType,
        rightPaneType, setRightPaneType,
        leftLayerProps, setLeftLayerProps,
        selectedLeftLayer, setSelectedLeftLayer,
        rightLayerProps, setRightLayerProps,
        selectedRightLayer, setSelectedRightLayer,
        setSideBySideLayers,
        resetCompare, removeSideBySideLayers, inCompareMode, setInCompareMode
    } = useLayers();

    const {
        mapStyle,
    } = useSettings();

    // used to collapse other open accordions
    const [accordionIndex, setAccordionIndex] = useState(null);

    // get the default model run layers
    const layers = [...defaultModelLayers];

    // get a handle to the leaflet component
    const L = window.L;

    // get a new geoserver sld parser
    const sldParser = new SldStyleParser();

    // get the unique groups in the selected model runs
    const groupList = getModelRunGroupList(layers);

    // get the URL to the geoserver
    const gs_wfs_url = `${ getNamespacedEnvParam('REACT_APP_GS_DATA_URL') }`;
    const gs_wms_url = gs_wfs_url + 'wms';

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
        else if (paneSide === 'right') {
            // set the layer name
            setRightPaneType(paneType);

            // set the layer id
            setRightPaneID(paneID);
        }

        // make sure the default raster layers are invisible
        setDefaultLayersInvisible();
    };

    /**
     * resets the accordion
     */
    const resetAccordion = () => {
        // rollup the accordions
        setAccordionIndex(null);
    };

    /**
     * gets the default SLD style template using the layer properties
     *
     * @param layerProps
     * @returns {*}
     */
    function getSLDStyleTemplate ( layerProps ) {
        // init some style storage
        let style;

        // get the SLD style by the type of product
        switch (layerProps.properties['product_type']) {
            // max wind speed
            case ("maxwvel63"):
                style = mapStyle.maxwvel.current;
                break;
            // max significant wave height
            case ("swan_HS_max63"):
                style = mapStyle.swan.current;
                break;
            // max water levels
            default:
                style = mapStyle.maxele.current;
                break;
        }

        // return the style template
        return style;
    }

    /**
     * sets the visibility to false for raster layers
     *
     */
    const setDefaultLayersInvisible = () => {
        // if we are not in compare mode
        if (!inCompareMode) {
            // make all default raster layers invisible
            setDefaultModelLayers(getAllRasterLayersInvisible());
        }
    };

    /**
     * reset compare mode if anything happens to the default layers
     *
     */
    useEffect(() => {
        // only reset the compare view if we are in compare mode
        if (inCompareMode) {
            // reset this view
            resetCompare();
            resetAccordion();
            setInCompareMode(false);
        }
    }, [defaultModelLayers]);

    /**
     * this use effect waits for the layer properties (left and right) to get populated
     * and applies the color map style to the layers
     *
     */
    useEffect (() => {
        // if we have left and right layer properties
        if(leftLayerProps && rightLayerProps) {
            // remove the side-by-side compare control and layers
            removeSideBySideLayers();

            // get the left pane style template
            let style = getSLDStyleTemplate(leftLayerProps);

            // get the left pane style and then the map layer
            sldParser
                .readStyle(style)
                .then((geoStylerStyle) => {
                    geoStylerStyle.output.name = (' ' + leftLayerProps.layers).slice(1);

                    // get the SLD style and add the layer to the map
                    sldParser.writeStyle(geoStylerStyle.output).then((sldStyle) => {
                        // create a left pane layer
                        setSelectedLeftLayer(L.tileLayer.wms(gs_wms_url, {
                            format: 'image/png',
                            transparent: true,
                            name: leftPaneType,
                            layers: leftLayerProps.layers,
                            sld_body: sldStyle.output
                        }).addTo(map));

                    });
                });

            // get the right pane style template
            style = getSLDStyleTemplate(rightLayerProps);

            // get the right pane style and then the map layer
            sldParser
                .readStyle(style)
                .then((geoStylerStyle) => {
                    geoStylerStyle.output.name = (' ' + rightLayerProps.layers).slice(1);

                    // get the SLD style and add the layer to the map
                    sldParser.writeStyle(geoStylerStyle.output).then((sldStyle) => {
                        // create the right pane layer
                        setSelectedRightLayer(L.tileLayer.wms(gs_wms_url, {
                            format: 'image/png',
                            transparent: true,
                            name: rightPaneType,
                            layers: rightLayerProps.layers,
                            sld_body: sldStyle.output
                        }).addTo(map));
                    });
                });

            // set that we are in now fully in compare mode
            setInCompareMode(true);
        }
    }, [leftLayerProps, rightLayerProps, mapStyle]);

    /**
     * this use effect creates the side-by-side compare control and layers
     *
     */
    useEffect(() => {
        // if we have both panes ready for rendering
        if(selectedLeftLayer && selectedRightLayer) {
            // add the selected layers to the map and state so it can be removed later
            setSideBySideLayers(L.control.sideBySide(selectedLeftLayer, selectedRightLayer, { padding: 0 }).addTo(map));
        }
    }, [selectedLeftLayer, selectedRightLayer]);

    /**
     * this effect updates the layer properties when the pane layers are selected
     *
     */
    useEffect(() => {
        // if there is a legit left pane layer selected
        if(leftPaneID !== defaultSelected) {
            // get the left layer properties
            setLeftLayerProps(layers.filter(item => item.id === leftPaneID)[0]);
        }

        // if there is a legit right pane layer selected
        if(rightPaneID !== defaultSelected) {
            // get the right layer properties
            setRightLayerProps(layers.filter(item => item.id === rightPaneID)[0]);
        }
    }, [leftPaneID, rightPaneID]);

    /**
     * renders the layer cards for a model run for pane selection
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
                         <Stack direction="column" sx={{ flex: 1 }}>
                             <Stack direction="row" alignItems="center" gap={ .5 }>

                             { getLayerIcon(layer.properties['product_type']) }

                             <Typography level="body-xs" sx={{ flex: 1 }}> { layer.properties['product_name'] }</Typography>

                             <Button size="xs" color={ (layer.id === leftPaneID) ? 'success' : 'primary' }
                                     sx={{ ml: 2, mr: 2 }}
                                     onClick={ () => setPaneInfo('left', layer.properties['product_name'], layer.id) }>Left pane</Button>
                            <Button size="xs" color={ (layer.id === rightPaneID) ? 'success' : 'primary' }
                                     sx={{ m: 0 }}
                                     onClick={ () => setPaneInfo('right', layer.properties['product_name'], layer.id) }>Right pane</Button>
                            </Stack>
                         </Stack>
                     </Card>
                );
            });

        // return to the caller
        return layerCards;
    };

    // render the layer selection controls for each model run
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
                // sort by the group name
                .sort((a, b) => a['properties']['run_date'] + a['group'] > b['properties']['run_date'] + b['group'] ? 1 : -1)
                // at this point we have the distinct runs
                .map((layer, idx) => (
                    <Box key={ idx }>
                        <Accordion
                            expanded={accordionIndex === idx}
                            onChange={ (event, expanded) => { setAccordionIndex(expanded ? idx : null); }}
                        >
                            <AccordionSummary>
                                <Typography level="body-xs">{ getHeaderSummary(layer['properties']) }</Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                                { renderLayerCards(layer['group']) }
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                ))
            }
            </AccordionGroup>
        </Fragment>
    );
};
