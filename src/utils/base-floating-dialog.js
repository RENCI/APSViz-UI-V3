import React, {Fragment} from 'react';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';

import { useLayers } from '@context';

// define the properties of this component
BaseFloatingDialog.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  openDialogImmediately: PropTypes.bool,
  dialogObject: PropTypes.any
};

/**
 * This is a component that displays a floating dialog with the content passed
 *
 * @param title: string
 * @param description: string
 * @param openDialogImmediately: boolean
 * @param dialogObject: {JSX.Element}
 * @returns {JSX.Element}
 */
export default function BaseFloatingDialog({ title, description, openDialogImmediately, dialogObject} ) {
  // define the dialog open/close session state
  const [open, setOpen] = React.useState(openDialogImmediately);

  const {
      selectedObservations,
      setSelectedObservations
  } = useLayers();

  /**
   * the close dialog handler
   */
  const handleClose = () => {
    // close the dialog
    setOpen(false);

    // remove this item from the selected observations list
    setSelectedObservations(selectedObservations.filter(item => item.station_name !== title));
  };

  /**
   * configure and render the floating dialog
   */
  return (
    <Fragment>
      <CssBaseline />
      <Dialog
        aria-labelledby="draggable-dialog-title"
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        TransitionComponent={Transition}
        disableEnforceFocus
        style={{ pointerEvents: 'none'}}
        PaperProps={{ style: { pointerEvents: 'auto'} }}
        sx={{ '.MuiBackdrop-root': { backgroundColor: 'transparent' }}}
      >
        <DialogTitle sx={{cursor: 'move', backgroundColor: 'lightgray', textAlign: 'center'}} id="draggable-dialog-title"> { "Station: " + title } </DialogTitle>

        <DialogContent sx={{backgroundColor: 'lightblue'}}><DialogContentText> { "Location: " + description } </DialogContentText></DialogContent>

        <DialogContent sx={{backgroundColor: 'lightgreen'}}>{ dialogObject }</DialogContent>

        <DialogActions sx={{backgroundColor: 'lightgray'}}><Button autoFocus onClick={handleClose}> Close </Button></DialogActions>
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
      <Paper {...props} />
    </Draggable>
  );
}

/**
 * This creates an animated transition for the dialog that pops up
 * @type {React.ForwardRefExoticComponent<React.PropsWithoutRef<{}> & React.RefAttributes<any>>}
 */
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});