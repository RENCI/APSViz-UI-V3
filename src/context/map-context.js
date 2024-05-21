import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

import {
  Tsunami as WaveHeightIcon,
  QueryStats as ObservationIcon,
  Air as WindVelocityIcon,
  Water as WaterLevelIcon,
  BlurOn as WaterSurfaceIcon,
} from '@mui/icons-material';

import arrayUtils from '@utils/array';

export const LayersContext = createContext({});
export const useLayers = () => useContext(LayersContext);

// convert the product type to a readable layer name
const layerTypes = {
  obs: {
    icon: ObservationIcon,
  },
  maxwvel63: {
    icon: WindVelocityIcon,
  },
  maxele63: {
    icon: WaterLevelIcon,
  },
  swan_HS_max63: {
    icon: WaveHeightIcon,
  },
  maxele_level_downscaled_epsg4326: {
    icon: WaterLevelIcon,
  },
  hec_ras_water_surface: {
    icon: WaterSurfaceIcon,
  },
};

export const LayersProvider = ({ children }) => {
  const [defaultModelLayers, setDefaultModelLayers] = useState([]);
  const [filteredModelLayers, setFilteredModelLayers] = useState([]);

  // this object contains data for graph rendering
  const [selectedObservations, setSelectedObservations] = useState([]);

  const [map, setMap] = useState(null);

  const toggleLayerVisibility = id => {
    const newLayers = [...defaultModelLayers];
    const index = newLayers.findIndex(l => l.id === id);
    if (index === -1) {
      console.error('Could not locate layer', id);
      return;
    }
    const alteredLayer = newLayers[index];
    alteredLayer.state.visible = !alteredLayer.state.visible;
    setDefaultModelLayers([
      ...newLayers.slice(0, index),
      { ...alteredLayer },
      ...newLayers.slice(index + 1),
    ]);
  };

  const swapLayers = (i, j) => {
    const newLayers = arrayUtils.swap(defaultModelLayers, i, j);
    setDefaultModelLayers(newLayers);
  };

  const removeLayer = id => {
    const newLayers = arrayUtils.remove(defaultModelLayers, l => l.id === id);
    setDefaultModelLayers(newLayers);
  };
  
  return (
    <LayersContext.Provider
      value={{
        map,
        setMap,
        defaultModelLayers,
        setDefaultModelLayers,
        filteredModelLayers,
        setFilteredModelLayers,
        toggleLayerVisibility,
        selectedObservations,
        setSelectedObservations,
        swapLayers,
        removeLayer,
        layerTypes,
        observations: useObservations(),
      }}
    >
      {children}
    </LayersContext.Provider>
  );
};

LayersProvider.propTypes = {
  children: PropTypes.node
};

const useObservations = () => {
  const [observations, setObservations] = useState([]);

  const addObservation = useCallback(obs => {
    const index = observations.findIndex(_obs => _obs.station_name === obs.station_name);
    if (index !== -1) { // we already have this observation; bail out.
      return;
    }
    setObservations(prevObservations => [
      ...prevObservations, // spread in existing observations
      { ...obs, visible: true }, // add new observation, make visible by defualt.
    ]);
  }, [observations]);

  const swapObservations = useCallback((i, j) => {
    const newObservations = arrayUtils.swap(observations, i, j);
    setObservations(newObservations);
  }, [observations]);
  
  const removeObservation = useCallback(station_name => {
    const newObservations = arrayUtils.remove(observations, l => l.station_name === station_name);
    setObservations(newObservations);
  }, [observations]);
  
  const toggleObservationVisibility = useCallback(station_name => {
    const index = observations.findIndex(obs => obs.station_name === station_name);
    if (index === -1) { // couldn't locate
      return;
    }
    const alteredObservation = observations[index];
    alteredObservation.visible = !alteredObservation.visible;
    const newObservations = [
      ...observations.slice(0, index),
      alteredObservation,
      ...observations.slice(index + 1),
    ];
    setObservations(newObservations);
  }, [observations]);

  const visibleObservations = useMemo(() => {
    return observations.filter(obs => obs.visible);
  }, [observations]);

  const observationIsVisible = useCallback(station_name => {
    const index = observations.findIndex(obs => obs.station_name === station_name);
    if (index === -1) { // couldn't locate
      return false;
    }
    return observations[index].visible;
  }, [visibleObservations]);

  // we emphasize the observation marker whose
  // corresponding card is hovered by giving it a `hovered`
  // class and leveraging css for the visual emphasis.
  const highlightObservation = station_name => {
    const marker = document.querySelector(`.observation-marker.station-${station_name}`);
    if (!marker) {
      return;
    }
    marker.classList.add('hovered');
  };

  const unhighlightObservation = station_name => {
    const marker = document.querySelector(`.observation-marker.station-${station_name}`);
    if (!marker) {
      return;
    }
    marker.classList.remove('hovered');
  };

  return {
    current: observations,
    visible: visibleObservations,
    add: addObservation,
    remove: removeObservation,
    swap: swapObservations,
    toggleVisibility: toggleObservationVisibility,
    isVisible: observationIsVisible,
    highlight: highlightObservation,
    unhighlight: unhighlightObservation,
  };
};
