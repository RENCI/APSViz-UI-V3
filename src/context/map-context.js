import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

import {
  Tsunami as WaveHeightIcon,
  QueryStats as ObservationIcon,
  Air as WindVelocityIcon,
  Water as WaterLevelIcon,
  BlurOn as WaterSurfaceIcon,
  Waves as HIResMaxElevationIcon,
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
    icon: HIResMaxElevationIcon,
  },
  hec_ras_water_surface: {
    icon: WaterSurfaceIcon,
  },
  maxinundepth63: {
    icon: FloodIcon,
  },
};

export const LayersProvider = ({ children }) => {
  // default and hurricane layer states
  const [defaultModelLayers, setDefaultModelLayers] = useState([]);
  const [hurricaneTrackLayers, setHurricaneTrackLayers] = useState([]);

  // this object contains data for graph rendering
  const [selectedObservations, setSelectedObservations] = useState([]);

  // map reference state
  const [map, setMap] = useState(null);

  // base map state
  const [baseMap, setBaseMap] = useState();

  // used to track the view state of the share comment
  const [showShareComment, setShowShareComment] = useState(true);

  // used to show alerts
  const  [alertMsg, setAlertMsg] = useState(null);

  // state to capture the default startup instance name
  const [defaultInstanceName, setDefaultInstanceName] = useState(null);

  // state to keep track of the obs dialog that has focus
  const [topMostDialogIndex, setTopMostDialogIndex] = useState(0);

  // flag to indicate to view dates/times in local or UTC mode
  const [useUTC, setUseUTC] = useState(true);

  /**
   * this section is for the side-by-side compare mode items
   * @type {string}
   */
  // default for the pane compare name
  const defaultSelected = 'Not Selected';

  // create some state for the left/right name/type selections
  const [leftPaneType, setLeftPaneType] = useState(defaultSelected);
  const [rightPaneType, setRightPaneType] = useState(defaultSelected);

  // create some state for the left/right ID selections
  const [leftPaneID, setLeftPaneID] = useState(defaultSelected);
  const [rightPaneID, setRightPaneID] = useState(defaultSelected);

  // create some state for the side/side layers
  const [sideBySideLayers, setSideBySideLayers] = useState(null);

  // create some state for the layer properties
  const [leftLayerProps, setLeftLayerProps] = useState(null);
  const [rightLayerProps, setRightLayerProps] = useState(null);

  // create some state for the selected layers
  const [selectedLeftLayer, setSelectedLeftLayer] = useState(null);
  const [selectedRightLayer, setSelectedRightLayer] = useState(null);

  /**
   * get the layer icon
   *
   * @param productType
   * @returns React.ReactElement
   */
  const getLayerIcon = ( productType )=> {
      // grab the icon
      const Icon = layerTypes[productType].icon;

      // return the icon
      return <Icon/>;
  };

  /**
   * removes the side by side compare layers
   *
   */
  const removeSideBySideLayers = () => {
      // remove the current compare layers if they exist
      if (sideBySideLayers) {
          // remove the layers on each pane
          map.removeLayer(sideBySideLayers['_leftLayer']);
          map.removeLayer(sideBySideLayers['_rightLayer']);

          // remove the side by side layer
          sideBySideLayers.remove();

          // reset the compared layers
          setSideBySideLayers(null);
      }
  };

  /**
   * clears any captured compare selection data and layers
   *
   */
  const resetCompare = () => {
      // clear the left layer type/ID/properties/layer
      setLeftPaneType(defaultSelected);
      setLeftPaneID(defaultSelected);
      setLeftLayerProps(null);
      setSelectedLeftLayer(null);

      // clear the right pane ID/Name/properties/layer
      setRightPaneType(defaultSelected);
      setRightPaneID(defaultSelected);
      setRightLayerProps(null);
      setSelectedRightLayer(null);

      // remove the side by side layers
      removeSideBySideLayers();
    };

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

    // remove all observation layers/dialogs from the map if this is an observation layer
    removeObservations(id);

    const alteredLayer = newLayers[index];
    alteredLayer.state.visible = !alteredLayer.state.visible;
    setDefaultModelLayers([
      ...newLayers.slice(0, index),
      { ...alteredLayer },
      ...newLayers.slice(index + 1),
    ]);
  };

  const toggleLayerVisibility2 = id => {
    const newLayers = [...defaultModelLayers];
    const index = newLayers.findIndex(l => l.id === id);
    if (index === -1) {
      console.error('Could not locate layer', id);
      return;
    }

    // remove all observation dialogs from the map on a change
    removeObservations(id);

    const alteredLayer = newLayers[index];
    alteredLayer.state.visible = !alteredLayer.state.visible;

    // if we are toggle a raster layer, turn off the other raster layers
    // if this is an observation layer, just leave the raster layers alone
    let invisibleLayers = getAllRasterLayersInvisible();
    if (alteredLayer.properties.product_type === "obs") {
      invisibleLayers = [...newLayers];
    }
    setDefaultModelLayers([
      ...invisibleLayers.slice(0, index),
      { ...alteredLayer },
      ...invisibleLayers.slice(index + 1),
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
    return currentLayers
      .map((layer) => {
        const opacity = layer.state.opacity;
        return {
          ...layer,
          state: {visible: false, opacity: opacity}
        };
      });

  };

  // get ADCIRC raster layers as invisible
  const getAllRasterLayersInvisible = () => {
    const currentLayers = [...defaultModelLayers];
    return currentLayers
      .map((layer) => {
        const opacity = layer.state.opacity;
        if (layer.properties.product_type !== "obs") {
              return {
                ...layer,
                state: {visible: false, opacity: opacity}
              };
        }
        else {
          return {
            ...layer
          };
        }
      });
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

    // remove all observation dialogs from the map on a change
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

    // remove all observation dialogs from the map on a change
    removeObservations();

    setDefaultModelLayers(newLayers);
  };

  /**
   * removes all selected model run
   */
  const removeAllModelRuns = () => {

    // remove all observation dialogs from the map on a change
    removeObservations();

    // reset the default layers array
    setDefaultModelLayers([]);
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

  return (
    <LayersContext.Provider
      value={{
        map, setMap,
        baseMap, setBaseMap,

        defaultInstanceName, setDefaultInstanceName,

        defaultModelLayers, setDefaultModelLayers,
        hurricaneTrackLayers, setHurricaneTrackLayers,
        selectedObservations, setSelectedObservations,
        showShareComment, setShowShareComment,
        layerTypes,
        alertMsg, setAlertMsg,

        toggleHurricaneLayerVisibility, toggleLayerVisibility, toggleLayerVisibility2,
        getAllLayersInvisible, getAllHurricaneLayersInvisible, getAllRasterLayersInvisible,
        swapLayers, removeLayer, removeModelRun, removeAllModelRuns, removeObservations,
        getLayerIcon, setLayerOpacity,

        // declare access to the compare mode items
        defaultSelected,
        leftPaneID, setLeftPaneID,
        rightPaneID, setRightPaneID,
        leftPaneType, setLeftPaneType,
        rightPaneType, setRightPaneType,
        leftLayerProps, setLeftLayerProps,
        selectedLeftLayer, setSelectedLeftLayer,
        rightLayerProps, setRightLayerProps,
        selectedRightLayer, setSelectedRightLayer,
        sideBySideLayers, setSideBySideLayers,
        resetCompare, removeSideBySideLayers,

        // flag to indicate how to display date/times
        useUTC, setUseUTC,

        // tracks the dialog that has focus
        topMostDialogIndex, setTopMostDialogIndex
      }}
    >
      {children}
    </LayersContext.Provider>
  );
};

LayersProvider.propTypes = {
  children: PropTypes.node
};
