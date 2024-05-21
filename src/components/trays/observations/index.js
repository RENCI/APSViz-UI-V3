import React, { useCallback } from 'react';
import { Sheet, Stack } from '@mui/joy';
import { GpsFixed as ObservationsIcon } from '@mui/icons-material';
import { useLayers } from '@context';

export const icon = <ObservationsIcon />;

export const title = 'Observations';

export const trayContents = () => {
  const { map, observations } = useLayers();

  // we emphasize the observation marker whose
  // corresponding card is hovered by giving it a `hovered`
  // class and leveraging css for the visual emphasis.
  const handleHoverObservationCard = useCallback(station_name => () => {
    const marker = document.querySelector(`.observation-marker.station-${station_name}`);
    if (!marker) {
      return;
    }
    marker.classList.add('hovered');
  }, [map]);

  // remove visual emphasis, i.e., the remove `hovered` class.
  const handleUnhoverObservationCard = useCallback(station_name => () => {
    const marker = document.querySelector(`.observation-marker.station-${station_name}`);
    if (!marker) {
      return;
    }
    marker.classList.remove('hovered');
  }, [map]);

  return (
    <Stack p={ 1 } gap={ 1 }>
      {
        observations.current.map((obs, index) => (
          <div key={ `obs-${ obs.station_name }`}>
            <Sheet
              variant="outlined"
              component="pre"
              sx={{
                height: '100px',
                overflowY: 'scroll',
                fontSize: '66%',
                p: 1,
              }}
              onMouseOver={ handleHoverObservationCard(obs.station_name) }
              onMouseLeave={ handleUnhoverObservationCard(obs.station_name) }
            >{ JSON.stringify(obs, null, 2) }</Sheet>
            <button onClick={ () => observations.remove(obs.station_name) }>delete</button>
            <button
              onClick={ () => observations.swap(index, index - 1) }
              disabled={ index === 0}
            >move up</button>
            <button
              onClick={ () => observations.swap(index, index + 1) }
              disabled={ index + 1 === observations.current.length }
            >move down</button>
            <button
              onClick={ () => observations.toggleVisibility(obs.station_name) }
            >{ observations.isVisible(obs.station_name) ? 'hide' : 'show' }</button>
          </div>
        ))
      }
      <div>visible observations</div>
      <pre>{JSON.stringify(observations.visible.map(obs => obs.station_name), null, 2)}</pre>
    </Stack>
  );
};
