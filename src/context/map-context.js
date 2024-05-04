import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

import {
  Tsunami as WaveHeightIcon,
  QueryStats as ObservationIcon,
  Air as WindVelocityIcon,
  Water as WaterLevelIcon,
  BlurOn as WaterSurfaceIcon,
} from '@mui/icons-material';

export const LayersContext = createContext({});
export const useLayers = () => useContext(LayersContext);

// convert the product type to a readable layer name
const layerTypes = {
  obs: {
    name: "Observations",
    icon: ObservationIcon,
  },
  maxwvel63: {
    name: "Maximum Wind Velocity",
    icon: WindVelocityIcon,
  },
  maxele63: {
    name: "Maximum Water Level",
    icon: WaterLevelIcon,
  },
  swan_HS_max63: {
    name: "Maximum Wave Height",
    icon: WaveHeightIcon,
  },
  maxele_level_downscaled_epsg4326: {
    name: "Hi-Res Maximum Water Level",
    icon: WaterLevelIcon,
  },
  hec_ras_water_surface: {
    name: "HEC/RAS Water Surface",
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
    // ensure our pair has i < j
    const [a, b] = [i, j].sort()
    // bail out for select (a, b) pairs.
    if (
      a === b || a < 0 || b < 0
      || defaultModelLayers.length - 2 < a
      || defaultModelLayers.length - 1 < b
    ) { return }
    
    const newLayers = [
      ...defaultModelLayers.slice(0, a),
      defaultModelLayers[b],
      ...defaultModelLayers.slice(a + 1, b),
      defaultModelLayers[a],
      ...defaultModelLayers.slice(b + 1),
    ];
    setDefaultModelLayers([...newLayers])
  };

  const removeLayer = id => {
    const index = defaultModelLayers.findIndex(l => l.id === id);
    if (index === -1) {
      return;
    }
    const thisPosition = defaultModelLayers[index].state.order;
    const newLayers = defaultModelLayers.reduce((acc, l) => {
      if (l.state.order === thisPosition) {
        return acc;
      }
      if (l.state.order > thisPosition) {
        l.state.order -= 1;
      }
      acc.push(l);
      return acc;
    }, []);

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
      }}
    >
      {children}
    </LayersContext.Provider>
  );
};

LayersProvider.propTypes = {
  children: PropTypes.node
};