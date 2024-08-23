import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

import {
  Tsunami as WaveHeightIcon,
  QueryStats as ObservationIcon,
  Air as WindVelocityIcon,
  Water as WaterLevelIcon,
  BlurOn as WaterSurfaceIcon,
  //SettingsTwoTone,
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

    /**
    * removes the observation "target" icons and dialogs from the map
    */
    const removeObservations = ( id ) => {
        // init the product name
        let product_name = '';

        // did we get a layer id
        if (id !== undefined) {
            const index = defaultModelLayers.findIndex(l => l.id === id);

            // find this item in the layer list
            if (index === -1) {
                console.error('Could not locate layer', id);

                // no need to continue
                return;
            }
            else
                // get the layers' product name
                product_name = defaultModelLayers[index]['properties']['product_name'];
        }
        else
            // no incoming id defaults to removing all selected observations
            product_name = 'Observations';

        // clear all observations if this is an observation layer
        if (product_name === 'Observations') {
            // remove all the targets on the map
            map.eachLayer((layer) => {
                // if this is an observation selection marker
                if (layer.options && layer.options.pane === "markerPane") {
                    // remove the layer
                    map.removeLayer(layer);
                }
            });

            // remove all the dialogs from the data list
            setSelectedObservations(selectedObservations.filter(item => item === undefined));
        }
    };

  const toggleHurricaneLayerVisibility = id => {
    const newLayers = [...hurricaneTrackLayers];
    const index = newLayers.findIndex(l => l.id === id);
    if (index === -1) {
      console.error('Could not locate layer', id);
      return;
    }
    const alteredLayer = newLayers[index];
    alteredLayer.state.visible = !alteredLayer.state.visible;
    setHurricaneTrackLayers([
      ...newLayers.slice(0, index),
      { ...alteredLayer },
      ...newLayers.slice(index + 1),
    ]);
  };

  const toggleLayerVisibility = id => {
    const newLayers = [...defaultModelLayers];
    const index = newLayers.findIndex(l => l.id === id);
    if (index === -1) {
      console.error('Could not locate layer', id);
      return;
    }

    // if this is an observation layer remove all observation layers/dialogs from the map
    removeObservations(id);

    const alteredLayer = newLayers[index];
    alteredLayer.state.visible = !alteredLayer.state.visible;
    setDefaultModelLayers([
      ...newLayers.slice(0, index),
      { ...alteredLayer },
      ...newLayers.slice(index + 1),
    ]);
  };

  const getAllLayersInvisible = () => {
    const currentLayers = [...defaultModelLayers];

    return currentLayers
      .map((layer) => {
        const opacity = layer.state.opacity;
        return {
          ...layer,
          state: {visible: false, opacity: opacity}
        };
      });
  };

  const getAllHurricaneLayersInvisible = () => {
    const currentLayers = [...hurricaneTrackLayers];
    const alteredLayers = currentLayers
      .map((layer) => {
        const opacity = layer.state.opacity;
        return {
          ...layer,
          state: {visible: false, opacity: opacity}
        };
      });
  
    return alteredLayers;
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

    // if this is a observation layer remove all observation layers/dialogs from the map
    removeObservations(id);
  };

  const removeModelRun = groupId => {
    const index = defaultModelLayers.findIndex(l => l.group === groupId);
    if (index === -1) {
      return;
    }
    const newLayers = defaultModelLayers.filter(l => l.group !== groupId);

    // now update the visible layer state for the top most model run
    [...newLayers].forEach((layer) => {
        // perform the visible state logic
        layer.state = newLayerDefaultState(layer, newLayers[0].group);
    });

    // remove all observations when there is a model run removal
    removeObservations();

    setDefaultModelLayers(newLayers);
  };

  const newLayerDefaultState = (layer, group) => {
    // if this is an obs layer and is the one just added
    if (layer.group === group &&
        (layer.properties['product_type'] === 'obs' || layer.properties['product_type'] === 'maxele63'))
        // make this layer visible
        return ({ visible: true, opacity: 1.0 });
    // remove layer visibility
    else
        // make this layer invisible
        return ({ visible: false, opacity: 1.0 });
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

  const [baseMap, setBaseMap] = React.useState();

  // used to track the view state of the share comment
  const [showShareComment, setShowShareComment] = useState(true);

  return (
    <LayersContext.Provider
      value={{
        map,
        setMap,
        defaultModelLayers,
        setDefaultModelLayers,
        hurricaneTrackLayers,
        setHurricaneTrackLayers,
        toggleHurricaneLayerVisibility,
        toggleLayerVisibility,
        getAllLayersInvisible,
        getAllHurricaneLayersInvisible,
        selectedObservations, setSelectedObservations,
        showShareComment, setShowShareComment,
        swapLayers,
        removeLayer,
        removeModelRun,
        removeObservations,
        layerTypes,
        baseMap,
        setBaseMap,
        setLayerOpacity
      }}
    >
      {children}
    </LayersContext.Provider>
  );
};

LayersProvider.propTypes = {
  children: PropTypes.node
};
