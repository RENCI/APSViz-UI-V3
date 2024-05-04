import React from 'react';
import PropTypes from 'prop-types';
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
  Opacity as OpacityIcon,
  Palette as ColorRampIcon,
} from '@mui/icons-material';
import { useLayers } from '@context';
import { useToggleState } from '@hooks';

export const LayersList = () => {
  const { defaultModelLayers } = useLayers();
  const layers = [...defaultModelLayers];

  return (
    <AccordionGroup variant="soft">
      {
        layers
          .sort((a, b) => a.state.order - b.state.order)
          .map((layer, index) => {
            return (
              <LayerCard
                key={ `layer-${ layer.id }` }
                layer={ layer }
                index={ index }
              />
            );
          })
      }
      <Divider />
    </AccordionGroup>
  );
};

const LayerCard = ({ index, layer }) => {
  const {
    layerTypes,
    removeLayer,
    swapLayers,
    toggleLayerVisibility,
  } = useLayers();
  const expanded = useToggleState(false);
  const isVisible = layer.state.visible;
  const LayerIcon = layerTypes[layer.properties.product_type].icon;

  const handleClickRemove = id => () => {
    removeLayer(id);
  };

  return (
    <Accordion
      expanded={ expanded.enabled }
      onChange={ expanded.toggle }
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
          <Stack direction="row" alignItems="center" sx={{
            flex: 1,
            filter: isVisible ? 'opacity(1.0)' : 'opacity(0.75)',
            transition: 'filter 250ms',
          }}>
            <Avatar sx={{ width: 36, height: 36 }}>
              <LayerIcon size="lg" color="primary" />
            </Avatar>
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
              <DragHandleIcon />
            </IconButton>
            <Typography level="body-sm" sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <ClockIcon sx={{ transform: 'scale(0.66)' }} /> { new Date(layer.properties.run_date).toLocaleString() }
              <Typography level="body-xs" sx={{ display: 'inline-flex', alignItems: 'center', ml: 3 }}>
                Cycle { layer.properties.cycle }
              </Typography>
            </Typography>
          </Stack>
        </Stack>

        {/* layer card actions start */}
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

        <Stack justifyContent="space-around" className="actions">
          <IconButton size="sm" variant="soft" disabled>
            <OpacityIcon />
          </IconButton>
          <IconButton size="sm" variant="soft" disabled>
            <ColorRampIcon />
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
            onClick={ () => swapLayers(index, index - 1) }
            sx={{ flex: 1 }}
          ><MoveUpArrow /></IconButton> 
          <IconButton
            onClick={ () => swapLayers(index, index + 1) }
            sx={{ flex: 1 }}
          ><MoveDownArrow /></IconButton> 
        </ButtonGroup>

        {/* layer card actions end */}
        
        <IconButton
          onClick={ expanded.toggle }
          size="sm"
          variant="soft"
        >
          <ExpandIcon
            fontSize="sm"
            sx={{
              transform: expanded.enabled ? 'rotate(180deg)' : 'rotate(0)',
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
};

LayerCard.propTypes = {
  index: PropTypes.number.isRequired,
  layer: PropTypes.object.isRequired,
};
