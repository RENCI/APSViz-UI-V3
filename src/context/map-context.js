import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

export const LayersContext = createContext({});
export const useLayers = () => useContext(LayersContext);

export const LayersProvider = ({ children }) => {
    const [defaultModelLayers, setDefaultModelLayers] = useState([]);
    const [filteredModelLayers, setFilteredModelLayers] = useState([]);
    const [map, setMap] = useState(null);

  return (
    <LayersContext.Provider
      value={{
        map,
        setMap,
        defaultModelLayers,
        setDefaultModelLayers,
        filteredModelLayers,
        setFilteredModelLayers
      }}
    >
      {children}
    </LayersContext.Provider>
  );
};

LayersProvider.propTypes = {
  children: PropTypes.node
};