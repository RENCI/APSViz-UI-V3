import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/joy';

export const ActionButton = ({
  children,
  ...props
}) => {
  return (
    <IconButton
      size="sm"
      variant="soft"
      className="action-button"
      { ...props }
    >
      { children }
    </IconButton>
  );
};

ActionButton.propTypes = {
  children: PropTypes.node,
};
