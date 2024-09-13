import React, { Fragment, useRef } from 'react';
import { Stack, Typography, Box, Button, Card } from '@mui/joy';
import { useLayers } from '@context';
import { SwapHorizontalCircleSharp as SwapLayersIcon } from '@mui/icons-material';

/**
 * gets the header data property name index
 * This takes into account the two types of runs (tropical, synoptic)
 *
 * @param layerProps
 * @param type
 * @returns {string}
 */
const getPropertyName = (layerProps, element_name) => {
    // init the return
    let ret_val = undefined;

    // capture the name of the element for tropical storms and advisory numbers
    if (layerProps['met_class'] === 'tropical') {
        // by the element name
        switch (element_name) {
            case 'stormOrModelEle':
                ret_val = layerProps['storm_name'];
                break;
            case 'numberName':
                ret_val = ' Adv: ';
                break;
            case 'numberEle':
                ret_val = layerProps['advisory_number'];
                break;
        }
    }
    // capture the name of the synoptic ADCIRC models and cycle numbers
    else {
        switch (element_name) {
            case 'stormOrModelEle':
                ret_val = layerProps['model'];
                break;
            case 'numberName':
                ret_val = ' Cycle: ';
                break;
            case 'numberEle':
                ret_val = layerProps['cycle'];
                break;
        }
    }

    // return to the caller
    return ret_val;
};

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
        resetCompare
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
    const getHeaderSummary = (paneID) => {
        // get the summary if a layer has been selected
        if (paneID !== defaultSelected) {
            // get the layer props
            const layerProps = layers.filter(item => item.id === paneID)[0]['properties'];

            // if layer properties were captured
            if (layerProps !== undefined) {
                // get the full accordian summary text
                return '' +
                    ((getPropertyName(layerProps, 'stormOrModelEle') === undefined) ? 'Data error' : getPropertyName(layerProps, 'stormOrModelEle').toUpperCase()) +
                    ', ' + getPropertyName(layerProps, 'numberName') + getPropertyName(layerProps, 'numberEle') +
                    ', Type: ' + layerProps['event_type'] +
                    ', Grid: ' + layerProps['grid_type'] +
                    ((layerProps['meteorological_model'] === 'None') ? '' : ', ' + layerProps['meteorological_model']);
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
        <Fragment>
        {
            // display the selected product details for each pane
            (leftPaneID !== defaultSelected || rightPaneID !== defaultSelected) ?
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
                        zIndex: 999,
                        height: 43
                    }}>
                    <Stack direction={"row"} gap={ 1 } ref={ nodeRef } sx={{ mt: .5 , mb: .5 }}>
                        {
                            // render the left pane selections
                            <Stack direction={"column"} gap={ .5 } sx={{ ml: .5 }}>
                                <Typography sx={{ m: 0 }} level="body-xs">{ getHeaderSummary(leftPaneID) } </Typography>
                                <Typography sx={{ m: 0 }} level="body-xs">{ leftPaneType } </Typography>
                            </Stack>
                        }

                        <Box textAlign='center'>
                            <Button size="md" color="success" sx={{ m: 0 }} onClick={ swapPanes }><SwapLayersIcon/></Button>
                        </Box>

                        {
                            <Stack direction={"column"} gap={ .5 }>
                                <Typography sx={{ m: 0 }} level="body-xs">{ getHeaderSummary(rightPaneID) } </Typography>
                                <Typography sx={{ m: 0 }} level="body-xs">{ rightPaneType }</Typography>
                            </Stack>
                        }

                        <Box textAlign='center'>
                            <Button size="md" sx={{ mr: .5 }} onClick={ resetCompare }>Reset</Button>
                        </Box>
                     </Stack>
                </Card> : ''
        }
        </Fragment>
    );
};