import React, { Fragment, useRef } from 'react';
import { Stack, Typography, Box, Button, Card } from '@mui/joy';
import { useLayers } from '@context';
import { SwapHorizontalCircleSharp as SwapLayersIcon } from '@mui/icons-material';
import Draggable from "react-draggable";

export const ComparePanel = () => {
    const {
        // getLayerIcon,
        // declare access to the compare mode items
        defaultSelected,
        leftPaneID, setLeftPaneID,
        rightPaneID, setRightPaneID,
        leftPaneType, setLeftPaneType,
        rightPaneType, setRightPaneType,
        leftLayerProps, setLeftLayerProps,
        rightLayerProps, setRightLayerProps,
        resetCompare
    } = useLayers();

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

    return (
        <Fragment>
        {
            // display the selected product details for each pane
            (leftPaneID !== defaultSelected || rightPaneID !== defaultSelected) ?
                <Draggable
                    nodeRef={nodeRef}
                    handle="#draggable-compare"
                    cancel={'[class*="MuiDialogContent-root"]'}>
                    <Card
                        ref={nodeRef}
                        aria-labelledby="draggable-compare"
                        variant="soft"
                        sx={{
                            p: 0,
                            position: 'absolute',
                            top: '3px',
                            right: '1px',
                            filter: 'opacity(0.9)',
                            '&:hover': {filter: 'opacity(1.0)'},
                            // padding: '10px',
                            ml: 1, mr: 1,
                            zIndex: 1000,
                            height: 40
                        }}>
                        <Stack direction={"row"} gap={ 1 } ref={ nodeRef }>
                            {
                                // render the left pane selections
                                <Fragment>
                                    {/*<Typography sx={{ ml: 1 }} level="body-sm">Left pane:</Typography>*/}
                                    <Typography sx={{ mt: 1, mb: 0, ml: 1, mr: 1 }} level="body-sm">{ leftPaneType } </Typography>
                                    {/*<Typography sx={{ ml: 2, mb: 2 }} level="body-sm">ID: { leftPaneID } </Typography>*/}
                                </Fragment>
                            }

                            <Box textAlign='center'>
                                <Button size="md" color="success" sx={{ mt: 0, mb: 0, ml: 1, mr: 1 }} onClick={ swapPanes }><SwapLayersIcon/></Button>
                            </Box>

                            {
                                <Fragment>
                                    {/*<Typography sx={{ ml: 1 }} level="body-sm">Right pane:</Typography>*/}
                                    <Typography sx={{ mt: 1, mb: 0, ml: 1, mr: 1 }} level="body-sm">{ rightPaneType }</Typography>
                                    {/*<Typography sx={{ ml: 2 }} level="body-sm">ID: { rightPaneID }</Typography>*/}
                                </Fragment>
                            }

                            <Box textAlign='center'>
                                <Button size="md" sx={{ mt: 0, mb: 0, ml: 1, mr: 1 }} onClick={ resetCompare }>Reset</Button>
                            </Box>
                         </Stack>
                    </Card>

                </Draggable> : ''
        }
        </Fragment>
    );
};