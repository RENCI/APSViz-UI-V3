import React from 'react';
import { Sheet, Stack } from '@mui/joy';
import { GpsFixed as ObservationsIcon } from '@mui/icons-material';
import { useLayers } from '@context';

export const icon = <ObservationsIcon />;
export const title = 'Observations';
export const trayContents = () => {
  const { observations } = useLayers();

  return (
    <Stack p={ 1 } gap={ 1 }>
      {
        observations.current.map((obs, index) => (
          <div key={ `obs-${ obs.id }`}>
            <Sheet
              variant="outlined"
              component="pre"
              sx={{
                height: '100px',
                overflowY: 'scroll',
                fontSize: '66%',
                p: 1,
              }}
            >{ JSON.stringify(obs, null, 2) }</Sheet>
            <button onClick={ () => observations.remove(obs.id) }>delete</button>
            <button
              onClick={ () => observations.swap(index, index - 1) }
              disabled={ index === 0}
            >move up</button>
            <button
              onClick={ () => observations.swap(index, index + 1) }
              disabled={ index + 1 === observations.current.length }
            >move down</button>
            <button
              onClick={ () => observations.toggleVisibility(obs.id) }
            >show/hide</button>
          </div>
        ))
      }
      <div>visible observations</div>
      <pre>{JSON.stringify(observations.visible.map(o => o.id), null, 2)}</pre>
    </Stack>
  );
};
