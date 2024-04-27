import {
  Sheet,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/joy'
import { useLayout } from '@context'
import { DrawerToggler } from './toggler'

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
        maxWidth: drawer.isOpen ? '300px' : '70px',
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
    </Sheet>
  )
}
