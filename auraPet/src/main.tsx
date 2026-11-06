import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './Auth/AuthContext'
import { App } from './App'
import { ConfirmacionProvider } from './components/confirmacion/ConfirmacionProvider'
import { BrowserRouter } from 'react-router-dom'
import './css/theme.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ConfirmacionProvider>
          <App />
        </ConfirmacionProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
