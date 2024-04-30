import { App } from './app'
import { createRoot } from 'react-dom/client'
import { LayersProvider, PreferencesProvider } from '@context'
import './index.css'

const container = document.getElementById('root')
const root = createRoot(container)

const ProvisionedApp = () => (
  <PreferencesProvider>
    <LayersProvider>
      <App />
    </LayersProvider>
  </PreferencesProvider>
)

root.render(<ProvisionedApp />)
