import React, { useState } from 'react';
import {
  Accordion,
  AccordionGroup,
  AccordionDetails,
  Box,
  ButtonGroup,
  Divider,
  IconButton,
  ListItemContent,
  Stack,
  Switch,
  Typography,
} from '@mui/joy';
import {
  DeleteForever as RemoveIcon,
  KeyboardArrowDown as ExpandIcon,
  ArrowDropUp as MoveUpArrow,
  ArrowDropDown as MoveDownArrow,
} from '@mui/icons-material';
import { useLayers } from '@context';

export const LayersList = () => {
  const {
    defaultModelLayers,
    removeLayer,
    swapLayers,
    toggleLayerVisibility,
  } = useLayers();
  const layers = [...defaultModelLayers];

  // convert the product type to a readable layer name
  const layer_names = {
    obs: "Observations",
    maxwvel63: "Maximum Wind Velocity",
    maxele63: "Maximum Water Level",
    swan_HS_max63: "Maximum Wave Height",
    maxele_level_downscaled_epsg4326: "Hi-Res Maximum Water Level",
    hec_ras_water_surface: "HEC/RAS Water Surface",
  };

  const [expandedIds, setExpandedIds] = useState(new Set());

  const handleToggleExpansion = id => () => {
    const _expandedIds = new Set([...expandedIds]);
    if (_expandedIds.has(id)) {
      _expandedIds.delete(id);
      setExpandedIds(_expandedIds);
      return;
    }
    _expandedIds.add(id);
    setExpandedIds(_expandedIds);
  };

  const handleClickRemove = id => () => {
    removeLayer(id)
  }

  return (
    <AccordionGroup variant="soft">
      {
        layers
          .sort((a, b) => a.state.order - b.state.order)
          .map(layer => {
            const isExpanded = expandedIds.has(layer.id);
            const isVisible = layer.state.visible;
            const layerTitle = layer_names[layer.properties.product_type] + " " +
                          layer.properties.run_date + " " +
                          layer.properties.cycle;


            return (
              <Accordion
                key={ `layer-${ layer.id }-${ isVisible ? 'visible' : 'hidden' }` }
                expanded={ isExpanded }
                onChange={ handleToggleExpansion }
                sx={{ p: 0 }}
              >
                {/*
                  the usual AccordionSummary component results in a button,
                  but we want some buttons _inside_ the accordion summary,
                  so we'll build a custom component here.
                */}
                <Stack
                  direction="row"
                  gap={ 1 }
                  sx={{
                    p: 1,
                    borderLeft: '6px solid',
                    borderLeftColor: isVisible ? 'primary.400' : 'primary.100',
                    '.MuiIconButton-root': { filter: 'opacity(0.1)', transition: 'filter 250ms' },
                    '.MuiSwitch-root': { filter: 'opacity(0.1)', transition: 'filter 250ms' },
                    '&:hover .MuiIconButton-root': { filter: 'opacity(0.5)' },
                    '&:hover .MuiSwitch-root': { filter: 'opacity(0.5)' },
                    '& .MuiIconButton-root:hover': { filter: 'opacity(1.0)' },
                    '& .MuiSwitch-root:hover': { filter: 'opacity(1.0)' },
                  }}
                >
                  <ButtonGroup orientation="vertical" size="sm">
                    <IconButton
                      onClick={ () => swapLayers(layer.state.order, layer.state.order - 1) }
                    ><MoveUpArrow /></IconButton> 
                    <IconButton
                      onClick={ () => swapLayers(layer.state.order, layer.state.order + 1) }
                    ><MoveDownArrow /></IconButton> 
                  </ButtonGroup>
                  
                  <ListItemContent>
                    <Typography level="title-md">
                      {layerTitle}
                    </Typography>
                    <Typography
                      component="div"
                      level="body-sm"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      { layer.layers }
                    </Typography>
                  </ListItemContent>

                  <Stack justifyContent="space-around">
                    <Switch
                      size="sm"
                      checked={ isVisible }
                      onChange={ () => toggleLayerVisibility(layer.id) }
                    />

                    <IconButton
                      onClick={ handleClickRemove(layer.id) }
                      size="sm"
                      color="danger"
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Stack>

                  <IconButton onClick={ handleToggleExpansion(layer.id) }>
                    <ExpandIcon
                      fontSize="sm"
                      sx={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 100ms',
                      }}
                    />
                  </IconButton>
                </Stack>
                <AccordionDetails variant="solid" sx={{
                  // remove default margin that doesn't work well in our situation.
                  marginInline: 0,
                }}>
                  <Box component="pre" sx={{
                    fontSize: '75%',
                    color: '#def',
                    backgroundColor: 'transparent',
                    overflowX: 'auto',
                  }}>
                    { JSON.stringify(layer.properties, null, 2) }
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })
      }
      <Divider />
    </AccordionGroup>
  );
};
