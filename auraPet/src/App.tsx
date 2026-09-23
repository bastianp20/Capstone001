import { useAuth } from './Auth/AuthContext';
import { LoginScreen } from './screens/Login/LoginScreen';
import { DuenoScreen } from './screens/dueños/duenos';
import { VeterinarioScreen } from './screens/Veterinario/VeterinarioScreen';
import { SuperAdminScreen } from './screens/SuperAdmin/SuperAdminScreen';

// Sin router todavía: esta es la única pieza que decide qué pantalla
// se muestra, según el usuario logueado (o ninguna -> LoginScreen).
export const App = () => {
  const { usuarioActual } = useAuth();

  if (!usuarioActual) return <LoginScreen />;

  switch (usuarioActual.rol) {
    case 'dueno':
      return <DuenoScreen />;
    case 'veterinario':
      return <VeterinarioScreen />;
    case 'superadmin':
      return <SuperAdminScreen />;
    case 'centro':
      // TODO: todavía no existe pantalla para el rol "centro".
      return <LoginScreen />;
    default:
      return <LoginScreen />;
  }
};
