import { router } from 'expo-router';

import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { PerfilCuenta } from '@/components/perfil/PerfilCuenta';
import { TarjetaAliadoSolidario } from '@/components/solidaria/TarjetaAliadoSolidario';
import { FilaOpcion } from '@/components/ui/FilaOpcion';
import { TEXTOS_ALIADO_SOLIDARIO, TEXTOS_VETERINARIO as T } from '@/constants/constants';
import { useCentro } from '@/context/CentroContext';
import { useAliadoSolidario } from '@/hooks/useAliadoSolidario';

/** Perfil del veterinario: "Aliado solidario", adopción solidaria, especialidades, derivaciones y, si administra un centro, su panel. */
export default function PerfilVeterinarioScreen() {
  const { centros, cambiarModoCentro } = useCentro();
  const aliado = useAliadoSolidario();

  return (
    <PerfilCuenta
      rolTexto={T.rol}
      opcionesExtra={
        <>
          {centros.length > 0 && (
            <FilaOpcion icono="centro" tono="durazno" texto={T.administrarCentro(centros[0].nombre)} onPress={() => cambiarModoCentro(true)} />
          )}
          <FilaOpcion
            icono="huella"
            tono="durazno"
            texto={T.adopcionSolidaria}
            valor={aliado.esperando > 0 ? TEXTOS_ALIADO_SOLIDARIO.esperando(aliado.esperando) : undefined}
            onPress={() => router.push('/veterinario/solidaria')}
          />
          <FilaOpcion icono="estetoscopio" tono="menta" texto={T.misEspecialidades} onPress={() => router.push('/veterinario/especialidades')} />
          <FilaOpcion icono="derivacion" tono="crema" texto={T.verDerivaciones} onPress={() => router.push('/veterinario/derivaciones')} />
        </>
      }>
      {aliado.listo && <TarjetaAliadoSolidario activo={aliado.activo} solidarias={aliado.solidarias} ocupado={aliado.ocupado} onCambiar={aliado.cambiar} />}
      <MensajeFormulario tipo="error" texto={aliado.error} />
    </PerfilCuenta>
  );
}
