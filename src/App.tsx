import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@astryxdesign/theme-neutral'

import VelvetApp from './velvet-os-components'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VelvetApp />
  </StrictMode>,
)