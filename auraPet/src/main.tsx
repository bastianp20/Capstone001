import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DuenoScreen } from './screens/dueños/duenos'
// import { SuperAdminScreen } from './screens/SuperAdmin/SuperAdminScreen'
// import { VeterinarioScreen } from './screens/Veterinario/VeterinarioScreen'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  {/* <SuperAdminScreen/> */}
  <DuenoScreen/>
 {/* <VeterinarioScreen/> */}
  </StrictMode>,
)
