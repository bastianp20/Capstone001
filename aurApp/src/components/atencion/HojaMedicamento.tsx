import { useState } from 'react';
import { View } from 'react-native';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { CampoTexto } from '@/components/formulario/CampoTexto';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { HojaInferior } from '@/components/ui/HojaInferior';
import { MEDICAMENTO_VACIO, TEXTOS_RECETA_ATENCION as T } from '@/constants/constants';
import { hojaMedicamentoStyles as styles } from '@/css/RecetaPage';
import type { HojaMedicamentoProps, MedicamentoReceta } from '@/interfaces';

/** Hoja para agregar o editar un medicamento (los 4 datos son obligatorios). */
export function HojaMedicamento({ visible, inicial, onGuardar, onCerrar }: HojaMedicamentoProps) {
  return (
    <HojaInferior visible={visible} titulo={inicial ? T.editarMedicamento : T.nuevoMedicamento} onCerrar={onCerrar}>
      {/* key: al abrirla de nuevo parte con los datos del medicamento elegido */}
      {visible && <FormularioMedicamento key={inicial?.nombre ?? 'nuevo'} inicial={inicial} onGuardar={onGuardar} />}
    </HojaInferior>
  );
}

function FormularioMedicamento({ inicial, onGuardar }: Pick<HojaMedicamentoProps, 'inicial' | 'onGuardar'>) {
  const [m, setM] = useState<MedicamentoReceta>(inicial ?? MEDICAMENTO_VACIO);
  const [error, setError] = useState('');
  const campo = (clave: keyof MedicamentoReceta) => (texto: string) => setM((x) => ({ ...x, [clave]: texto }));

  const listo = () => {
    if (Object.values(m).some((v) => !v.trim())) return setError(T.faltanDatos);
    onGuardar(m);
  };

  return (
    <View style={styles.formulario}>
      <CampoTexto etiqueta={T.nombre} icono="pastilla" value={m.nombre} onChangeText={campo('nombre')} placeholder={T.nombrePlaceholder} maxLength={120} />
      <CampoTexto etiqueta={T.dosis} icono="jeringa" value={m.dosis} onChangeText={campo('dosis')} placeholder={T.dosisPlaceholder} maxLength={80} />
      <CampoTexto etiqueta={T.frecuencia} icono="reloj" value={m.frecuencia} onChangeText={campo('frecuencia')} placeholder={T.frecuenciaPlaceholder} maxLength={80} />
      <CampoTexto etiqueta={T.duracion} icono="citas" value={m.duracion} onChangeText={campo('duracion')} placeholder={T.duracionPlaceholder} maxLength={80} />
      <MensajeFormulario tipo="error" texto={error} />
      <BotonPrincipal texto={T.listo} onPress={listo} />
    </View>
  );
}
