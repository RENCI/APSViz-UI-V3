import * as React from 'react';
import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button';
import Drawer from '@mui/joy/Drawer';

export const LayerMenu = () => {

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Box sx={{ position: 'relative', mt: 3, height: 320 }}>
      <Button variant="outlined" color="neutral" onClick={() => setIsOpen(true)}>
      </Button>
      <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
     </Drawer>
    </Box>
  )
}