import React from 'react';
import { Sheet, Stack } from '@mui/joy';
import PropTypes from 'prop-types';

export const ActionButtonMenu = ({ children }) => {
  return (
    <Sheet
      component={ Stack }
      direction="row"
      justifyContent="flex-end"
      gap={ 1 }
      className="action-button-menu"
      sx={{
        p: 1,
        backgroundColor: 'background.surface',
      }}
    >
      { children }
    </Sheet>
  );
};

ActionButtonMenu.propTypes = {
  children: PropTypes.node.isRequired,
};
