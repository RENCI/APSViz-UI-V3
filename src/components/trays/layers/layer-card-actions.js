import React from 'react';
import PropTypes from 'prop-types';
import { Divider } from '@mui/joy';
import {
  DeleteForever as RemoveIcon,
  Opacity as OpacityIcon,
  Palette as ColorRampIcon,
  DataObject as RawDataIcon,
} from '@mui/icons-material';
import { useLayers } from '@context';
import { ActionButton } from '@components/buttons';
import { ActionButtonMenu } from '@components/buttons';

export const LayerActions = ({ layerId = 0 }) => {
  const { removeLayer } = useLayers();

  return (
    <ActionButtonMenu>
      <ActionButton disabled>
        <RawDataIcon />
      </ActionButton>

      <ActionButton disabled>
        <OpacityIcon />
      </ActionButton>

      <ActionButton disabled>
        <ColorRampIcon />
      </ActionButton>

      <Divider orientation="vertical" />

      <ActionButton
        variant="solid"
        color="warning"
        onClick={ () => removeLayer(layerId) }
      >
        <RemoveIcon />
      </ActionButton>
    </ActionButtonMenu>
  );
};

LayerActions.propTypes = {
  layerId: PropTypes.string.isRequired,
};
