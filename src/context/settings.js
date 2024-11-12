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
  useToggleLocalStorage
} from '@hooks';

import { maxeleStyle, maxwvelStyle, swanStyle } from '@utils';

export const SettingsContext = createContext({});
export const useSettings = () => useContext(SettingsContext);

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

  // setting for the users UTC vs. Local time zone display
  const useUTC = useToggleLocalStorage('useUTC', true);

  return (
    <SettingsContext.Provider value={{
      booleanValue,

      useUTC,

      darkMode: {
        enabled: darkMode,
        toggle: toggleDarkMode,
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