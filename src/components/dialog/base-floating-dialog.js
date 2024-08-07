import React, { Fragment } from 'react';
import { ButtonGroup, Button, Box, Stack } from '@mui/joy';
import Draggable from "react-draggable";
import PropTypes from 'prop-types';

import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

import { markUnclicked } from '@utils/map-utils';

import CssBaseline from '@mui/material/CssBaseline';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

// define the properties of this component's input
BaseFloatingDialog.propTypes = {
    title: PropTypes.string,
    index: PropTypes.any,
    dialogObject: PropTypes.any,
    dataKey: PropTypes.any,
    dataList: PropTypes.any,
    setDataList: PropTypes.func,
    map: PropTypes.any,
    toggleLineView: PropTypes.any
};

/**
 * This is a component that displays a floating dialog with the content passed.
 * Note: this component
 *
 * @param title - the name of the dialog: string
 * @param index - the index of the data
 * @param dialogObject the object to render in the dialog: {JSX.Element}
 * @param dataKey - the key to the data list elements in state: string
 * @param dataList - a data list in state: array
 * @param setDataList - method to update a data list in state: function
 * @param map - a reference to the map state: object
 * @param toggleLineView - toggles the visibility of a chart line
 */
export default function BaseFloatingDialog({ title, index, dialogObject, dataKey, dataList, setDataList, map, toggleLineView } ) {
    const [width, setWidth] = React.useState(600);
    const [height, setHeight] = React.useState(300);

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
    * configure and render the resizeable floating dialog
    */
    return (
        <Fragment>
            <CssBaseline />
            <Resizable
                height={ height }
                width={ width }
                maxWidth=""
                onResize={ (event) => {
                    setWidth(width + event.movementX);
                    setHeight(height + event.movementY);
                }}
                axis="x"
                draggableOpts={{ handleSize: [20, 20] }}
            >
                <Dialog
                    aria-labelledby="draggable-dialog"
                    open={ true }
                    onClose={ handleClose }
                    PaperComponent={ PaperComponent }
                    TransitionComponent={ Transition }
                    disableEnforceFocus
                    style={{ pointerEvents: 'none' }}
                    PaperProps={{ sx: { pointerEvents: 'auto' } }}
                    sx={{ zIndex: 405, '.MuiBackdrop-root': { backgroundColor: 'transparent' }, left: index * 50, top: index * 75 }}>
                    <DialogTitle
                        id="draggable-dialog"
                        sx={{ cursor: 'move', backgroundColor: 'lightblue', textAlign: 'left', fontSize: 14, height: 40, p: 1.3 }}>
                        <Stack direction="row" justifyContent="space-between">
                            { title }
                            <IconButton size="small" onClick={ handleClose } sx={{ marginTop: -.9, marginRight: -1 }}>
                                <CloseOutlinedIcon color={"primary"}/>
                            </IconButton>
                        </Stack>
                    </DialogTitle>

                    <DialogContent sx={{ backgroundColor: 'white', fontSize: 11, m: 0 }}>
                        <Stack direction="column" gap={ 1 } alignItems="center">
                            <ButtonGroup variant="outlined" size="small" aria-label="Basic button group">
                                <Button variant="outlined" sx={{ color: 'white', backgroundColor: 'Black' }} onClick={() => toggleLineView("Observations")}>Observations</Button>
                                <Button variant="outlined" sx={{ color: 'white', backgroundColor: 'Teal' }} onClick={() => toggleLineView("NOAA Tidal Predictions")}>NOAA Tidal Predictions</Button>
                                <Button variant="outlined" sx={{ color: 'white', backgroundColor: 'CornflowerBlue' }} onClick={() => toggleLineView("APS Nowcast")}>APS Nowcast</Button>
                                <Button variant="outlined" sx={{ color: 'white', backgroundColor: 'LimeGreen' }} onClick={() => toggleLineView("APS Forecast")}>APS Forecast</Button>
                                <Button variant="outlined" sx={{ color: 'white', backgroundColor: 'Red' }} onClick={() => toggleLineView("Difference (APS-OBS)")}>Difference (APS-OBS)</Button>
                            </ButtonGroup>

                            <Box sx={{ height: height, width: width }}>
                                { dialogObject }
                            </Box>
                        </Stack>
                    </DialogContent>
                </Dialog>
            </Resizable>
        </Fragment>
    );
}

/**
* This creates a 3D dialog.
*
* @param props
* @returns {JSX.Element}
* @constructor
*/
function PaperComponent(props) {
    // create a reference to avoid the findDOMNode deprecation issue
    const nodeRef = React.useRef(null);

    // render the component
    return (
        <Draggable nodeRef={nodeRef} handle="#draggable-dialog" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper ref={nodeRef} {...props} />
        </Draggable>
    );
}

/**
 * This creates an animated transition for the dialog that pops up
*
* @type {React.ForwardRefExoticComponent<React.PropsWithoutRef<{}> & React.RefAttributes<any>>}
*/
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ ref } { ...props } />;
});
