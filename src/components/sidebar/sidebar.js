import { Fragment, useCallback, useState } from 'react'
import {
  List,
  Sheet,
} from '@mui/joy'
import { Tray } from './tray'
import { MenuItem } from './menu-item'
import SidebarModules from './trays'

export const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(-1)

  const handleClickMenuItem = useCallback(newIndex => {
    // if the incoming new index equals the old index,
    // then the user wants to close the currently open tray.
    if (newIndex === activeIndex) {
      setActiveIndex(-1)
      return
    }
    // otherwise, open desired tray.
    setActiveIndex(newIndex)
  }, [activeIndex])

  return (
    <Fragment>
      <Sheet
        variant="soft"
        sx={{
          position: 'absolute',
          top: 0, left: 0,
          height: '100vh',
          zIndex: 999,
          maxWidth: '68px',
          overflow: 'hidden',
          p: 0,
          filter: activeIndex === -1 ? 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.2))' : 'drop-shadow(0 0 1px rgba(0, 0, 0, 0.2))',
          transition: 'max-width 250ms, filter 250ms',
        }}
      >
        <List>
            {
              Object.keys(SidebarModules).map((key, index) => {
                return (
                  <MenuItem
                    key={ `menu-item-${ key }` }
                    active={ index === activeIndex }
                    title={ SidebarModules[key].title }
                    Icon={ SidebarModules[key].icon }
                    onClick={ () => handleClickMenuItem(index) }
                  />
                )
              })
            }
        </List>
      </Sheet>
      {
        Object.keys(SidebarModules).map((key, index) => {
          return (
            <Tray
              key={ `tray-${ key }` }
              active={ activeIndex === index }
              title={ SidebarModules[key].title }
              contents={ SidebarModules[key].tray }
              closeHandler={ () => setActiveIndex(-1) }
            />
          )
        })
      }
    </Fragment>
  )
}
