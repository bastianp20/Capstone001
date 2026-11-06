import { Text } from 'react-native';

import { HojaInferior } from '@/components/ui/HojaInferior';
import { TarjetaOpcion } from '@/components/ui/TarjetaOpcion';
import { OPCIONES_APARIENCIA, TEXTOS_APARIENCIA as T } from '@/constants/constants';
import { useTema } from '@/context/TemaContext';
import { useHojaAparienciaStyles } from '@/css/PerfilPage';
import type { HojaAparienciaProps } from '@/interfaces';

/** Claro ☀️ / Oscuro 😼 / Automático. Cambia al instante y se guarda en el teléfono. */
export function HojaApariencia({ visible, onCerrar }: HojaAparienciaProps) {
  const styles = useHojaAparienciaStyles();
  const { preferencia, cambiarPreferencia } = useTema();
  return (
    <HojaInferior visible={visible} titulo={T.titulo} onCerrar={onCerrar}>
      <Text style={styles.bajada}>{T.bajada}</Text>
      {OPCIONES_APARIENCIA.map((o) => (
        <TarjetaOpcion key={o.valor} icono={o.icono} titulo={o.texto} detalle={o.ayuda}
          seleccionada={preferencia === o.valor} onPress={() => cambiarPreferencia(o.valor)} />
      ))}
    </HojaInferior>
  );
}
