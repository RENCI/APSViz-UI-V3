import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Divider,
  Tab,
  TabList,
  Tabs,
  TabPanel,
  Stack,
  Typography,
} from '@mui/joy';
import {
  DeleteForever as RemoveIcon,
  Palette as ColorRampIcon,
  DataObject as RawDataIcon,
} from '@mui/icons-material';
import { useLayers } from '@context';
import { ActionButton } from '@components/buttons';

export const LayerActions = ({ layer }) => {
  const { removeLayer } = useLayers();

  return (
    <Tabs defaultValue={0}>
      <Stack
        direction="row"
        justifyContent="space-between"
      >
        <TabList sx={{ flex: 1 }}>
          <Tab><RawDataIcon /></Tab>
          <Tab><ColorRampIcon /></Tab>
        </TabList>

        <Divider orientation="vertical" />

        <ActionButton
          color="warning"
          onClick={ () => removeLayer(layer.id) }
          sx={{
            borderRadius: 0,
            borderBottom: '1px solid var(--joy-palette-divider)',
          }}
        >
          <RemoveIcon />
        </ActionButton>
      </Stack>

      <TabPanel value={ 0 }>
        <Typography
          level="title-sm"
          textTransform="uppercase"
        >Metadata</Typography>
        <Box component="pre" sx={{
          fontSize: '75%',
          color: 'text.primary',
          backgroundColor: 'transparent',
          overflowX: 'auto',
          m: 0, p: 1,
        }}>
          { JSON.stringify(layer.properties, null, 2) }
        </Box>
      </TabPanel>
      
      <TabPanel value={ 1 }>
        <Typography
          level="title-sm"
          textTransform="uppercase"
        >Appearance</Typography>
        - opacity <br />
        - color ramp selection <br />
      </TabPanel>
    </Tabs>
  );
};

LayerActions.propTypes = {
  layer: PropTypes.object.isRequired,
};
