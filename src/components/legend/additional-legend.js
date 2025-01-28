import React, { useRef, Fragment } from 'react';
import { Card, Box, Stack, Avatar, Typography } from '@mui/joy';
import { useLayers } from '@context';
import Draggable from "react-draggable";

/**
 * renders the legend for selected additional layers
 *
 * @constructor
 */
export const AdditionalMapLegend = () => {
    // install the selected observation list from the layer context
    const { externalLayers, topMostExtLegendIndex, setTopMostExtLegendIndex } = useLayers();

    // create a reference to avoid the findDOMNode deprecation issue
    const nodeRef = useRef(null);

    /**
     * handles a click on the legend to make it have focus
     */
    const handleClick = (index) => {
        // set the new topmost dialog in the stack
        setTopMostExtLegendIndex(index);
    };

    // render the legends
    return (
        <Fragment>
        {
            // loop through the external layers and create checkbox selections grouped by the source
            externalLayers
            // group by the source name
            .filter((val, idx, self) => (
                idx === self.findIndex((t)=> ( t['source'] === val['source']) ))
            )
            // output sources
            .map((layer) => (
                // display legends for all selected external layers
                externalLayers
                // group by the source name
                .filter(item => item.source === layer.source)
                // only render visible layers that have a URL to a legend
                .filter(item => (item.state.visible && item.params['legendURL']))
                // run through all the layers in each group
                .map((sublayer, itemIndex) => (
                    <Draggable
                        key={ itemIndex }
                        bounds="parent"
                        nodeRef={ nodeRef }
                        handle="#draggable-legend-card"
                        cancel={ '[class*="MuiDialogContent-root"]' }>

                        <Card
                            ref={ nodeRef }
                            variant="soft"
                            onClick={ () => handleClick(sublayer['row_num']) }
                            sx={{
                                position: 'absolute',
                                top: 10 + ( 15 * itemIndex ),
                                right: 75 + ( 25 * itemIndex ),
                                transition: 'filter 250ms',
                                padding: '5px',
                                border: 1,
                                borderRadius: 'sm',
                                filter: 'opacity(0.9)', '&:hover': { filter: 'opacity(1.0)' },
                                width: '60px',
                                zIndex: (sublayer['row_num'] === topMostExtLegendIndex) ? 1000 : 999 }}>

                                <Stack
                                    direction="column"
                                    gap={ 1 }
                                    p={ 1 }
                                    alignItems="center">

                                    <Avatar
                                        id="draggable-legend-card"
                                        variant="outlined"
                                        sx={{
                                            filter: 'opacity(0.9)',
                                            '&:hover': { filter: 'opacity(1.0)' },
                                            mt: -.5,
                                            p: 1,
                                            height: 50,
                                            width: 50,
                                            cursor: 'move'
                                        }}>

                                        <Typography sx={{ p: 0, m: 0, fontColor: "black", fontWeight: 'bold', fontSize: "10px" }}>
                                            { sublayer.source.split(' ').map(word => word.charAt(0)) } { sublayer.row_num }
                                        </Typography>
                                    </Avatar>

                                    <Box
                                        component="img"
                                        alt=""
                                        src={ sublayer.params['legendURL'] }
                                        sx={{ width: '50px', mb: -1, p: 0, height: '160px', zIndex: 999 }} />
                                </Stack>
                        </Card>
                    </Draggable>
                ))
            ))
        }
        </Fragment>
    );
};
