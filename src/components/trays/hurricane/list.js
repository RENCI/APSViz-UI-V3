import React from 'react';
import {
  AccordionGroup,
  Divider,
} from '@mui/joy';
import { useLayers } from '@context';
import { HurricaneCard } from './hurricane-card';

export const HurricaneList = () => {
  const { hurricaneTrackLayers } = useLayers();
  const layers = [...hurricaneTrackLayers];

  return (
    <AccordionGroup variant="soft">
      {
        layers
          //.sort((a, b) => a.state.order - b.state.order)
          .map((layer, index) => {
            return (
              <HurricaneCard
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