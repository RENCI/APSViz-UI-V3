import {
  Card,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/joy'
import {
  Menu as HamburgerIcon,
  Close as CloseMenuIcon,
} from '@mui/icons-material'
import { useLayout } from '@context'

const DrawerToggler = () => {
  const { drawer } = useLayout()

  return (
    <IconButton
      sx={{ m: 2 }}
      color="primary"
      variant="soft"
      onClick={ drawer.toggle }
    >
      { drawer.isOpen ? <CloseMenuIcon /> : <HamburgerIcon /> }
  </IconButton>
  )
}

export const Drawer = () => {
  const { drawer } = useLayout()

  return (
    <Card
      variant="soft"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 999,
        maxWidth: drawer.isOpen ? '300px' : '70px',
        borderRadius: 0,
        overflow: 'hidden',
        transition: 'max-width 250ms',
        p: 0,
        filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.2))',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{ width: 'calc(300px)', border: '1px dashed crimson' }}
      >
        <DrawerToggler />
        <DialogTitle sx={{ flex: 1 }}>It&apos;s a Drawer</DialogTitle>
      </Stack>
      <DialogContent>
      </DialogContent>
    </Card>
  )
}
