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
  const { defaultModelLayers, toggleLayerVisibility } = useLayers();
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

  //console.table(layers);

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

  return (
    <AccordionGroup variant="soft">
      {
        layers.map(layer => {
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

                <Switch
                  size="sm"
                  checked={ isVisible }
                  onChange={ () => toggleLayerVisibility(layer.id) }
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
