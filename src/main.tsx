import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react'
import VelvetApp from './velvet-os-components'
import '@astryxdesign/theme-neutral';
import '@astryxdesign/core/astryx.css'
import '@astryxdesign/core/reset.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VelvetApp />
  </StrictMode>,
)