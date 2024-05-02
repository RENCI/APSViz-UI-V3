import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

export const LayersContext = createContext({});
export const useLayers = () => useContext(LayersContext);

export const LayersProvider = ({ children }) => {
  const [defaultModelLayers, setDefaultModelLayers] = useState([]);
  const [filteredModelLayers, setFilteredModelLayers] = useState([]);
  const [map, setMap] = useState(null);

  const toggleLayerVisibility = id => {
    const newLayers = [...defaultModelLayers];
    const index = newLayers.findIndex(l => l.id === id);
    if (index === -1) {
      new Error('Could not locate layer', id);
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
      }}
    >
      {children}
    </LayersContext.Provider>
  );
};

LayersProvider.propTypes = {
  children: PropTypes.node
};