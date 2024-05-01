import React from 'react'
import { App } from './app'
import { createRoot } from 'react-dom/client'
import { LayersProvider, SettingsProvider } from '@context'
import './index.css'

const container = document.getElementById('root');
const root = createRoot(container);

const ProvisionedApp = () => (
  <SettingsProvider>
    <LayersProvider>
      <App />
    </LayersProvider>
  </SettingsProvider>
)

root.render(<ProvisionedApp />)
