import React, { useEffect, Fragment} from 'react';
import { useLayers } from '@context';
import { HurricaneTrackGeoJson } from './hurricane-track';

const newLayerDefaultState = () => {
    return ({
        visible: true,
        opacity: 1.0,
    });
  };

export const StormLayers = () => {

  const {
    defaultModelLayers,
    hurricaneTrackLayers,
    setHurricaneTrackLayers,
    getAllHurricaneLayersInvisible,
  } = useLayers();

  const layer_list = [...defaultModelLayers];
  const topLayer = layer_list[0];
  const hurrLayers = [...hurricaneTrackLayers];

  // compare the hurricane layers list to the default layers list and
  // remove any hurricane layers that are related to model run layers
  // that have been removed
  const removeAnyOrphanHurricaneLayers = () => {

    hurrLayers.map((hurrLayer) => {
      if (! layer_list.some(layer => layer.id.substr(0, layer.id.lastIndexOf("-")) + '-hurr' === hurrLayer.id)) {
        const newHurricaneTrackLayers = hurrLayers.filter((layerToRemove) => layerToRemove.id !== hurrLayer.id);
        setHurricaneTrackLayers(newHurricaneTrackLayers);
      }
    });
    // also check to see if indeed there is anything left in layer_list
    // if not remove all hurricane layers
    if (layer_list.length === 0) {
      setHurricaneTrackLayers([]);
    }
  };

  // set visibility to false for all hurricane layers
  const setHurricaneLayersVisibilityOff = () => {
    const allHurrLayers = hurrLayers.map((x) => x);
    if (allHurrLayers && allHurrLayers.length > 0) {
      allHurrLayers.forEach(layer => {
        layer.state = { visible: false, opacity: 1, };
      });
      setHurricaneTrackLayers([...allHurrLayers]);
    }
  };


  useEffect(() => {

    async function getStormLayers() {
      // create id for new hurricane layer
      if (topLayer && topLayer.properties.met_class === 'tropical') {
        const id = topLayer.id.substr(0, topLayer.id.lastIndexOf("-")) + '-hurr';

        // first check to make sure this layer doesn't already exist
        //if (hurricaneTrackLayers.some(layer => layer.id === id)) {
        const layerToMove = hurrLayers.find(layer => layer.id === id);
        if (layerToMove) {
          // move this hurricane layer to the top
          // get the rest of the layers
          const restOfLayers = hurrLayers.filter(layer => layer.id !== id);

          // set visibility on for the layer moving to the top
          layerToMove.state = newLayerDefaultState();

          // set all the rest, if any, to invisible
          // if no restOfLayers, don't actually have to move this one
          if (restOfLayers && restOfLayers.length > 0) {
            restOfLayers.forEach(layer => {
              layer.state = { visible: false, opacity: 1, };
            });
            setHurricaneTrackLayers([layerToMove, ...restOfLayers]);
          }
        } else {
          // get year, storm number, and advisory for this storm
          const year = topLayer.properties.run_date.substring(0, 4);
          let stormNumber = topLayer.properties.storm_number;

          // storm number can sometimes start with "al" so must remove if so
          if (stormNumber && stormNumber.length > 3)
            stormNumber = stormNumber.slice(2);

          const advisory = topLayer.properties.advisory_number;
          const stormName = topLayer.properties.storm_name;

          const trackLayer = [{
            id: id,
            stormName: stormName,
            stormNumber: stormNumber,
            runDate: topLayer.properties.run_date,
            year: year,
            advisory: advisory,
            instanceName: topLayer.properties.instance_name,
            eventType: topLayer.properties.event_type,
            state: newLayerDefaultState()
          }];
          const currentLayers = getAllHurricaneLayersInvisible();

          setHurricaneTrackLayers([...trackLayer, ...currentLayers]);
        }
      }
      else {
        // this is not a hurricane layer - turn off all hurricane layers, if any
        setHurricaneLayersVisibilityOff();
      }
      // remove any hurricane layers that do not have an associated model run
      removeAnyOrphanHurricaneLayers();
    }

    getStormLayers().then();
  }, [defaultModelLayers]);

  return(
    <>
      {hurrLayers
          .filter(({state}) => state.visible)
          .map((layer, index) => {
            return (
              <Fragment key={`${index}-${layer.id}`}>
                <HurricaneTrackGeoJson
                    key={Math.random() + index}
                    index={index}
                />
              </Fragment>
            );
          })
      };
    </>
  );

};