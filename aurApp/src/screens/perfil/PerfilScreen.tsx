import { router } from 'expo-router';

import { GrillaMascotas } from '@/components/perfil/GrillaMascotas';
import { PerfilCuenta } from '@/components/perfil/PerfilCuenta';
import { TituloSeccion } from '@/components/ui/TituloSeccion';
import { TEXTOS_PERFIL } from '@/constants/constants';
import { useDatosDueno } from '@/context/DatosDuenoContext';

/** Perfil del dueño: lo común de todas las cuentas + sus mascotas. */
export default function PerfilScreen() {
  const { mascotas } = useDatosDueno();

  return (
    <PerfilCuenta>
      <TituloSeccion texto={TEXTOS_PERFIL.misMascotas} />
      <GrillaMascotas
        mascotas={mascotas}
        onAbrir={(m) => router.push({ pathname: '/mascota/[id]', params: { id: m.id } })}
        onAgregar={() => router.push('/mascota/nueva')}
      />
    </PerfilCuenta>
  );
}
