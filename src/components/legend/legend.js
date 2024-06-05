import React from 'react';
import { Avatar, Box, Card, Stack } from '@mui/joy';
import { useLayers } from '@context';

export const MapLegend = () => {

    const {
        defaultModelLayers,
        layerTypes,
    } = useLayers();

    let LegendIcon = layerTypes['maxele63'].icon;
    let legendUrl = '';

    // need to find the top-most layer that is currently visible
    const legendLayer = defaultModelLayers.find(layer => layer.state.visible && layer.properties.product_type !== 'obs');
    if (legendLayer) {
        LegendIcon = layerTypes[legendLayer.properties.product_type].icon;

        // now build appropriate url for retrieving the legend graphic
        const workspace = legendLayer.layers.split(':')[0];
        const layerName = legendLayer.layers.split(':')[1];
        legendUrl = `${process.env.REACT_APP_GS_DATA_URL}` + 
                    workspace + "/" +
                    "ows?service=WMS&request=GetLegendGraphic&TRANSPARENT=TRUE&LEGEND_OPTIONS=layout:verticle&format=image%2Fpng&width=20&height=20&layer=" +
                    layerName;
    }

    return (
        <Card
            variant="soft"
            sx={{
            p: 0,
            position: 'absolute',
            top: 'calc(4 * var(--joy-spacing))',
            right: 'calc(4 * var(--joy-spacing))',
            transition: 'filter 250ms',
            filter: 'opacity(0.9)',
            '&:hover': { filter: 'opacity(1.0)' },
            height: 'auto',
            width: '100px',
            padding: '10px',
            zIndex: 999,
            borderRadius: 'sm',
        }}         
        >
            <Stack 
                sx={{ height: '100%'}}
                direciton="column" 
                gap={ 1 } 
                alignItems="center">
                <Avatar variant="outlined">
                    <LegendIcon size="lg" color="primary" />
                </Avatar>
                <Box
                    component="img"
                    width="50px"
                    alt="Legend"
                    src={legendUrl}
                />
            </Stack>
        </Card>
    );
};