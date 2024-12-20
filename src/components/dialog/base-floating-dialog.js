import React, { useState, useRef, useEffect } from 'react';
import { ToggleButtonGroup, ToggleButton, Box, Stack, Typography,
    Dialog, DialogContent, DialogTitle, Paper, IconButton} from '@mui/material';
import Draggable from "react-draggable";
import PropTypes from 'prop-types';
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import {markUnclicked} from '@utils/map-utils';
import {useLayers} from "@context";

// define the properties of this component's input
BaseFloatingDialog.propTypes = {
    title: PropTypes.string,
    index: PropTypes.number,
    dialogObject: PropTypes.object,
    dataKey: PropTypes.string,
    dataList: PropTypes.array,
    setDataList: PropTypes.func,
    map: PropTypes.any,
    showLineButtonView:  PropTypes.any,
    toggleLineView: PropTypes.any
};

/**
 * This is a component that displays a floating dialog with the content passed.
 * Note: this component
 *
 * @param title - the name of the dialog: string
 * @param index - the index of the data
 * @param dialogObject the object to render in the dialog: React.ReactElement
 * @param dataKey - the key to the data list elements in state: string
 * @param dataList - a data list in state: array
 * @param setDataList - method to update a data list in state: function
 * @param map - a reference to the map state: object
 * @param toggleLineView - toggles the visibility of a chart line
 */
export default function BaseFloatingDialog({ title, index, dialogObject, dataKey, dataList, setDataList, map, showLineButtonView, toggleLineView } ) {
    // declare state to capture the dialog size
    const [newWidth, setNewWidth] = useState(460);
    const [newHeight, setNewHeight] = useState(250);

    // declare the width/height min/max
    const minWidth = 350;
    const maxWidth = 800;

    const minHeight = 175;
    const maxHeight = 500;

    // get the context for the compare layers view
    const {
        topMostDialogIndex, setTopMostDialogIndex
    } = useLayers();

    /**
    * the close dialog handler
    */
    const handleClose = () => {
        // if there was a data key defined, use it
        if (dataKey !== undefined) {
            // remove the bullseye
            markUnclicked(map, dataKey);

            // remove this item from the data list
            setDataList(dataList.filter(item => item.id !== dataKey));
        }
    };

    /**
     * handles a click on the dialog to make it have focus
     */
    const handleClick = () => {
        // set the new topmost dialog in the stack
        setTopMostDialogIndex(index);
    };

    /**
     * Runs when the dialog is created to make it have focus
     */
    useEffect( () => {
        // set the focus on this dialog
        setTopMostDialogIndex(index);
    }, [] );

    /**
    * configure and render the resizeable floating dialog
    */
    return (
            <Resizable
                height={ newHeight }
                width={ newWidth }
                maxWidth=""
                onResize={ (event) => {
                    setNewWidth(newWidth + event.movementX);
                    setNewHeight(newHeight + event.movementY);
                }}
                axis="x"
                draggableOpts={{ handleSize: [20, 20] }}>
                <Dialog
                    onClick={ handleClick }
                    onClose={ handleClose }
                    aria-labelledby="draggable-dialog"
                    open={ true }
                    PaperComponent={ PaperComponent }
                    disableEnforceFocus
                    style={{ pointerEvents: 'none' }}
                    PaperProps={{left: index * 45, top: index * 35, sx: { pointerEvents: 'auto' } }}
                    sx={{ ml: 6, zIndex: (index===topMostDialogIndex) ? 1000 : 999, '.MuiBackdrop-root': { backgroundColor: 'transparent' }}}>

                <DialogTitle
                    id="draggable-dialog"
                    sx={{ p: 1, display: 'flex', alignItems: 'center', cursor: 'move', backgroundColor: 'lightblue' }}>
                    <Typography
                        sx={{ mt: .25, wordWrap: 'break-word', width: newWidth, minWidth: minWidth, maxWidth: maxWidth, maxHeight: maxHeight, flexWrap: "wrap", fontSize: 12}}>
                        { title }
                    </Typography>
                </DialogTitle>

                <IconButton onClick={ handleClose } sx={{ position: 'absolute', right: 2, top: 0 }}>
                    <CloseOutlinedIcon fontSize="small" color={"primary"}/>
                </IconButton>

                <DialogContent sx={{ fontSize: 10, p: "5px" }}>
                    <Stack direction="column" spacing={ '5px' } alignItems="center" >
                        <ToggleButtonGroup variant="text" onChange={(event, newValue) => { toggleLineView(newValue); }}>
                            <Stack display="wrap" sx={{ flexWrap: "wrap" }} direction="row" spacing={'2px'}  alignItems="center">
                                {showLineButtonView("Observations") ?
                                    <Box><ToggleButton
                                    value="Observations"
                                    sx={{ '&:hover': { color: 'White', backgroundColor: 'Black' }, m: 0, p: "3px", color: 'Black' , fontSize: 8 }}>
                                    Observations</ToggleButton></Box> : ''
                                }

                                {(showLineButtonView("APS Nowcast")) ?
                                    <Box><ToggleButton
                                    value="APS Nowcast"
                                    sx={{ '&:hover': { color: 'White', backgroundColor: 'CornflowerBlue' }, m: 0, p: "3px", color: 'CornflowerBlue', fontSize: 8 }}>
                                    APS Nowcast</ToggleButton></Box> : ''
                                }

                                {(showLineButtonView("APS Forecast")) ?
                                    <Box><ToggleButton
                                    value="APS Forecast"
                                    sx={{ '&:hover': { color: 'White', backgroundColor: 'LimeGreen' }, m: 0, p: "3px", color: 'LimeGreen', fontSize: 8 }}>
                                    APS Forecast</ToggleButton></Box> : ''
                                }

                                {(showLineButtonView("SWAN Nowcast")) ?
                                    <Box><ToggleButton
                                    value="SWAN Nowcast"
                                    sx={{ '&:hover': { color: 'White', backgroundColor: 'CornflowerBlue' }, m: 0, p: "3px", color: 'CornflowerBlue', fontSize: 8 }}>
                                    SWAN Nowcast</ToggleButton></Box> : ''
                                }

                                {(showLineButtonView("SWAN Forecast")) ?
                                    <Box><ToggleButton
                                    value="SWAN Forecast"
                                    sx={{ '&:hover': { color: 'White', backgroundColor: 'LimeGreen' }, m: 0, p: "3px", color: 'LimeGreen', fontSize: 8 }}>
                                    SWAN Forecast</ToggleButton></Box> : ''
                                }

                                {(showLineButtonView("NOAA Tidal Predictions")) ?
                                    <Box><ToggleButton
                                    value="NOAA Tidal Predictions"
                                    sx={{ '&:hover': { color: 'White', backgroundColor: 'Teal' }, m: 0, p: "3px", color: 'Teal', fontSize: 8 }}>
                                    NOAA Tidal Predictions</ToggleButton></Box> : ''
                                }

                                {(showLineButtonView("Difference (APS-OBS)")) ?
                                    <Box><ToggleButton
                                    value="Difference (APS-OBS)"
                                    sx={{ '&:hover': { color: 'White', backgroundColor: 'Red' }, m: 0, p: "3px", color: 'Red', fontSize: 9 }}>
                                    Difference (APS-OBS)</ToggleButton></Box> : ''
                                }
                            </Stack>
                        </ToggleButtonGroup>

                        <Box sx={{ width: newWidth, minWidth: minWidth, maxWidth: maxWidth, height: newHeight, minHeight: minHeight, maxHeight: maxHeight }}> { dialogObject } </Box>
                    </Stack>
                </DialogContent>
            </Dialog>
        </Resizable>
    );
}

// define the additional props for dialog positioning
PaperComponent.propTypes = {
    left: PropTypes.number,
    top: PropTypes.number
};

/**
* This creates a draggable area for the dialog content
*
* @param props
* @constructor
*/
function PaperComponent(props) {
    // create a reference to avoid the findDOMNode deprecation issue
    const nodeRef = useRef(null);

    // render the component
    return (
        <Draggable
            bounds="parent"
            nodeRef={ nodeRef }
            handle="#draggable-dialog"
            cancel={'[class*="MuiDialogContent-root"]'}
            defaultPosition={{x: props.left, y: props.top}}>
            <Paper ref={ nodeRef } { ...props } />
        </Draggable>
    );
}
