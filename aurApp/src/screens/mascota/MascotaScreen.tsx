import { router, useLocalSearchParams } from 'expo-router';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { FormularioMascota } from '@/components/mascota/FormularioMascota';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { TEXTOS_MASCOTA as T } from '@/constants/constants';
import { useFormularioMascota } from '@/hooks/useFormularioMascota';

/** Nueva mascota (/mascota/nueva) o editar una (/mascota/12). */
export default function MascotaScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const f = useFormularioMascota(id ? Number(id) : null);
  const titulo = f.esEdicion ? T.tituloEditar : T.tituloNueva;

  if (f.noEncontrada) {
    return (
      <PantallaFormulario titulo={titulo}>
        <EstadoVacio icono="huella" titulo={T.noEncontrada} textoAccion={T.volver} onAccion={router.back} />
      </PantallaFormulario>
    );
  }

  return (
    <PantallaFormulario
      titulo={titulo}
      pie={<BotonPrincipal texto={T.guardar} textoCargando={T.guardando} cargando={f.guardando} onPress={f.guardar} />}>
      <FormularioMascota datos={f.datos} onCambiar={f.cambiar} errores={f.errores} />
      <MensajeFormulario tipo="error" texto={f.error} />
    </PantallaFormulario>
  );
}
