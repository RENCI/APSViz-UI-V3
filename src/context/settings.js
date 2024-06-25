import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";

import PropTypes from "prop-types";
import { useColorScheme } from '@mui/joy/styles';
import {
  // useToggleLocalStorage,
  useToggleState,
} from '@hooks';

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

  // used to capture the selected observation chart min/max Y-axis
  const [obsChartY, setObsChartY] = useState([-2, 2]);

  return (
    <SettingsContext.Provider value={{
      booleanValue,

      darkMode: {
        enabled: darkMode,
        toggle: toggleDarkMode,
      },
      obsChartY, setObsChartY,
    }}>
      { children }
    </SettingsContext.Provider>
  );
};


SettingsProvider.propTypes = {
  children: PropTypes.node
};