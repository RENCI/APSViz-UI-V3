import React, { createContext, useContext } from "react";
import PropTypes from "prop-types";
import {
  useToggleLocalStorage,
  useToggleState,
} from '@hooks'

export const SettingsContext = createContext({});
export const useSettings = () => useContext(SettingsContext)

export const SettingsProvider = ({ children }) => {
  const booleanValue = useToggleState()
  // to persist the value in the device's local
  // storage, use `useToggleLocalStorage` instead:
  //   const booleanValue = useToggleLocalStorage('boolean-value')

  return (
    <SettingsContext.Provider value={{ booleanValue }}>
      { children }
    </SettingsContext.Provider>
  )
}


SettingsProvider.propTypes = {
  children: PropTypes.node
};