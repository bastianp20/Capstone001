import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { TEXTOS_VETERINARIO as T } from '@/constants/constants';
import type { AccionesCitaVeterinarioProps } from '@/interfaces';

/** Botones según el estado: pendiente → confirmar/rechazar; confirmada → iniciar; en curso → terminar. */
export function AccionesCitaVeterinario({ cita, ocupado, onConfirmar, onRechazar, onIniciar, onTerminar }: AccionesCitaVeterinarioProps) {
  switch (cita.estado) {
    case 'pendiente':
      return (
        <>
          <BotonPequeno texto={T.rechazar} variante="peligro" onPress={() => onRechazar(cita)} deshabilitado={ocupado} />
          <BotonPequeno texto={T.confirmar} variante="primario" cargando={ocupado} onPress={() => onConfirmar(cita)} />
        </>
      );
    case 'confirmada':
      return <BotonPequeno texto={T.iniciarAtencion} icono="iniciar" variante="primario" cargando={ocupado} onPress={() => onIniciar(cita)} />;
    case 'en_curso':
      return <BotonPequeno texto={T.terminarAtencion} icono="completar" variante="primario" cargando={ocupado} onPress={() => onTerminar(cita)} />;
    default:
      return null;
  }
}
