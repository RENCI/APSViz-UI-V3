import { Fragment, useState } from 'react'
import {
  DialogContent,
  DialogTitle,
  Drawer as MuiDrawer,
  IconButton,
  ModalClose,
  Sheet,
} from '@mui/joy'
import { Menu as MenuIcon } from '@mui/icons-material'

export const Drawer = () => {
  const [open, setOpen] = useState(true)

  const handleClickToggleDrawer = () => {
    setOpen(!open)
  }

  const DrawerToggler = () => (
    <IconButton
      sx={{
        position: 'absolute',
        left: '1.5rem',
        top: '1.5rem',
        zIndex: 999,
      }}
      color="primary"
      variant="soft"
      onClick={ () => setOpen(!open) }
    ><MenuIcon /></IconButton>
  )

  return (
    <Fragment>
      <DrawerToggler />
      <MuiDrawer
        open={ open }
        onClose={ () => setOpen(false) }
        variant="plain"
        hideBackdrop
        slotProps={{
          content: {
            sx: {
              bgcolor: 'transparent',
              p: { md: 3, sm: 0 },
              boxShadow: 'none',
            },
          },
        }}
        sx={{
          '.MuiSheet-root': {
            borderRadius: 'md',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            height: '100%',
            overflow: 'auto',
          }
        }}
      >
        <Sheet>
          <DialogTitle>Drawer</DialogTitle>
          <ModalClose />
          <DialogContent>
            Excepteur esse ad anim id consectetur voluptate proident elit sed eu nulla laboris adipisicing minim.
          </DialogContent>
        </Sheet>
      </MuiDrawer>
    </Fragment>
  )
}
