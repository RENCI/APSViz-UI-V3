import React, { createContext, useContext, useState } from "react";

export const LayersContext = createContext({});
export const useLayers = () => useContext(LayersContext);

export const LayersProvider = ({ children }) => {
    const [currentModelRunSet, setCurrentModelRunSet] = useState([]);

};

return (
    <LayersContext.Provider
      value={{
        currentModelRunSet,
        setCurrentModelRunSet
      }}
    >
      {children}
    </LayersContext.Provider>
  );