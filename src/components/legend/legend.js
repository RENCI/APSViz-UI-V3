import React, { Fragment } from 'react';
import { Avatar, Box, Card, Stack } from '@mui/joy';
import { useLayers } from '@context';
import { getNamespacedEnvParam } from "@utils";

import Draggable from "react-draggable";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

export const MapLegend = () => {
    // set correct map styles for layer name
    // may want to move this somewhere else later
    // for the implementation of user designed styles
    const layerStyles = {
        //'maxele63': 'maxele_style_v3ui',
        // added this temporarily for Debby
        'maxele63': 'maxele_v3_short_legend_style',
        'maxwvel63': 'maxwvel_style_v3ui',
        'swan_HS_max63': 'swan_style_v3ui',
        'maxinundepth63': 'maxele_style_v3ui',
        // added this temporarily for Debby
        'maxele_level_downscaled_epsg4326': 'maxele_v3_short_legend_style',
        'hec_ras_water_surface': 'maxele_style_v3ui'
    };

    const {
        defaultModelLayers,
        layerTypes,
    } = useLayers();
    let legendVisibilty = "hidden";

    let LegendIcon = layerTypes['maxele63'].icon;
    let legendUrl = '';

    // need to find the top-most layer that is currently visible
    const legendLayer = defaultModelLayers.find(layer => layer.state.visible && layer.properties.product_type !== 'obs');
    if (legendLayer) {
        LegendIcon = layerTypes[legendLayer.properties.product_type].icon;

        // now build appropriate url for retrieving the legend graphic
        const workspace = legendLayer.layers.split(':')[0];
        const layerName = legendLayer.layers.split(':')[1];
        const style = layerStyles[layerName.substring(layerName.indexOf('_')+1)];

        legendUrl = `${ getNamespacedEnvParam('REACT_APP_GS_DATA_URL') }` +
                    workspace + "/" +
                    "ows?service=WMS&request=GetLegendGraphic&TRANSPARENT=TRUE&LEGEND_OPTIONS=layout:verticle&format=image%2Fpng&width=20&height=20&layer=" +
                    layerName + 
                    "&style=" + style;
    
        // all set - show the legend
        legendVisibilty = "visible";

    }
    else {
        // if no layers turned on, hide legend
        legendVisibilty = "hidden";
    }

    // define the starting size of the card
    const [newWidth, setNewWidth] = React.useState(75);
    const [newHeight, setNewHeight] = React.useState(600);

    // create a reference to avoid the findDOMNode deprecation issue
    const nodeRef = React.useRef(null);

    // declare the mins/maxes for the dialog content area
    const minWidth = 40;
    const minHeight = 450;
    const maxWidth = 100;
    const maxHeight = 700;

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
                            visibility: legendVisibilty,
                            height: newHeight+60, width: newWidth,
                            minWidth: minWidth, minHeight: minHeight+70, maxWidth: maxWidth, maxHeight: maxHeight+70
                        }}
                    >
                        <Stack
                            direciton="column"
                            gap={ 1 }
                            alignItems="center"
                        >
                            <Avatar variant="outlined" id="draggable-card"  sx={{ m: 0, p: 0, height: 40, cursor: 'move' }}>
                                <LegendIcon size="lg" color="primary" />
                            </Avatar>

                            <Box component="img" alt="Legend" src={ legendUrl }
                                 sx={{ height: newHeight, width: newWidth,
                                 minWidth: minWidth, minHeight: minHeight, maxWidth: maxWidth, maxHeight: maxHeight }}
                            />
                        </Stack>
                    </Card>
                </Resizable>
            </Draggable>
        </Fragment>
    );
};