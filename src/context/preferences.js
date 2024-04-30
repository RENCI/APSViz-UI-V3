import React, { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { useToggleState } from '@hooks'

export const PreferencesContext = createContext({});
export const usePreferences = () => useContext(PreferencesContext)

export const PreferencesProvider = ({ children }) => {
  const booleanValue = useToggleState()

  return (
    <PreferencesContext.Provider value={{ booleanValue }}>
      { children }
    </PreferencesContext.Provider>
  )
}


PreferencesProvider.propTypes = {
  children: PropTypes.node
};