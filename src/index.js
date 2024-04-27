import { App } from './app'
import { createRoot } from 'react-dom/client'
import { LayersProvider, LayoutProvider } from '@context'
import './index.css'

const container = document.getElementById('root')
const root = createRoot(container)

const ProvisionedApp = () => (
  <LayoutProvider>
    <LayersProvider>
      <App />
    </LayersProvider>
  </LayoutProvider>
)

root.render(<ProvisionedApp />)
