import { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'

export const LayoutContext = createContext({})
export const useLayout = () => useContext(LayoutContext)

export const LayoutProvider = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(true)
  const openDrawer = () => setDrawerOpen(true)
  const closeDrawer = () => setDrawerOpen(false)
  const toggleDrawer = () => setDrawerOpen(!drawerOpen)

  return (
    <LayoutContext.Provider
      value={{
        drawer: {
          isOpen: drawerOpen,
          open: openDrawer,
          close: closeDrawer,
          toggle: toggleDrawer,
        },
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

LayoutProvider.propTypes = {
  children: PropTypes.node,
}