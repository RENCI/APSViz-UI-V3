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
          backgroundColor: activeIndex === -1 ? '#f0f4f899' : '#f0f4f8',
          // a drop shadow looks nice. we'll remove it if a tray is open,
          // as they should appear on the same plane.
          filter: activeIndex === -1 ? 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.2))' : 'drop-shadow(1px 0 0 rgba(0, 0, 0, 0.2))',
          // similarly, here.
          '&:hover': {
            backgroundColor: '#f0f4f8',
            transition: 'max-width 250ms, filter 250ms, background-color 150ms',
          },
          // we'll add a delay to this exit animation to give ample time
          // for the disappearing tray get out of they view before going translucent.
          // otherwise we see it sliding behind the sidebar
          // this is also nice for accidental mouse leaves. we'll also fade slower than we un-fade.
          transition: 'max-width 250ms, filter 250ms, background-color 1000ms 500ms',
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
              Contents={ SidebarModules[key].trayContents }
              closeHandler={ () => setActiveIndex(-1) }
            />
          )
        })
      }
    </Fragment>
  )
}
