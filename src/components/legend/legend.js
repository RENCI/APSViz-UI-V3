import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Card, Stack } from '@mui/joy';
import { useLayers, useSettings } from '@context';
import { getNamespacedEnvParam, restoreColorMapType  } from "@utils";
import SldStyleParser from 'geostyler-sld-parser';

import Draggable from "react-draggable";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

export const MapLegend = () => {
    // set correct map styles for layer name
    // may want to move this somewhere else later
    // for the implementation of user designed styles

    const [legendUrl, setLegendUrl] = useState("");
    const [legendVisibilty, setLegendVisibilty] = useState("hidden");
    const [layerIcon, setLayerIcon] = useState("");

    const sldParser = new SldStyleParser();

    const {
        defaultModelLayers,
        getLayerIcon,
        leftLayerProps, rightLayerProps
    } = useLayers();
    const {
        mapStyle,
    } = useSettings();

    useEffect(() => {
        // init the selected legend layer properties storage
        let legendLayer = null;

        // if we are in compare mode
        if(leftLayerProps && rightLayerProps)
            // use either set of layer properties
            legendLayer = leftLayerProps;
        else
            // else use the default selected layer
            legendLayer = defaultModelLayers.find(layer => layer.state.visible && layer.properties.product_type !== 'obs');

        if (!legendLayer) {
            setLegendVisibilty("hidden");
        }
        else {
            setLayerIcon(getLayerIcon(legendLayer.properties.product_type));

            // now build appropriate url for retrieving the legend graphic
            const workspace = legendLayer.layers.split(':')[0];
            const layerName = legendLayer.layers.split(':')[1];

            let style = "";
            if (legendLayer.properties.product_type.includes("maxwvel")) {
                style = mapStyle.maxwvel.current;
            }
            else 
            if (legendLayer.properties.product_type.includes("swan")) {
                style = mapStyle.swan.current;
            }
            else { // maxele 
                style = mapStyle.maxele.current;
            }

            // add the layer name to the style
            sldParser
                .readStyle(style)
                .then((geostylerStyle) => {
                    geostylerStyle.output.name = legendLayer.layers;
                    const colormapEntries = [...geostylerStyle.output.rules[0].symbolizers[0].colorMap.colorMapEntries];
                    // make the colormap backwards for the legend
                    const newcolormapEntries = colormapEntries.reverse();
                    geostylerStyle.output.rules[0].symbolizers[0].colorMap.colorMapEntries = newcolormapEntries;
                    // add the layer name to the style
                    geostylerStyle.output.name = (' ' + legendLayer.layers).slice(1);
                    // save the colormap type
                    const colorMapType = geostylerStyle.output.rules[0].symbolizers[0].colorMap.type;
                    sldParser.writeStyle(geostylerStyle.output)
                    .then((sldStyle) => {
                        const updatedStyle = restoreColorMapType(colorMapType, sldStyle.output);
                        const encodedStyle = encodeURIComponent(updatedStyle);
                        const url = `${ getNamespacedEnvParam('REACT_APP_GS_DATA_URL') }` +
                            workspace + "/" +
                            "ows?service=WMS&request=GetLegendGraphic&TRANSPARENT=TRUE&LEGEND_OPTIONS=layout:verticle&format=image%2Fpng&width=20&height=20&layer=" +
                            layerName + 
                            "&sld_body=" + encodedStyle;
                        setLegendUrl(url);
            
                        // all set - show the legend
                        setLegendVisibilty("visible");
                    });
            });
        } 
    }, [defaultModelLayers, mapStyle, leftLayerProps, rightLayerProps]);

    // define the starting size of the card
    const [newWidth, setNewWidth] = useState(45);
    const [newHeight, setNewHeight] = useState(200);

    // create a reference to avoid the findDOMNode deprecation issue
    const nodeRef = useRef(null);

    // declare the width min/max for the legend card
    const minWidth = 45;
    const maxWidth = 75;

    // declare the height min/max for the legend card
    const minHeight = 250;
    const maxHeight = 350;

    return (
        <Draggable
            bounds="parent"
            nodeRef={ nodeRef }
            handle="#draggable-card"
            cancel={'[class*="MuiDialogContent-root"]'}>
            <Resizable
                height={ newHeight }
                width={ newWidth }
                onResize={ (event) => {
                    setNewWidth(newWidth + event.movementX);
                    setNewHeight(newHeight + event.movementY);
                }}
            >
                <Card
                    ref={ nodeRef }
                    aria-labelledby="draggable-card"
                    variant="soft"
                    sx={{
                        ml: 10,
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        transition: 'filter 250ms',
                        filter: 'opacity(0.9)',
                        '&:hover': { filter: 'opacity(1.0)' },
                        padding: '10px',
                        zIndex: 999,
                        borderRadius: 'sm',
                        visibility: legendVisibilty,

                        width: newWidth + 16,
                        minWidth: minWidth,
                        maxWidth: maxWidth,

                        height: newHeight + 75,
                        minHeight: minHeight + 60,
                        maxHeight: maxHeight + 65
                    }}>
                        <Stack
                            direction="column"
                            gap={ 2 }
                            p={ 1 }
                            alignItems="center"
                        >
                            <Avatar variant="outlined" id="draggable-card" sx={{ m: -1, p: 0, height: 40, cursor: 'move' }}>
                                { layerIcon }
                            </Avatar>

                            <Box
                                component="img"
                                alt=""
                                src={ legendUrl }
                                sx={{
                                    //border: 1,
                                    // borderColor: 'primary.main',
                                    // mb: 1,
                                    height: newHeight,
                                    width: newWidth,
                                    minWidth: minWidth-5,
                                    minHeight: minHeight-10,
                                    maxWidth: maxWidth-10,
                                    maxHeight: maxHeight,
                                }}
                            />
                        </Stack>
                </Card>
            </Resizable>
        </Draggable>
    );
};
