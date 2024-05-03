import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

export const LayersContext = createContext({});
export const useLayers = () => useContext(LayersContext);

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
    const ithLayerIndex = defaultModelLayers
      .findIndex(({ state }) => state.order === i);
    const jthLayerIndex = defaultModelLayers
      .findIndex(({ state }) => state.order === j);
    if (ithLayerIndex === -1 || jthLayerIndex === -1) {
      return defaultModelLayers;
    }
    const newLayers = [...defaultModelLayers]  ;
    newLayers[ithLayerIndex].state.order = j;
    newLayers[jthLayerIndex].state.order = i;
    setDefaultModelLayers(newLayers);
  };

  const removeLayer = id => {
    const index = defaultModelLayers.findIndex(l => l.id === id)
    if (index === -1) {
      return
    }
    const thisPosition = defaultModelLayers[index].state.order
    const newLayers = [...defaultModelLayers.slice(0, index), ...defaultModelLayers.slice(index + 1)]
      .map(l => {
        if (l.state.order > thisPosition) {
          l.state.order -= 1;
        }
        return l
      });

    setDefaultModelLayers(newLayers)
    /* todo: update `layer.state.order`s
    layer.state.order - 1 for all layers l with l.state.order > this layer's state.order
    */
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
        removeLayer
      }}
    >
      {children}
    </LayersContext.Provider>
  );
};

LayersProvider.propTypes = {
  children: PropTypes.node
};