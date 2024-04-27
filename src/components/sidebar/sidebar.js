import { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import {
  DialogContent,
  IconButton,
  List,
  ListItem,
  Tooltip,
  Sheet,
} from '@mui/joy'
import DrawerModules from './menu-items'

const MenuItem = ({ Icon, title, onClick, active }) => {
  return (
    <ListItem>
      <Tooltip
        title={ title }
        placement="right"
        arrow
      >
        <IconButton
          size="lg"
          color="primary"
          variant={ active ? 'solid' : 'soft' }
          onClick={ onClick }
        >
          <Icon />
        </IconButton>
      </Tooltip>
    </ListItem>
  )
}

MenuItem.propTypes = {
  active: PropTypes.bool.isRequired,
  Icon: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}


export const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(-1)

  const handleClickMenuItem = newIndex => {
    // if the incoming new index equals the old index,
    // then the user wants to close the currently open tray.
    if (newIndex === activeIndex) {
      setActiveIndex(-1)
      return
    }
    // otherwise, open desired tray.
    setActiveIndex(newIndex)
  }

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
              Object.keys(DrawerModules).map((key, index) => {
                return (
                  <MenuItem
                    key={ `menu-item-${ key }` }
                    active={ index === activeIndex }
                    title={ DrawerModules[key].title }
                    Icon={ DrawerModules[key].icon }
                    onClick={ () => handleClickMenuItem(index) }
                  />
                )
              })
            }
        </List>
      </Sheet>
      {
        Object.keys(DrawerModules).map((key, index) => {
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
                { DrawerModules[key].tray }
              </DialogContent>
            </Sheet>
          )
        })
      }
    </Fragment>
  )
}
