import React from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionDetails,
  Avatar,
  Stack,
  Switch,
  Typography,
} from '@mui/joy';
import {
  KeyboardArrowDown as ExpandIcon,
  Schedule as ClockIcon,
} from '@mui/icons-material';
import { useLayers, useSettings } from '@context';
import { useToggleState } from '@hooks';
import { LayerActions } from './layer-card-actions';
import { ActionButton } from '@components/buttons';
import { DeleteLayerButton } from './delete-layer-button';
import { getPreferredTimeZone } from "@utils/map-utils";

export const LayerCard = ({ layer }) => {
  const {
    getLayerIcon,
    toggleLayerVisibility2
  } = useLayers();

  /**
   * use the use UTC value from the settings state
   */
  const { useUTC } = useSettings();

  const expanded = useToggleState(false);
  const isVisible = layer.state.visible;

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
          '.action-button': { filter: 'opacity(0.5)', transition: 'filter 250ms' },
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
              { getLayerIcon(layer.properties.product_type) }
            </Avatar>
            <Typography level="title-sm" sx={{ flex: 1 }}>
              {layer.properties.product_name}
            </Typography>
            <Switch
              size="sm"
              checked={ isVisible }
              onChange={ () => toggleLayerVisibility2(layer.id) }
              className="action-button"
            />
            <DeleteLayerButton layerId={ layer.id }/>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="stretch"
            gap={ 2 }
            sx={{ flex: 1, pl: '50px' }}
          >
            <Typography level="body-sm" sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <ClockIcon sx={{ transform: 'scale(0.66)' }} /> { getPreferredTimeZone(layer.properties, useUTC.enabled) }
            </Typography>
            <Typography level="body-xs" sx={{ display: 'inline-flex', alignItems: 'center' }}>
              Cycle { layer.properties.cycle }
            </Typography>
          </Stack>
        </Stack>



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
        <LayerActions layer={ layer } />
      </AccordionDetails>
    </Accordion>

  );
};

LayerCard.propTypes = {
  index: PropTypes.number.isRequired,
  layer: PropTypes.object.isRequired,
};

