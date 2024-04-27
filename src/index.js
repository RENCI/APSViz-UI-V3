import { App } from './app'
import { createRoot } from 'react-dom/client'
import { LayersProvider } from '@context'
import './index.css'

const container = document.getElementById('root')
const root = createRoot(container)

const ProvisionedApp = () => (
  <LayersProvider>
    <App />
  </LayersProvider>
)

root.render(<ProvisionedApp />)
