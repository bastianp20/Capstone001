import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { SuperAdminScreen } from './screens/SuperAdmin/SuperAdminScreen'
import { VeterinarioScreen } from './screens/Veterinario/VeterinarioScreen'
// import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    {/* <SuperAdminScreen/> */}

 <VeterinarioScreen/>
  </StrictMode>,
)
