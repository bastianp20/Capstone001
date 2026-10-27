import { router } from 'expo-router';

import { PerfilCuenta } from '@/components/perfil/PerfilCuenta';
import { FilaOpcion } from '@/components/ui/FilaOpcion';
import { TEXTOS_ELIMINACIONES, TEXTOS_SOLICITUDES_PLAN, TEXTOS_SUPERADMIN as T } from '@/constants/constants';

/** Perfil del superadmin: lo común + accesos a eliminaciones y cambios de plan. */
export default function PerfilSuperadminScreen() {
  return (
    <PerfilCuenta
      rolTexto={T.rol}
      opcionesExtra={
        <>
          <FilaOpcion icono="usuarioX" tono="durazno" texto={TEXTOS_ELIMINACIONES.titulo} onPress={() => router.push('/admin/eliminaciones')} />
          <FilaOpcion icono="plan" tono="crema" texto={TEXTOS_SOLICITUDES_PLAN.titulo} onPress={() => router.push('/admin/planes')} />
        </>
      }
    />
  );
}
