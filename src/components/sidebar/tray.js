import React from 'react';
import PropTypes from 'prop-types';
import { DialogContent, DialogTitle, Divider, IconButton, Sheet, Stack } from '@mui/joy';
import { KeyboardDoubleArrowLeft as CloseTrayIcon } from '@mui/icons-material';

const TRAY_WIDTH = '500px';

export const Tray = ({ active, Contents, title, closeHandler }) => {
  return (
    <Sheet
      variant="plain"
      sx={{
        position: 'absolute',
        top: 0,
        left: '68px',
        transform: active ? 'translateX(0)' : 'translateX(-120%)',
        transition: 'transform 250ms',
        height: '100vh',
        width: TRAY_WIDTH,
        zIndex: 1000,
        filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.2))',
        overflow: 'hidden',
        // overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        ".tray-header": {
          p: 2,
          '.MuiDialogTitle-root': { flex: 1 },
        },
        ".tray-contents": {
          p: 0,
          // overflow: 'hidden',
        },
      }}
    >
      <Stack
        className="tray-header"
        direction="row"
        alignItems="center"
      >
        <DialogTitle>
          { title }
        </DialogTitle>
        <IconButton onClick={ closeHandler } size="sm">
          <CloseTrayIcon fontSize="sm" />
        </IconButton>
      </Stack>

      <Divider />

      <DialogContent className="tray-contents">
        <Contents />
      </DialogContent>
    </Sheet>
  );
};

Tray.propTypes = {
  active: PropTypes.bool.isRequired,
  Contents: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
  title: PropTypes.string.isRequired,
  closeHandler: PropTypes.func.isRequired,
};
