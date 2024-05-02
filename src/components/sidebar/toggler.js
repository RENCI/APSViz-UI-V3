import React from 'react';
import { IconButton } from '@mui/joy';
import {
  Menu as HamburgerIcon,
  Close as CloseMenuIcon,
} from '@mui/icons-material';
import { useLayout } from '@context';

export const DrawerToggler = () => {
  const { drawer } = useLayout();

  return (
    <IconButton
      sx={{ m: 2 }}
      color="primary"
      variant="soft"
      onClick={ drawer.toggle }
    >
      { drawer.isOpen ? <CloseMenuIcon /> : <HamburgerIcon /> }
  </IconButton>
  );
};
