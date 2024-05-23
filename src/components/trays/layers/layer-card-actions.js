import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  ListItemDecorator,
  Slider,
  Tab,
  TabList,
  Tabs,
  TabPanel,
  Typography,
  Stack,
} from '@mui/joy';
import {
  DeleteForever as RemoveIcon,
  FormatPaint as AppearanceIcon,
  DataObject as MetadataIcon,
} from '@mui/icons-material';
import { useLayers, useSettings } from '@context';

const RemoveLayerButton = ({ onConfirm }) => {
  const [clicked, setClicked] = useState(false);

  const handleClickConfirm = () => {
    onConfirm();
  };

  return clicked ? (
    <Button
      color="danger"
      variant="solid"
      onClick={ handleClickConfirm }
      startDecorator={ <RemoveIcon /> }
    >Are you sure?</Button>
  ) : (
    <Button
      color="danger"
      variant="outlined"
      onClick={ () => setClicked(true) }
      startDecorator={ <RemoveIcon /> }
    >Remove Layer from Map</Button>
  );
};

RemoveLayerButton.propTypes = {
  onConfirm: PropTypes.func.isRequired,
};

//

export const LayerActions = ({ layer }) => {
  const { darkMode } = useSettings();
  const { removeLayer, setLayerOpacity } = useLayers();

  return (
    <Tabs defaultValue={0}>
      <TabList size="sm" sx={{ flex: 1 }}>
        <Tab variant="plain" color="primary">
          <ListItemDecorator>
            <AppearanceIcon fontSize="sm" />
          </ListItemDecorator>
          Appearance
        </Tab>
        <Tab variant="plain" color="primary">
          <ListItemDecorator>
            <MetadataIcon fontSize="sm" />
          </ListItemDecorator>
          Metadata
        </Tab>
        <Tab variant="plain" color="warning">
          <ListItemDecorator>
            <RemoveIcon fontSize="sm" />
          </ListItemDecorator>
          Remove
        </Tab>
      </TabList>

      <TabPanel value={ 0 } sx={{
        '.MuiFormLabel-root': {
          width: '120px',
          justifyContent: 'flex-end',
        },
      }}>
        <FormControl orientation="horizontal">
          <FormLabel>Opacity</FormLabel>
          <Slider
            aria-label="opacity slider"
            defaultValue={ 1.0 }
            step={ 0.01 }
            min={ 0.01 }
            max={ 1.0 }
            valueLabelDisplay="auto"
            sx={{ mr: '10px'}}
            onChange={ (event, newValue) => setLayerOpacity(layer.id, newValue) }
          />
        </FormControl>

        <FormControl orientation="horizontal" >
          <FormLabel>Color Ramp</FormLabel>
          <Box sx={{
            width: '100%',
            height: '48px',
            backgroundColor: darkMode.enabled ? '#fff1' : '#0001',
            color: '#999',
            borderRadius: 'sm',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>Coming soon...</Box>
        </FormControl>
      </TabPanel>
      
      <TabPanel value={ 1 }>
        <Box component="pre" sx={{
          fontSize: '75%',
          color: 'text.primary',
          backgroundColor: 'transparent',
          overflowX: 'auto',
          m: 0, p: 1,
          height: '100px',
        }}>
          { JSON.stringify(layer.properties, null, 2) }
        </Box>
      </TabPanel>

      <TabPanel value={ 2 } sx={{ p: 0 }}>
        <Stack
          justifyContent="center"
          alignItems="center"
          gap={ 2 }
          sx={{
            height: '120px',
            backgroundColor: 'var(--joy-palette-danger-softBg)',
          }}
        >
          <RemoveLayerButton onConfirm={ () => removeLayer(layer.id) } />
          <Typography level="body-sm" sx={{ fontStyle: 'italic' }}>
            Proceed with caution. This action cannot be undone.
          </Typography>
        </Stack>
      </TabPanel>
    </Tabs>
  );
};

LayerActions.propTypes = {
  layer: PropTypes.object.isRequired,
};
