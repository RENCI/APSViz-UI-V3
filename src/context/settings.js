import React, {
  createContext,
  useCallback,
  useContext,
  useMemo
} from "react";

import PropTypes from "prop-types";
import { useColorScheme } from '@mui/joy/styles';
import {
  useLocalStorage,
  useToggleState,
} from '@hooks';

import { maxeleStyle, maxwvelStyle, swanStyle } from '@utils';

export const SettingsContext = createContext({});
export const useSettings = () => useContext(SettingsContext);

export const metersToFeet = (m) => {
  return m * 3.28084;
};

export const mpsToMph = (s) => {
  return s * 2.236936;
};

export const mpsToKnots = (s) => {
  return s *1.943844;
};

export const SettingsProvider = ({ children }) => {
  const { mode, setMode } = useColorScheme();
  const booleanValue = useToggleState();
  // to persist the value in the device's local
  // storage, use `useToggleLocalStorage` instead:
  //   const booleanValue = useToggleLocalStorage('boolean-value')
  const darkMode = useMemo(() => mode === 'dark', [mode]);
  const toggleDarkMode = useCallback(() => {
    setMode(darkMode ? 'light' : 'dark');
  }, [mode]);

  const [storedMaxeleStyle, setStoredMaxeleStyle] = useLocalStorage('maxele', maxeleStyle);
  const [storedMaxwvelStyle, setStoredMaxwvelStyle] = useLocalStorage('maxwvel', maxwvelStyle);
  const [storedSwanStyle, setStoredSwanStyle] = useLocalStorage('swan', swanStyle);

  // opacity now handled at layer type level
  const [storedMaxeleOpacity, setStoredMaxeleOpacity] = useLocalStorage('maxele_opacity', 1.0);
  const [storedMaxwvelOpacity, setStoredMaxwvelOpacity] = useLocalStorage('maxwvel_opacity',1.0);
  const [storedSwanOpacity, setStoredSwanOpacity] = useLocalStorage('swan_opacity',1.0);

  // save the units type specified by user - imperial or metric (default)
  const [storedUnitsType, setStoredUnitsType] = useLocalStorage('unitsType','metric');
  // if units type is imperial, need to save wind speed unit - mph or knots
  // default for metric is meters/second (mps)
  const [storedSpeedType, setStoredSpeedType] = useLocalStorage('speedType','mps');


  return (
    <SettingsContext.Provider value={{
      booleanValue,

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
      metersToFeet,
      mpsToMph,
      mpsToKnots,

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