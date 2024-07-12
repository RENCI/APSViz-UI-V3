import React from 'react';
import { Avatar, Box, Card, Stack } from '@mui/joy';
import { useLayers } from '@context';
import { getNamespacedEnvParam } from "@utils";

export const MapLegend = () => {

    // set correct map styles for layer name
    // may want to move this somewhere else later
    // for the implementation of user designed styles
    const layerStyles = {
        'maxele63': 'maxele_style_v3ui',
        'maxwvel63': 'maxwvel_style_v3ui',
        'swan_HS_max63': 'swan_style_v3ui',
        'maxinundepth63': 'maxele_style_v3ui',
        'maxele_level_downscaled_epsg4326': 'maxele_style_v3ui',
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
            zIndex: 410,
            borderRadius: 'sm',
            visibility: legendVisibilty,
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