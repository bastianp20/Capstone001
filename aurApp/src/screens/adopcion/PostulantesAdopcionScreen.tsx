import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { HojaConcretarAdopcion } from '@/components/adopcion/publicaciones/HojaConcretarAdopcion';
import { HojaPostulante } from '@/components/adopcion/publicaciones/HojaPostulante';
import { TarjetaPostulante } from '@/components/adopcion/publicaciones/TarjetaPostulante';
import { BotonIcono } from '@/components/ui/BotonIcono';
import { EncabezadoPagina } from '@/components/ui/EncabezadoPagina';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { HojaContacto } from '@/components/ui/HojaContacto';
import { PantallaLista } from '@/components/ui/PantallaLista';
import { TEXTOS_CARGA, TEXTOS_POSTULANTES as T } from '@/constants/constants';
import { postulantesStyles as styles } from '@/css/MisPublicacionesPage';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';
import { usePostulantesAdopcion } from '@/hooks/usePostulantesAdopcion';

/** Elegir familia: quienes postulan a un animal mío, por afinidad, con su detalle, contacto y decisión. */
export default function PostulantesAdopcionScreen() {
  useBarraEstadoClara();
  const { id } = useLocalSearchParams<{ id: string }>();
  const adopcionId = Number(id);
  const p = usePostulantesAdopcion(adopcionId);

  const contenido = () => {
    if (p.cargando) return <EstadoCarga texto={T.cargando} />;
    if (p.errorCarga || !p.ficha) return <EstadoVacio icono="cancelar" titulo={T.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={p.recargar} />;
    if (!p.postulantes.length) return <EstadoVacio icono="persona" titulo={T.sinPostulaciones} />;
    return (
      <>
        <View style={styles.resumen}>
          <Text style={styles.resumenTitulo}>{T.resumen(p.postulantes.length)}</Text>
          <Text style={styles.guia}>{T.guia}</Text>
        </View>
        <View style={styles.lista}>
          {p.postulantes.map((x) => (
            <TarjetaPostulante key={x.postulacion.id} postulante={x} onPress={() => p.abrir(x.postulacion.id)} />
          ))}
        </View>
      </>
    );
  };

  return (
    <PantallaLista
      recargando={p.recargando}
      onRecargar={p.recargar}
      encabezado={
        <EncabezadoPagina
          titulo={T.titulo}
          subtitulo={p.nombreAnimal || undefined}
          onVolver={router.back}
          accion={<BotonIcono icono="huella" etiqueta={T.verFicha} onPress={() => router.push(`/adopcion/${adopcionId}`)} />}
        />
      }>
      {contenido()}
      <HojaPostulante
        postulante={p.hojaPostulante}
        nombreAnimal={p.nombreAnimal}
        puedeElegir={p.puedeElegir}
        puedeConcretar={p.puedeConcretar}
        ocupado={p.ocupado}
        error={p.error}
        onElegir={p.elegir}
        onRechazar={p.rechazar}
        onConcretar={p.abrirConcretar}
        onContactar={p.contactar}
        onCerrar={p.cerrar}
      />
      <HojaContacto visible={!!p.contacto} contacto={p.contacto} onCerrar={p.cerrarContacto} />
      <HojaConcretarAdopcion
        visible={p.concretando}
        nombreAnimal={p.nombreAnimal}
        persona={p.abierto?.postulacion.nombre ?? ''}
        testimonio={p.testimonio}
        onTestimonio={p.setTestimonio}
        traspasar={p.traspasar}
        onTraspasar={p.setTraspasar}
        ocupado={p.ocupado}
        error={p.error}
        onConfirmar={p.confirmarAdopcion}
        onCerrar={p.cerrarConcretar}
      />
    </PantallaLista>
  );
}
