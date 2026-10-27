import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { LineaDeTiempo } from '@/components/historial/LineaDeTiempo';
import { DatoFicha } from '@/components/veterinario/DatoFicha';
import { AvatarMascota } from '@/components/ui/AvatarMascota';
import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { TituloSeccion } from '@/components/ui/TituloSeccion';
import {
  COLORES,
  SEXO_LABEL,
  TEXTO_SIN_REGISTRAR,
  TEXTOS_CARGA,
  TEXTOS_FICHA_PACIENTE as T,
  TEXTOS_HISTORIAL,
  TEXTOS_VETERINARIO,
} from '@/constants/constants';
import { fichaPacienteStyles as styles } from '@/css/VeterinarioPage';
import { useFichaPaciente } from '@/hooks/useFichaPaciente';
import { formatFechaLarga } from '@/lib/fechas';
import { formatearPeso } from '@/lib/formatos';

export default function FichaPacienteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const f = useFichaPaciente(Number(id));
  const m = f.ficha?.mascota;

  if (f.cargando || f.error || !f.ficha || !m) {
    return (
      <PantallaFormulario titulo={TEXTOS_HISTORIAL.titulo}>
        {f.cargando ? (
          <EstadoCarga />
        ) : (
          <EstadoVacio icono="cancelar" titulo={f.error ?? TEXTOS_CARGA.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={f.recargar} />
        )}
      </PantallaFormulario>
    );
  }

  return (
    <PantallaFormulario titulo={m.nombre}>
      <View style={styles.cabecera}>
        <AvatarMascota nombre={m.nombre} fotoUrl={m.fotoUrl} tamano={64} />
        <View style={styles.textos}>
          <Text style={styles.nombre}>{m.nombre}</Text>
          <Text style={styles.descripcion}>{f.descripcion}</Text>
        </View>
        <BotonPequeno texto={T.fichaPdf} icono="descarga" cargando={f.generandoPdf} onPress={f.descargarPdf} />
      </View>
      <MensajeFormulario tipo="error" texto={f.errorPdf} />

      {m.alergias && (
        <Etiqueta
          texto={TEXTOS_VETERINARIO.alergia(m.alergias)}
          icono="alerta"
          colorFondo={COLORES.estados.pendiente.fondo}
          colorTexto={COLORES.estados.pendiente.texto}
        />
      )}

      <TituloSeccion texto={T.datos} />
      <View style={styles.grilla}>
        <DatoFicha etiqueta={T.peso} valor={m.pesoKg !== null ? formatearPeso(m.pesoKg) : TEXTO_SIN_REGISTRAR} />
        <DatoFicha etiqueta={T.sexo} valor={SEXO_LABEL[m.sexo]} />
        <DatoFicha etiqueta={T.esterilizado} valor={m.esterilizado ? T.si : T.no} />
        <DatoFicha etiqueta={T.nacimiento} valor={m.fechaNacimiento ? formatFechaLarga(m.fechaNacimiento) : TEXTO_SIN_REGISTRAR} />
        <DatoFicha etiqueta={T.microchip} valor={m.microchip ?? TEXTO_SIN_REGISTRAR} />
        {m.condicionesCronicas && <DatoFicha etiqueta={T.condiciones} valor={m.condicionesCronicas} />}
      </View>

      <TituloSeccion texto={T.dueno} />
      <View style={styles.dueno}>
        <Text style={styles.duenoTexto}>{f.ficha.dueno}</Text>
        {f.ficha.telefonoDueno && <BotonPequeno texto={T.llamar} icono="telefono" onPress={f.llamar} />}
      </View>

      <TituloSeccion texto={T.historial} />
      {f.grupos.length ? <LineaDeTiempo grupos={f.grupos} mostrarMascota={false} /> : <MensajeFormulario tipo="aviso" texto={T.sinHistorial} />}
    </PantallaFormulario>
  );
}
