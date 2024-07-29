import React from 'react';
import PropTypes from 'prop-types';

import {
  DeleteForever as RemoveIcon,
} from '@mui/icons-material';
import { useLayers } from '@context';
import { ActionButton } from '@components/buttons';

export const DeleteLayerButton = ({ layerId }) => {
  const { removeLayer } = useLayers();

  return (
    <ActionButton
      color="danger"
      variant="outlined"
      onClick={ () => removeLayer(layerId) }
      sx={{
        'filter': 'opacity(0.2)',
        transition: 'filter 250ms',
        '&:hover': {
          'filter': 'opacity(1.0)',
        },
      }}
    >
      <RemoveIcon />
    </ActionButton>
  );
};

DeleteLayerButton.propTypes = {
  layerId: PropTypes.string.isRequired
};

export const DeleteModelRunButton = ({ groupId }) => {
  const { removeModelRun } = useLayers();

  return (
    <ActionButton
      color="danger"
      variant="outlined"
      onClick={ () => removeModelRun(groupId) }
      sx={{
        alignContent: 'right',
        m: 1,
        'filter': 'opacity(0.3)',
        transition: 'filter 250ms',
        '&:hover': {
          'filter': 'opacity(1.0)',
        },
      }}
    >
      <RemoveIcon />
    </ActionButton>
  );
};

DeleteModelRunButton.propTypes = {
  groupId: PropTypes.string.isRequired
};
