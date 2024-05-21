import React from 'react';
import PropTypes from 'prop-types';
import {
  Divider,
  Tab,
  TabList,
  Tabs,
  TabPanel,
  Stack,
} from '@mui/joy';
import {
  DeleteForever as RemoveIcon,
  Opacity as OpacityIcon,
  Palette as ColorRampIcon,
  DataObject as RawDataIcon,
} from '@mui/icons-material';
import { useLayers } from '@context';
import { ActionButton } from '@components/buttons';

export const LayerActions = ({ layerId = 0 }) => {
  const { removeLayer } = useLayers();

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
    >
      <Tabs sx={{ flex: 1 }}>
        <TabList>
          <Tab><RawDataIcon /></Tab>
          <Tab><OpacityIcon /></Tab>
          <Tab><ColorRampIcon /></Tab>
        </TabList>
      </Tabs>

      <Divider orientation="vertical" />

      <ActionButton
        color="warning"
        onClick={ () => removeLayer(layerId) }
        sx={{
          borderRadius: 0,
          borderBottom: '1px solid var(--joy-palette-divider)',
        }}
      >
        <RemoveIcon />
      </ActionButton>
    </Stack>
  );
};

LayerActions.propTypes = {
  layerId: PropTypes.string.isRequired,
};
