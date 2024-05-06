import React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import { LayersProvider, SettingsProvider } from '@context';
import './index.css';
import '@fontsource/inter';
import theme from './theme';

const container = document.getElementById('root');
const root = createRoot(container);

const ProvisionedApp = () => (
  <CssVarsProvider theme={ theme } defaultMode="system">
    <SettingsProvider>
      <LayersProvider>
        <App />
      </LayersProvider>
    </SettingsProvider>
  </CssVarsProvider>
);

root.render(<ProvisionedApp />);
