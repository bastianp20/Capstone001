import { router } from 'expo-router';
import { View } from 'react-native';

import { FilaMiembro } from '@/components/centro/FilaMiembro';
import { TarjetaSuscripcion } from '@/components/centro/TarjetaSuscripcion';
import { EncabezadoPagina } from '@/components/ui/EncabezadoPagina';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { PantallaLista } from '@/components/ui/PantallaLista';
import { TEXTOS_CARGA, TEXTOS_EQUIPO as T } from '@/constants/constants';
import { useCentro } from '@/context/CentroContext';
import { filaMiembroStyles as styles } from '@/css/CentroPage';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';

export default function EquipoScreen() {
  useBarraEstadoClara();
  const c = useCentro();
  const equipo = c.datos?.equipo ?? [];

  const contenido = () => {
    if (c.cargando) return <EstadoCarga />;
    if (c.error) return <EstadoVacio icono="cancelar" titulo={c.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={c.recargar} />;
    if (!equipo.length) return <EstadoVacio icono="equipo" titulo={T.vacio} detalle={T.vacioDetalle} />;
    return (
      <>
        <TarjetaSuscripcion suscripcion={c.datos?.suscripcion ?? null} onVerPlanes={() => router.push('/centro/planes')} />
        <View style={styles.tarjeta}>
          {equipo.map((m, i) => (
            <FilaMiembro key={m.clave} miembro={m} ultima={i === equipo.length - 1} />
          ))}
        </View>
      </>
    );
  };

  return (
    <PantallaLista recargando={c.recargando} onRecargar={c.recargar} encabezado={<EncabezadoPagina titulo={T.titulo} subtitulo={c.datos?.detalle.nombre} />}>
      {contenido()}
    </PantallaLista>
  );
}
