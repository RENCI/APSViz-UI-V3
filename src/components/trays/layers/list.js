import React from 'react';
import {
  AccordionGroup,
  Divider,
} from '@mui/joy';
import { useLayers } from '@context';
import { LayerCard } from './layer-card';

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

