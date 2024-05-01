import React, { Fragment } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';
import Slide from '@mui/material/Slide';

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

/**
 * This is the floating component that displays a floating dialog
 *
 * @param title
 * @param dialogText
 * @param openDialog
 * @returns {JSX.Element}
 * @constructor
 */
export default function BaseFloatingDialog({ title, description, openDialogImmediately, dialogObject} ) {
  const [open, setOpen] = React.useState(openDialogImmediately);

  // closes the dialog
  const handleClose = () => {
    setOpen(false);
  };

  // return the component that is rendered
  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        TransitionComponent={Transition}
        aria-labelledby="draggable-dialog-title"
        disableEnforceFocus
        style={{ pointerEvents: 'none', opacity: '100%' }}
        PaperProps={{ style: { pointerEvents: 'auto'} }}
        sx={{
          '.MuiBackdrop-root': {
            backgroundColor: 'transparent',
          }
        }}
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          { title }
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            { description }
          </DialogContentText>
          { dialogObject }
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

// define the properties of this component
BaseFloatingDialog.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  openDialogImmediately: PropTypes.bool,
  dialogObject: PropTypes.any
};
