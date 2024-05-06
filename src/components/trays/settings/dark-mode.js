import React from 'react';
import { IconButton, Stack, Typography } from '@mui/joy';
import {
  DarkMode as OnIcon,
  LightMode as OffIcon,
} from '@mui/icons-material';
import { useSettings } from '@context';

export const DarkModeToggle = () => {
  const { darkMode } = useSettings();
  
  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      gap={ 2 }
    >
      <Toggler />
      <div>
        <Typography level="title-md">
          Dark Mode
        </Typography>
        <Typography level="body-md" variant="soft" color="primary">
          { darkMode.enabled ? 'Enabled' : 'Disabled' }
        </Typography>
      </div>
    </Stack>
  );
};

export const Toggler = () => {
  const { darkMode } = useSettings();

  return (
    <IconButton
      id="boolean-value-toggler"
      size="lg"
      onClick={ darkMode.toggle }
      variant="outlined"
    >
      {
        darkMode.enabled
          ? <OnIcon color="primary" />
          : <OffIcon color="neutral" />
      }
    </IconButton>
  );
};
