import { useAuth } from '../../Auth/AuthContext';
import { DuenoScreen } from '../dueños/duenos';
import { VeterinarioScreen } from '../Veterinario/VeterinarioScreen';
import { SuperAdminScreen } from '../SuperAdmin/SuperAdminScreen';
import { HomeScreen } from '../Home/HomeScreen';

// Se muestra una vez que ya hay usuarioActual (post-login). Decide qué
// pantalla interna corresponde según el rol. Vive en Login/ porque es la
// continuación natural del flujo de autenticación, aunque el login en sí
// ya haya pasado.
export const LoginRol = () => {
  const { usuarioActual } = useAuth();

  switch (usuarioActual!.rol) {
    case 'dueno':
      return <DuenoScreen />;
    case 'veterinario':
      return <VeterinarioScreen />;
    case 'superadmin':
      return <SuperAdminScreen />;
    case 'centro':
      // TODO: todavía no existe pantalla para el rol "centro".
      return <HomeScreen />;
    default:
      return <HomeScreen />;
  }
};
