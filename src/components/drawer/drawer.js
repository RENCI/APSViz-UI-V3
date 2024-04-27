import {
  Sheet,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemDecorator,
  Stack,
} from '@mui/joy'
import { useLayout } from '@context'
import { DrawerToggler } from './toggler'
import { DrawerHeader } from './modules'

export const Drawer = () => {
  const { drawer } = useLayout()

  return (
    <Sheet
      variant="soft"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 999,
        width: '300px',
        maxWidth: drawer.isOpen ? '300px' : '68px',
        overflow: 'hidden',
        transition: 'max-width 250ms',
        p: 0,
        filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.2))',
        '.MuiList-root': { p: 0, },
        '.MuiListItem-root': { p: 0, },
      }}
    >
      <List>
        <DrawerHeader />
      </List>
    </Sheet>
  )
}
