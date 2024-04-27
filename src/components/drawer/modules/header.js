import {
  ListItem,
  ListItemDecorator,
  Typography,
} from '@mui/joy'
import { useLayout } from '@context'
import { DrawerToggler } from '../toggler'

export const DrawerHeader = () => {
  return (
    <ListItem sx={{ width: '300px' }}>
      <ListItemDecorator>
        <DrawerToggler />
      </ListItemDecorator>
      <Typography>It&apos;s a Drawer</Typography>
    </ListItem>
  )
}