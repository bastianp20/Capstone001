import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { TEXTOS_VETERINARIO as T } from '@/constants/constants';
import type { AccionesCitaVeterinarioProps } from '@/interfaces';

/** Botones según el estado: pendiente → confirmar/rechazar; confirmada → modificar/iniciar; en curso → abrir la atención. */
export function AccionesCitaVeterinario({ cita, ocupado, onConfirmar, onRechazar, onIniciar, onAbrirAtencion, onModificar }: AccionesCitaVeterinarioProps) {
  switch (cita.estado) {
    case 'pendiente':
      return (
        <>
          <BotonPequeno texto={T.rechazar} variante="peligro" onPress={() => onRechazar(cita)} deshabilitado={ocupado} />
          <BotonPequeno texto={T.confirmar} variante="primario" cargando={ocupado} onPress={() => onConfirmar(cita)} />
        </>
      );
    case 'confirmada':
      return (
        <>
          {onModificar && <BotonPequeno texto={T.modificar} icono="editar" onPress={onModificar} deshabilitado={ocupado} />}
          <BotonPequeno texto={T.iniciarAtencion} icono="iniciar" variante="primario" cargando={ocupado} onPress={() => onIniciar(cita)} />
        </>
      );
    case 'en_curso':
      return <BotonPequeno texto={T.abrirAtencion} icono="ficha" variante="primario" onPress={() => onAbrirAtencion(cita)} />;
    default:
      return null;
  }
}
