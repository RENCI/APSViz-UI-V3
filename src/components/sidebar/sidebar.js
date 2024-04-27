import { Fragment, useCallback, useState } from 'react'
import {
  DialogContent,
  List,
  Sheet,
} from '@mui/joy'
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
          transition: 'max-width 250ms',
          p: 0,
          filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.2))',
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
            <Sheet
              key={ `tray-${ key }` }
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: activeIndex === index ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 250ms',
                height: '100vh',
                width: '300px',
                zIndex: 998,
                pl: '68px',
              }}
            >
              <DialogContent>
                { SidebarModules[key].tray }
              </DialogContent>
            </Sheet>
          )
        })
      }
    </Fragment>
  )
}
