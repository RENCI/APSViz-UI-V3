import React from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionDetails,
  Avatar,
  Box,
  ButtonGroup,
  Stack,
  Switch,
  Typography,
} from '@mui/joy';
import {
  KeyboardArrowDown as ExpandIcon,
  ArrowDropUp as MoveUpArrow,
  ArrowDropDown as MoveDownArrow,
  Schedule as ClockIcon,
} from '@mui/icons-material';
import { useLayers } from '@context';
import { useToggleState } from '@hooks';
import { LayerActions } from './layer-card-actions';
import { ActionButton } from '@components/buttons';

export const LayerCard = ({ index, layer }) => {
  const {
    layerTypes,
    swapLayers,
    toggleLayerVisibility,
  } = useLayers();
  const expanded = useToggleState(false);
  const isVisible = layer.state.visible;
  const LayerIcon = layerTypes[layer.properties.product_type].icon;

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
          // borderLeftColor: isVisible
          //   ? `rgba(${ theme.palette.primary.mainChannel }) / 1.0`
          //   : `rgba(${ theme.palette.primary.mainChannel }) / 0.2`,
          borderLeftColor: isVisible
            ? `primary.plainColor`
            : `primary.plainDisabledColor`,
          '.action-button': { filter: 'opacity(0.1)', transition: 'filter 250ms' },
          '&:hover .action-button': { filter: 'opacity(0.5)' },
          '& .action-button:hover': { filter: 'opacity(1.0)' },
        }}
      >
        <Stack direction="column" sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" gap={ 2 } sx={{
            filter: isVisible ? 'opacity(1.0)' : 'opacity(0.75)',
            transition: 'filter 250ms',
          }}>
            <Avatar variant="outlined">
              <LayerIcon size="lg" color="primary" />
            </Avatar>
            <Typography level="title-md">
              {layerTypes[layer.properties.product_type].name}
            </Typography>
            <Switch
              size="sm"
              checked={ isVisible }
              onChange={ () => toggleLayerVisibility(layer.id) }
              className="action-button"
            />
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="stretch"
            gap={ 2 }
            sx={{ flex: 1, pl: '50px' }}
          >
            <Typography level="body-sm" sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <ClockIcon sx={{ transform: 'scale(0.66)' }} /> { new Date(layer.properties.run_date).toLocaleString() }
            </Typography>
            <Typography level="body-xs" sx={{ display: 'inline-flex', alignItems: 'center' }}>
              Cycle { layer.properties.cycle }
            </Typography>
          </Stack>
        </Stack>

        <ButtonGroup
          size="sm"
          orientation="vertical"
          sx={{
            transform: 'scaleX(0.75)',
            '.MuiActionButton-root': { flex: 1 }
          }}
        >
          <ActionButton
            variant="outlined"
            onClick={ () => swapLayers(index, index - 1) }
          ><MoveUpArrow /></ActionButton> 
          <ActionButton
            variant="outlined"
            onClick={ () => swapLayers(index, index + 1) }
          ><MoveDownArrow /></ActionButton> 
        </ButtonGroup>

        <ActionButton
          onClick={ expanded.toggle }
        >
          <ExpandIcon
            fontSize="sm"
            sx={{
              transform: expanded.enabled ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 100ms',
            }}
          />
        </ActionButton>
      </Stack>
      <AccordionDetails sx={{
        backgroundColor: 'background.surface',
        position: 'relative',
        // remove default margin that doesn't work well in our situation.
        marginInline: 0,
        '.MuiAccordionDetails-content': {
          paddingInline: 0,
          paddingBlock: 0,
        },
      }}>
        <LayerActions layerId={ layer.id } />
        <Box component="pre" sx={{
          fontSize: '75%',
          color: 'text.primary',
          backgroundColor: 'transparent',
          overflowX: 'auto',
          p: 1,
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

