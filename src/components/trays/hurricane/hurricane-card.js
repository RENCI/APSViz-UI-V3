import React from 'react';
import {
  Accordion,
  AccordionDetails,
  Stack,
  Switch,
  Typography,
} from '@mui/joy';
import {
  Schedule as ClockIcon,
} from '@mui/icons-material';
import { useLayers } from '@context';
import { useToggleState } from '@hooks';

export const HurricaneCard = ( index, layer ) => {
  const {
    toggleLayerVisibility,
  } = useLayers();
  const expanded = useToggleState(false);
  const isVisible = true;

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
        {layer.properties &&
        <Stack direction="column" sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" gap={ 2 } sx={{
            filter: isVisible ? 'opacity(1.0)' : 'opacity(0.75)',
            transition: 'filter 250ms',
          }}>
            <Typography level="title-md">
              {layer.properties.storm_name}
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
              <ClockIcon sx={{ transform: 'scale(0.66)' }} /> { new Date(layer.properties.run_date).toUTCString }
            </Typography>
            <Typography level="body-xs" sx={{ display: 'inline-flex', alignItems: 'center' }}>
              Cycle { layer.properties.advisory }
            </Typography>
          </Stack>
        </Stack>}
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
      </AccordionDetails>
    </Accordion>
  );
};