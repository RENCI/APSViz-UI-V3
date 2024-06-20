import React, {Fragment} from 'react';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import { markUnclicked } from '@utils/map-utils';

// define the properties of this component's input
BaseFloatingDialog.propTypes = {
    title: PropTypes.string,
    dialogObject: PropTypes.any,
    dataKey: PropTypes.any,
    dataList: PropTypes.any,
    setDataList: PropTypes.func,
    map: PropTypes.any
};

/**
 * This is a component that displays a floating dialog with the content passed.
 * Note: this component
 *
 * @param title - the name of the dialog: string
 * @param dialogObject the object to render in the dialog: {JSX.Element}
 * @param dataKey - the key to the data list elements in state: string
 * @param dataList - a data list in state: array
 * @param setDataList - method to update a data list in state: function
 * @param map - a reference to the map state: object
 */
export default function BaseFloatingDialog({ title, dialogObject, dataKey, dataList, setDataList, map} ) {
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
    * configure and render the floating dialog
    */
    return (
        <Fragment>
            <CssBaseline />
                <Dialog
                    aria-labelledby="draggable-dialog-title"
                    open={true}
                    onClose={handleClose}
                    PaperComponent={PaperComponent}
                    TransitionComponent={Transition}
                    disableEnforceFocus
                    style={{ pointerEvents: 'none' }}
                    PaperProps={{ sx: { width: 750,  height: 485, pointerEvents: 'auto'} }}
                    sx={{ zIndex: 402, width: 750, height: 485, '.MuiBackdrop-root': { backgroundColor: 'transparent' }}}
                >
                    <DialogTitle
                        sx={{cursor: 'move', backgroundColor: 'lightblue', textAlign: 'center',
                            fontSize: 14, height: 35, m: 0, p: 1 }} id="draggable-dialog-title"> { title } </DialogTitle>

                    <DialogContent
                        sx={{backgroundColor: 'white', fontSize: 14, m: 0, width: 590, height: 350 }}>{ dialogObject }</DialogContent>

                    <DialogActions
                        sx={{backgroundColor: 'lightgray', height: 35, m: 0, p: 1}}>
                        <Button style={{fontSize: 14}} autoFocus onClick={ handleClose }> Close </Button></DialogActions>
                </Dialog>
        </Fragment>
    );
};

/**
* This creates a 3D dialog.
*
* @param props
* @returns {JSX.Element}
* @constructor
*/
function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper { ...props } />
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
