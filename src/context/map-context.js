import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

export const LayersContext = createContext({});
export const useLayers = () => useContext(LayersContext);

export const LayersProvider = ({ children }) => {
    const [defaultModelLayers, setDefaultModelLayers] = useState(["4545-2024041412-gfsforecast_maxele63",]);
    const [filteredModelLayers, setFilteredModelLayers] = useState([]);

return (
    <LayersContext.Provider
      value={{
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