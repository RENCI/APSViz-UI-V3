import React, { useState } from 'react';
import {
  Accordion,
  AccordionGroup,
  AccordionDetails,
  Divider,
  IconButton,
  ListItemContent,
  Stack,
  Switch,
  Typography,
} from '@mui/joy';
import {
  KeyboardArrowDown as ExpandIcon,
} from '@mui/icons-material';
import { DragIndicator as DragHandleIcon } from '@mui/icons-material';

const dummyLayers = [
  {
    id: '234567',
    name: 'Ullamco anim ad',
  },
  {
    id: '0987654',
    name: 'In ad tempor',
  },
  {
    id: '9846351',
    name: 'Eu in laborum',
  },
];

export const LayersList = () => {
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
        dummyLayers.map(layer => {
          const isExpanded = expandedIds.has(layer.id);
          const isVisible = visibleIds.has(layer.id);

          return (
            <Accordion
              key={ `layer-${ layer.id }-${ isVisible ? 'visible' : 'hidden' }` }
              expanded={ isExpanded }
              onChange={ handleToggleVisibilitySwitch }
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
                    { layer.name }
                  </Typography>
                  <Typography level="body-sm">
                    some details.
                    some details.
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
              <AccordionDetails variant="soft" sx={{
                // remove default margin that doesn't work well in our situation.
                marginInline: 0,
              }}>
                Lorem ipsum ad deserunt adipisicing deserunt sint deserunt qui occaecat consequat aliquip.
              </AccordionDetails>
            </Accordion>
          );
        })
      }
      <Divider />
    </AccordionGroup>
  );
};
