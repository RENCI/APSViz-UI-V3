import React, { useState } from 'react';
import {
  Accordion,
  AccordionGroup,
  AccordionDetails,
  Box,
  Divider,
  IconButton,
  ListItemContent,
  Stack,
  Switch,
  Typography,
} from '@mui/joy';
import {
  DragIndicator as DragHandleIcon,
  KeyboardArrowDown as ExpandIcon,
} from '@mui/icons-material';
import { useLayers } from '@context';

export const LayersList = () => {
  const { defaultModelLayers } = useLayers();
  const layers = [...defaultModelLayers];

  console.log(layers);

  const [expandedIds, setExpandedIds] = useState(new Set());
  // of course, this is dummy state.
  // real state will be maintained in some higher-up context.
  const [visibleIds, setVisibleIds] = useState(new Set());

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

  const handleToggleVisibilitySwitch = id => () => {
    const _visibleIds = new Set([...visibleIds]);
    if (_visibleIds.has(id)) {
      _visibleIds.delete(id);
      setVisibleIds(_visibleIds);
      return;
    }
    _visibleIds.add(id);
    setVisibleIds(_visibleIds);
  };

  return (
    <AccordionGroup variant="soft">
      {
        layers.map(layer => {
          const isExpanded = expandedIds.has(layer.id);
          const isVisible = visibleIds.has(layer.id);

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
                  '.MuiIconButton-root': { filter: 'opacity(0.25)', transition: 'filter 250ms' },
                  '.MuiSwitch-root': { filter: 'opacity(0.25)', transition: 'filter 250ms' },
                  '&:hover .MuiIconButton-root': { filter: 'opacity(1.0)' },
                  '&:hover .MuiSwitch-root': { filter: 'opacity(1.0)' },
                }}
              >
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

                <ListItemContent>
                  <Typography level="title-md">
                    { layer.id }
                  </Typography>
                  <Typography
                    component="div"
                    level="body-sm"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'no-wrap',
                    }}
                  >
                    { layer.layers }
                  </Typography>
                </ListItemContent>

                <Switch
                  size="sm"
                  onChange={ handleToggleVisibilitySwitch(layer.id) }
                  checked={ isVisible }
                />

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
