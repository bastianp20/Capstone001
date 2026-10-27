import { router } from 'expo-router';

import { PerfilCuenta } from '@/components/perfil/PerfilCuenta';
import { FilaOpcion } from '@/components/ui/FilaOpcion';
import { TEXTOS_VETERINARIO as T } from '@/constants/constants';
import { useCentro } from '@/context/CentroContext';

/** Perfil del veterinario: lo común + derivaciones y, si administra un centro, el acceso a su panel. */
export default function PerfilVeterinarioScreen() {
  const { centros, cambiarModoCentro } = useCentro();

  return (
    <PerfilCuenta
      rolTexto={T.rol}
      opcionesExtra={
        <>
          {centros.length > 0 && (
            <FilaOpcion icono="centro" tono="durazno" texto={T.administrarCentro(centros[0].nombre)} onPress={() => cambiarModoCentro(true)} />
          )}
          <FilaOpcion icono="derivacion" tono="crema" texto={T.verDerivaciones} onPress={() => router.push('/veterinario/derivaciones')} />
        </>
      }
    />
  );
}
