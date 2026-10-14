import { useState } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { DuenoScreen } from '../dueños/duenos';
import { VeterinarioScreen } from '../Veterinario/VeterinarioScreen';
import { SuperAdminScreen } from '../SuperAdmin/SuperAdminScreen';
import { CentroAdminScreen } from '../CentroAdmin/CentroAdminScreen';
import { HomeScreen } from '../Home/HomeScreen';

// Se muestra una vez que ya hay usuarioActual (post-login). Decide qué
// pantalla interna corresponde según el rol. Vive en Login/ porque es la
// continuación natural del flujo de autenticación, aunque el login en sí
// ya haya pasado.
export const LoginRol = () => {
  const { usuarioActual } = useAuth();

  // Un veterinario que además es admin de un centro puede cambiar entre
  // "Mi agenda" y el panel del centro. null = su panel de veterinario.
  const [centroAdministrando, setCentroAdministrando] = useState<number | null>(null);

  switch (usuarioActual!.rol) {
    case 'dueno':
      return <DuenoScreen />;
    case 'veterinario':
      return centroAdministrando === null ? (
        <VeterinarioScreen onAdministrarCentro={setCentroAdministrando} />
      ) : (
        <CentroAdminScreen centroInicialId={centroAdministrando} onVolver={() => setCentroAdministrando(null)} />
      );
    case 'administrativo':
      // No tiene panel personal: entra directo al panel de su(s) centro(s)
      return <CentroAdminScreen />;
    case 'superadmin':
      return <SuperAdminScreen />;
    default:
      return <HomeScreen />;
  }
};
