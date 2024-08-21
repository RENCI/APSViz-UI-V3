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

  return (
    <SettingsContext.Provider value={{
      booleanValue,

      darkMode: {
        enabled: darkMode,
        toggle: toggleDarkMode,
      },

      mapStyle: {
        storedMaxeleStyle,
        storedMaxwvelStyle,
        storedSwanStyle,
      },
    }}>
      { children }
    </SettingsContext.Provider>
  );
};


SettingsProvider.propTypes = {
  children: PropTypes.node
};