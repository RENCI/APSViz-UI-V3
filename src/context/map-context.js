import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

import {
  Tsunami as WaveHeightIcon,
  QueryStats as ObservationIcon,
  Air as WindVelocityIcon,
  Water as WaterLevelIcon,
  BlurOn as WaterSurfaceIcon,
  Flood as FloodIcon,
} from '@mui/icons-material';

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
  maxinundepth63: {
    icon: FloodIcon,
  },
};


export const LayersProvider = ({ children }) => {
  const [defaultModelLayers, setDefaultModelLayers] = useState([]);
  const [hurricaneTrackLayers, setHurricaneTrackLayers] = useState([]);

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

  const makeAllRasterLayersInvisible = () => {
    const newLayers = [];
    const currentLayers = [...defaultModelLayers];
    currentLayers.forEach((layer, idx) => {
        const alteredLayer = currentLayers[idx];
        alteredLayer.state.visible = false;
        newLayers.push(alteredLayer);
    });
    setDefaultModelLayers([...newLayers]);
  };

  const swapLayers = (i, j) => {
    // ensure our pair has i < j
    const [a, b] = [i, j].sort();
    // bail out for select (a, b) pairs.
    if (
      a === b || a < 0 || b < 1
      || defaultModelLayers.length - 2 < a
      || defaultModelLayers.length - 1 < b
    ) { return; }

    const newLayers = [...defaultModelLayers];
    const temp = newLayers[i];
    newLayers[i] = newLayers[j];
    newLayers[j] = temp;
    setDefaultModelLayers(newLayers);
  };

  const removeLayer = id => {
    const index = defaultModelLayers.findIndex(l => l.id === id);
    if (index === -1) {
      return;
    }
    const newLayers = defaultModelLayers.filter(l => l.id !== id);
    setDefaultModelLayers(newLayers);
  };

  const setLayerOpacity = (id, newOpacity) => {
    const newLayers = [...defaultModelLayers];
    const index = newLayers.findIndex(l => l.id === id);
    if (index === -1) {
      return;
    }
    newLayers[index].state.opacity = newOpacity;
    setDefaultModelLayers([...newLayers]);
  };


  return (
    <LayersContext.Provider
      value={{
        map,
        setMap,
        defaultModelLayers,
        setDefaultModelLayers,
        hurricaneTrackLayers,
        setHurricaneTrackLayers,
        toggleLayerVisibility,
        selectedObservations,
        setSelectedObservations,
        swapLayers,
        removeLayer,
        layerTypes,
        makeAllRasterLayersInvisible,
        setLayerOpacity,
      }}
    >
      {children}
    </LayersContext.Provider>
  );
};

LayersProvider.propTypes = {
  children: PropTypes.node
};