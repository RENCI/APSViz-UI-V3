import React, { createContext, useContext, useState } from "react";
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
  const [observations, setObservations] = useState([]);

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
    const newLayers = [...arrayUtils.swap(defaultModelLayers, i, j)];
    setDefaultModelLayers(newLayers);
  };

  const removeLayer = id => {
    const newLayers = [...arrayUtils.remove(defaultModelLayers, l => l.id === id)];
    setDefaultModelLayers(newLayers);
  };

  const swapObservations = (i, j) => {
    const newObservations = [...arrayUtils.swap(observations, i, j)];
    setDefaultModelLayers(newObservations);
  }
  
  const removeObservation = () => {}
  
  const toggleObservationVisibility = () => {}
  
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
        observations: {
          current: observations,
          swap: swapObservations,
          remove: removeObservation,
          toggleVisibility: toggleObservationVisibility,
        },
      }}
    >
      {children}
    </LayersContext.Provider>
  );
};

LayersProvider.propTypes = {
  children: PropTypes.node
};