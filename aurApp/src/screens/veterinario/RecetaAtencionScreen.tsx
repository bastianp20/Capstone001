import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { CampoTexto } from '@/components/formulario/CampoTexto';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { HojaMedicamento } from '@/components/atencion/HojaMedicamento';
import { RecetaLista } from '@/components/atencion/RecetaLista';
import { TarjetaMedicamento } from '@/components/atencion/TarjetaMedicamento';
import { AvisoSinConexion } from '@/components/ui/AvisoSinConexion';
import { BotonAgregar } from '@/components/ui/BotonAgregar';
import { EstadoBorrador } from '@/components/ui/EstadoBorrador';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { TEXTOS_RECETA_ATENCION as T } from '@/constants/constants';
import { recetaStyles as styles } from '@/css/RecetaPage';
import { useAuth } from '@/Auth/AuthContext';
import { useAtencion } from '@/hooks/useAtencion';
import { useRecetaAtencion } from '@/hooks/useRecetaAtencion';
import { formatFechaChilena, hoy } from '@/lib/fechas';

/** Nueva receta: medicamentos, indicaciones y próximo control; al guardar, se comparte el PDF. */
export default function RecetaAtencionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { usuarioActual } = useAuth();
  const a = useAtencion(Number(id));
  const r = useRecetaAtencion(Number(id));
  const mascota = a.cita?.mascota ?? '';

  if (r.lista) {
    return (
      <PantallaFormulario titulo={T.listaTitulo}>
        <RecetaLista mascota={mascota} dueno={a.dueno} ocupado={r.compartiendo} error={r.errorPdf} onCompartir={r.compartir} onVolver={() => router.back()} />
      </PantallaFormulario>
    );
  }

  return (
    <PantallaFormulario
      titulo={T.titulo}
      subtitulo={T.subtitulo(mascota, usuarioActual?.nombre ?? '', formatFechaChilena(hoy()).replaceAll('-', '/'))}
      pie={
        <View style={styles.pie}>
          {!r.sinConexion && <MensajeFormulario tipo="error" texto={r.error} />}
          <EstadoBorrador guardadoEn={r.guardadoEn} />
          <BotonPrincipal texto={T.guardar} textoCargando={T.guardando} cargando={r.guardando} onPress={r.guardar} tono="coral" />
        </View>
      }>
      <View style={styles.cuerpo}>
        <AvisoSinConexion visible={r.sinConexion} reintentando={r.guardando} onReintentar={r.guardar} />
        <View style={styles.tituloFila}>
          <Text style={styles.titulo}>{T.medicamentos}</Text>
          {r.medicamentos.length > 0 && <Text style={styles.contador}>{r.medicamentos.length}</Text>}
        </View>
        <View style={styles.lista}>
          {r.medicamentos.map((m, i) => (
            <TarjetaMedicamento key={`${m.nombre}-${i}`} medicamento={m} onEditar={() => r.editar(i)} onQuitar={() => r.quitarMedicamento(i)} />
          ))}
          <BotonAgregar texto={T.agregar} onPress={r.agregar} />
        </View>
        <CampoTexto
          etiqueta={T.indicaciones}
          icono="ficha"
          value={r.datos.indicaciones}
          onChangeText={(indicaciones) => r.cambiar({ indicaciones })}
          placeholder={T.indicacionesPlaceholder}
          multiline
          maxLength={600}
        />
        <CampoTexto
          etiqueta={T.proximoControl}
          icono="citas"
          value={r.datos.proximoControl}
          onChangeText={(proximoControl) => r.cambiar({ proximoControl })}
          placeholder="12-11-2026"
          keyboardType="numbers-and-punctuation"
          maxLength={10}
        />
      </View>
      <HojaMedicamento visible={r.editando !== null} inicial={r.medicamentoEditado} onGuardar={r.guardarMedicamento} onCerrar={r.cerrarHoja} />
    </PantallaFormulario>
  );
}
