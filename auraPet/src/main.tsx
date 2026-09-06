import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { SuperAdminScreen } from './SuperAdmin/SuperAdminScreen'
// import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <SuperAdminScreen/>
  </StrictMode>,
)
