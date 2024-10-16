import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  ListItemDecorator,
  Tab,
  TabList,
  Tabs,
  TabPanel,
  Stack,
} from '@mui/joy';
import {
  DataObject as MetadataIcon,
} from '@mui/icons-material';

export const LayerActions = ({ layer }) => {

  return (
    <Tabs defaultValue={0}>
      <Stack
        direction="row"
        justifyContent="space-between"
      >
        <TabList size="sm" sx={{ flex: 1 }}>
{/*           <Tab variant="plain" color="primary">
            <ListItemDecorator>
              <AppearanceIcon fontSize="sm" />
            </ListItemDecorator>
            Appearance
          </Tab> */}
          <Tab variant="plain" color="primary">
            <ListItemDecorator>
              <MetadataIcon fontSize="sm" />
            </ListItemDecorator>
            Metadata
          </Tab>
        </TabList>
      </Stack>

{/*       <TabPanel value={ 0 } sx={{
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
      </TabPanel> */}
      
      <TabPanel value={ 0 }>
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
    </Tabs>
  );
};

LayerActions.propTypes = {
  layer: PropTypes.object.isRequired,
};
