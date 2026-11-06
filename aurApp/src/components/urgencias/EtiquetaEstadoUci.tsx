import { Etiqueta } from '@/components/ui/Etiqueta';
import { ESTADOS_UCI, TEXTOS_URGENCIAS as T } from '@/constants/constants';
import { useColores } from '@/context/TemaContext';
import type { EtiquetaEstadoUciProps } from '@/interfaces';
import { estadoUciVigente, haceCuanto } from '@/lib/estadoUci';


/** "UCI: Disponible · hace 10 min", o "Sin información reciente" si nadie la actualiza hace horas. */
export function EtiquetaEstadoUci({ estado, ahora }: EtiquetaEstadoUciProps) {
  const COLORES = useColores();
  const sinInfo = COLORES.estados.completada;
  if (!estadoUciVigente(estado.actualizadoEn, ahora)) {
    return <Etiqueta texto={`${T.uci}: ${T.sinInfoReciente}`} colorFondo={sinInfo.fondo} colorTexto={sinInfo.texto} />;
  }
  const o = ESTADOS_UCI.find((x) => x.valor === estado.estado);
  const tono = o ? COLORES.estados[o.tono] : sinInfo;
  return (
    <Etiqueta texto={`${T.uci}: ${o?.texto ?? estado.estado} · ${haceCuanto(estado.actualizadoEn, ahora)}`}
      colorFondo={tono.fondo} colorTexto={tono.texto} conPunto />
  );
}
