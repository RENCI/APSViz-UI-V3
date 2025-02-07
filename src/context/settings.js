import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import PropTypes from "prop-types";
import { useColorScheme } from '@mui/joy/styles';
import {
  useLocalStorage,
  useToggleLocalStorage
} from '@hooks';

import { maxeleStyle, maxwvelStyle, swanStyle } from '@utils';

export const SettingsContext = createContext({});
export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  // used to track if settings need to be saved
  const [ changesMade, setChangesMade ] = useState(false);

  const { mode, setMode } = useColorScheme();

  const darkMode = useMemo(() => mode === 'dark', [mode]);
  const toggleDarkMode = useCallback(() => {
    setMode(darkMode ? 'light' : 'dark');
    setChangesMade(true);
  }, [mode]);

  const [storedMaxeleStyle, setStoredMaxeleStyle] = useLocalStorageChange('maxele', maxeleStyle);
  const [storedMaxwvelStyle, setStoredMaxwvelStyle] = useLocalStorageChange('maxwvel', maxwvelStyle);
  const [storedSwanStyle, setStoredSwanStyle] = useLocalStorageChange('swan', swanStyle);

  // opacity now handled at layer type level
  const [storedMaxeleOpacity, setStoredMaxeleOpacity] = useLocalStorageChange('maxele_opacity', 1.0);
  const [storedMaxwvelOpacity, setStoredMaxwvelOpacity] = useLocalStorageChange('maxwvel_opacity',1.0);
  const [storedSwanOpacity, setStoredSwanOpacity] = useLocalStorageChange('swan_opacity',1.0);

  // setting for the users UTC vs. Local time zone display
  const useUTC = useToggleLocalStorage('useUTC', false, useLocalStorageChange);

  // save the units type specified by user - imperial or metric (default)
  const [storedUnitsType, setStoredUnitsType] = useLocalStorageChange('unitsType','metric');

  // if unitsType is imperial, need to save wind speed unit - mph or knots
  // default for metric is meters/second (mps)
  const [storedSpeedType, setStoredSpeedType] = useLocalStorageChange('speedType','mps');

  /**
   * Custom hook that tracks setting changes
   *
   * @param name
   * @param newValue
   * @returns {(*)[]}
   */
  function useLocalStorageChange(name, newValue) {
    // create a localstorage state
    const [value, setValue] = useLocalStorage(name, newValue);

    /**
     * method to override state changes to local storage setting
     *
     * @param newValue
     */
    const setChangedState = (newValue) => {
      // if the value changed
      if (value !== newValue)
        // set the setting changed flag
        setChangesMade(true);

      // save the new value
      setValue(newValue);
    };

    // return the state variables
    return [value, setChangedState];
  }

  return (
    <SettingsContext.Provider value={{
      // used to track when changes are made to any setting
      changesMade, setChangesMade,

      // state storage for tracking the Time zone selection
      useUTC,

      darkMode: {
        enabled: darkMode,
        toggle: toggleDarkMode,
      },

      unitsType: {
        current: storedUnitsType,
        set: setStoredUnitsType,
      },
      speedType: {
        current: storedSpeedType,
        set: setStoredSpeedType,
      },

      mapStyle: {
        maxele: {
          current: storedMaxeleStyle,
          set: setStoredMaxeleStyle,
        },
        maxwvel: {
          current: storedMaxwvelStyle,
          set: setStoredMaxwvelStyle,
        },
        swan: {
          current: storedSwanStyle,
          set: setStoredSwanStyle,

        }
      },

      layerOpacity: {
        maxele: {
          current: storedMaxeleOpacity,
          set: setStoredMaxeleOpacity,
        },
        maxwvel: {
          current: storedMaxwvelOpacity,
          set: setStoredMaxwvelOpacity,
        },
        swan: {
          current: storedSwanOpacity,
          set: setStoredSwanOpacity,
        }
      },
    }}>
      { children }
    </SettingsContext.Provider>
  );
};


SettingsProvider.propTypes = {
  children: PropTypes.node
};