import React, { useState } from 'react';
import {
  Accordion,
  AccordionGroup,
  AccordionDetails,
  Avatar,
  Box,
  ButtonGroup,
  Divider,
  IconButton,
  Stack,
  Switch,
  Typography,
} from '@mui/joy';
import {
  DeleteForever as RemoveIcon,
  KeyboardArrowDown as ExpandIcon,
  ArrowDropUp as MoveUpArrow,
  ArrowDropDown as MoveDownArrow,
  Schedule as ClockIcon,
  DragIndicator as DragHandleIcon,
} from '@mui/icons-material';
import { useLayers } from '@context';

export const LayersList = () => {
  const {
    defaultModelLayers,
    layerTypes,
    removeLayer,
    swapLayers,
    toggleLayerVisibility,
  } = useLayers();
  const layers = [...defaultModelLayers];

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
    removeLayer(id);
  };

  return (
    <AccordionGroup variant="soft">
      {
        layers
          .sort((a, b) => a.state.order - b.state.order)
          .map(layer => {
            const isExpanded = expandedIds.has(layer.id);
            const isVisible = layer.state.visible;
            const LayerIcon = layerTypes[layer.properties.product_type].icon;

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
                    '.actions': { filter: 'opacity(0.1)', transition: 'filter 250ms' },
                    '&:hover .actions': { filter: 'opacity(0.5)' },
                    '& .actions:hover': { filter: 'opacity(1.0)' },
                  }}
                >
                  <Stack direction="column" sx={{ flex: 1 }}>
                    <Stack direction="row" alignItems="center" sx={{ flex: 1 }}>
                      <Avatar sx={{ width: 36, height: 36 }}>
                        <LayerIcon size="lg" color={ isVisible ? 'primary' : 'disabled' } />
                      </Avatar>{ console.log(layer)}
                      <Typography level="title-md">
                        {layerTypes[layer.properties.product_type].name}
                      </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="stretch" sx={{ flex: 1 }}>
                      <IconButton
                        size="sm"
                        sx={{
                          cursor: 'grab',
                          filter: 'opacity(0.5)',
                          transition: 'filter 250ms',
                          '&:hover': {
                            filter: 'opacity(1.0)',
                          },
                          m: 0,
                        }}
                      >
                        <DragHandleIcon fontSize="sm" />
                      </IconButton>
                      <Typography level="body-sm" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                        <ClockIcon sx={{ transform: 'scale(0.66)' }} /> { new Date(layer.properties.run_date).toLocaleString() }
                        <Typography level="body-xs" sx={{ display: 'inline-flex', alignItems: 'center', ml: 3 }}>
                          Cycle { layer.properties.cycle }
                        </Typography>
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* card actions start */}
                  <Stack justifyContent="space-around" className="actions">
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

                  <ButtonGroup
                    orientation="vertical"
                    size="sm"
                    className="actions"
                    sx={{
                      transform: 'scaleX(0.75)',
                      '.MuiIconButton-root': { flex: 1 }
                    }}
                  >
                    <IconButton
                      onClick={ () => swapLayers(layer.state.order, layer.state.order - 1) }
                      sx={{ flex: 1 }}
                    ><MoveUpArrow /></IconButton> 
                    <IconButton
                      onClick={ () => swapLayers(layer.state.order, layer.state.order + 1) }
                      sx={{ flex: 1 }}
                    ><MoveDownArrow /></IconButton> 
                  </ButtonGroup>
                  {/* card actions end */}
                  
                  <IconButton onClick={ handleToggleExpansion(layer.id) } size="sm" variant="soft">
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
