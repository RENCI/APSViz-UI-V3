import React, { useRef } from 'react';
import { Stack, Typography, Button, Card, Tooltip } from '@mui/joy';
import { useLayers } from '@context';
import { SwapHorizontalCircleSharp as SwapLayersIcon,
         CloseSharp as ResetIcon } from '@mui/icons-material';
import { getHeaderSummary } from "@utils/map-utils";
import Draggable from "react-draggable";

/**
 * renders the compare mode selections.
 *
 * @returns React.ReactElement
 * @constructor
 */
export const ComparePanel = () => {
    const {
        defaultModelLayers,

        // declare access to the compare mode items
        defaultSelected,
        leftPaneID, setLeftPaneID,
        rightPaneID, setRightPaneID,
        leftPaneType, setLeftPaneType,
        rightPaneType, setRightPaneType,
        leftLayerProps, setLeftLayerProps,
        rightLayerProps, setRightLayerProps,
        resetCompare, useUTC
    } = useLayers();

    // get the default model run layers
    const layers = [...defaultModelLayers];

    /**
     * gets the summary header text for the layer groups.
     * This takes into account the two types of runs (tropical, synoptic)
     *
     * @param layerProps
     * @returns {string}
     */
    const getHeaderSummaryByID = (paneID) => {
        // get the summary if a layer has been selected
        if (paneID !== defaultSelected) {
            // get the layer props
            const layerProps = layers.filter(item => item.id === paneID);

            // if the layers were captured
            if (layerProps !== undefined && layerProps.length !== 0) {
                // get the full header summary text
                return getHeaderSummary(layerProps[0]['properties'], useUTC);
            }
            else {
                // return the default text
                return defaultSelected;
            }
        }
        else {
            // return the default text
            return defaultSelected;
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
        const origLeftLayerProps = leftLayerProps;

        // clear the left layer type/ID
        setLeftPaneType(rightPaneType);
        setLeftPaneID(rightPaneID);
        setLeftLayerProps(rightLayerProps);

        // clear the right pane ID/Name
        setRightPaneType(origLeftPaneType);
        setRightPaneID(origLeftPaneID);
        setRightLayerProps(origLeftLayerProps);
    };

    // create a reference to avoid the findDOMNode deprecation issue
    const nodeRef = useRef(null);

    // render the panel
    return (
            <Draggable
                bounds="parent"
                nodeRef={ nodeRef }
                handle="#draggable-compare-card"
                cancel={'[class*="MuiDialogContent-root"]'}
            >
                <Card
                    ref={ nodeRef }
                    variant="soft"
                    sx={{
                        p: 0,
                        position: 'absolute',
                        top: '10px',
                        right: '90px',
                        filter: 'opacity(0.9)',
                        '&:hover': {filter: 'opacity(1.0)'},
                        ml: 1, mr: 1,
                        width: '750px',
                        zIndex: 999
                    }}>

                    {
                        // display the selected product details for each pane
                        (leftPaneID !== defaultSelected && rightPaneID !== defaultSelected) ?
                        <Stack direction={'column'} alignItems="center" sx={{ cursor: 'move' }} id="draggable-compare-card">
                            <Typography sx={{ mt: .5, mb: .5 }} level="body-sm"><strong>Comparing { leftPaneType } products</strong> </Typography>

                            <Stack direction={"row"} gap={ .5 } sx={{ mb: .5, mr: .5}}>
                                <Typography sx={{ ml: .5 }} level="body-xs">{ getHeaderSummaryByID(leftPaneID) } </Typography>

                                <Tooltip title={"Swap pane products"}>
                                   <Button size="xs" color="success" sx={{ mt: .5 }} onClick={ swapPanes }><SwapLayersIcon/></Button>
                                </Tooltip>

                                <Typography sx={{ ml: .5 }} level="body-xs">{ getHeaderSummaryByID(rightPaneID) } </Typography>

                                <Tooltip title={"Close compare mode"}>
                                    <Button size="xs" color="danger" sx={{ mt: .5 }} onClick={ resetCompare }><ResetIcon/></Button>
                                </Tooltip>
                            </Stack>
                        </Stack> : ''
                    }
                </Card>
            </Draggable>
    );
};