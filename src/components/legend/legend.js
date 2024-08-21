import React, { useState, Fragment, useEffect } from 'react';
import { Avatar, Box, Card, Stack } from '@mui/joy';
import { useLayers } from '@context';
import { getNamespacedEnvParam } from "@utils";
import { useLocalStorage } from '@hooks';
import SldStyleParser from 'geostyler-sld-parser';
import { maxeleStyle, maxwvelStyle, swanStyle } from '@utils';

import Draggable from "react-draggable";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

const MAXELE = 'maxele';
const MAXWVEL = 'maxwvel';
const SWAN = 'swan';

export const MapLegend = () => {
    // set correct map styles for layer name
    // may want to move this somewhere else later
    // for the implementation of user designed styles

    const [storedMaxeleStyle] = useLocalStorage(MAXELE);
    const [storedMaxwvelStyle] = useLocalStorage(MAXWVEL);
    const [storedSwanStyle] = useLocalStorage(SWAN);
    const [legendUrl, setLegendUrl] = useState("");
    const [legendVisibilty, setLegendVisibilty] = useState("hidden");

    const sldParser = new SldStyleParser();

    const {
        defaultModelLayers,
        layerTypes,
    } = useLayers();

    let LegendIcon = layerTypes['maxele63'].icon;

    useEffect(() => {

        // need to find the top-most layer that is currently visible
        const legendLayer = defaultModelLayers.find(layer => layer.state.visible && layer.properties.product_type !== 'obs');
        if (legendLayer) {
            LegendIcon = layerTypes[legendLayer.properties.product_type].icon;

            // now build appropriate url for retrieving the legend graphic
            const workspace = legendLayer.layers.split(':')[0];
            const layerName = legendLayer.layers.split(':')[1];

            let style = "";
            if (legendLayer.properties.product_type.includes("maxwvel")) {
                if (storedMaxwvelStyle)
                    style = storedMaxwvelStyle;
                else
                    style = maxwvelStyle;
            }
            else 
            if (legendLayer.properties.product_type.includes("swan")) {
                if (storedSwanStyle)
                    style = storedSwanStyle;
                else
                    style = swanStyle;
            }
            else { // maxele 
                if (storedMaxeleStyle)
                    style = storedMaxeleStyle;
                else
                    style = maxeleStyle;
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
                sldParser.writeStyle(geostylerStyle.output)
                .then((sldStyle) => {
                    const encodedStyle = encodeURIComponent(sldStyle.output);
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
        else {
            // if no layers turned on, hide legend
            setLegendVisibilty("hidden");
        }
    }, [defaultModelLayers]);

    // define the starting size of the card
    const [newWidth, setNewWidth] = React.useState(60);
    const [newHeight, setNewHeight] = React.useState(400);

    // create a reference to avoid the findDOMNode deprecation issue
    const nodeRef = React.useRef(null);

    // declare the mins/maxes for the dialog content area
    const minWidth = 40;
    const minHeight = 400;
    const maxWidth = 110;
    const maxHeight = 600;

    return (
        <Fragment>
            <Draggable
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
                    axis="x"
                >
                    <Card
                        ref={ nodeRef }
                        aria-labelledby="draggable-card"
                        variant="soft"
                        sx={{
                            p: 0,
                            position: 'absolute',
                            top: 'calc(4 * var(--joy-spacing))',
                            right: 'calc(4 * var(--joy-spacing))',
                            transition: 'filter 250ms',
                            filter: 'opacity(0.9)',
                            '&:hover': { filter: 'opacity(1.0)' },
                            padding: '10px',
                            zIndex: 410,
                            borderRadius: 'sm',
                            visibility: {legendVisibilty},
                            width: newWidth, height: newHeight+70,
                            minWidth: minWidth, minHeight: minHeight+70, maxWidth: maxWidth, maxHeight: maxHeight+65
                        }}>
                        <Stack
                            direction="column"
                            gap={ 1 }
                            alignItems="center">
                            <Avatar variant="outlined" id="draggable-card"  sx={{ m: 0, p: 0, height: 40, cursor: 'move' }}>
                                <LegendIcon size="lg" color="primary" />
                            </Avatar>

                            <Box component="img" alt="Legend" src={ legendUrl }
                                 sx={{ height: newHeight, width: newWidth,
                                 minWidth: minWidth, minHeight: minHeight, maxWidth: maxWidth-10, maxHeight: maxHeight-10 }}
                            />
                        </Stack>
                    </Card>
                </Resizable>
            </Draggable>
        </Fragment>
    );
};
