// Lo que la app pone alrededor de las pantallas (ver main.tsx), para usarlo en las pruebas.
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from '../Auth/AuthContext'
import { ConfirmacionProvider } from '../components/confirmacion/ConfirmacionProvider'

// Igual que en la app: la pantalla se dibuja recién cuando se sabe quién inició sesión.
export const EsperarSesion = ({ children }: { children: ReactNode }) => (useAuth().cargando ? null : children)

export const Proveedores = ({ children, ruta = '/' }: { children: ReactNode; ruta?: string }) => (
  <MemoryRouter initialEntries={[ruta]}>
    <AuthProvider>
      <ConfirmacionProvider>{children}</ConfirmacionProvider>
    </AuthProvider>
  </MemoryRouter>
)
