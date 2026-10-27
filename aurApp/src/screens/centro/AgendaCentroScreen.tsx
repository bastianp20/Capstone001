import { View } from 'react-native';

import { BarraFiltros } from '@/components/ui/BarraFiltros';
import { EncabezadoPagina } from '@/components/ui/EncabezadoPagina';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { PantallaLista } from '@/components/ui/PantallaLista';
import { TarjetaCitaGestion } from '@/components/ui/TarjetaCitaGestion';
import { TituloSeccion } from '@/components/ui/TituloSeccion';
import { TEXTOS_AGENDA_CENTRO as T, TEXTOS_CARGA, TEXTOS_CENTRO } from '@/constants/constants';
import { listaGruposStyles as styles } from '@/css/Compartido';
import { useAgendaCentro } from '@/hooks/useAgendaCentro';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';

export default function AgendaCentroScreen() {
  useBarraEstadoClara();
  const a = useAgendaCentro();
  const c = a.centro;

  const contenido = () => {
    if (c.cargando) return <EstadoCarga />;
    if (c.error) return <EstadoVacio icono="cancelar" titulo={c.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={c.recargar} />;
    if (!a.hayEnFiltro) return <EstadoVacio icono="citas" titulo={T.vacio} />;
    if (!a.grupos.length) return <EstadoVacio icono="buscar" titulo={T.sinResultados} />;
    return (
      <View style={styles.contenedor}>
        {a.grupos.map((grupo) => (
          <View key={grupo.titulo} style={styles.grupo}>
            <TituloSeccion texto={grupo.titulo} />
            {grupo.items.map((cita) => (
              <TarjetaCitaGestion
                key={cita.id}
                mascota={cita.mascota}
                dueno={cita.dueno}
                fechaHora={cita.fechaHora}
                soloHora
                motivo={cita.motivo}
                estado={cita.estado}
                extra={cita.veterinario ? T.veterinario(cita.veterinario) : null}
                alerta={cita.veterinario ? null : TEXTOS_CENTRO.sinVeterinario}
                tono={cita.estado === 'pendiente' ? 'crema' : null}
              />
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <PantallaLista recargando={c.recargando} onRecargar={c.recargar} encabezado={<EncabezadoPagina titulo={T.titulo} subtitulo={c.datos?.detalle.nombre} />}>
      <BarraFiltros busqueda={a.busqueda} onBuscar={a.setBusqueda} placeholder={T.buscar} opciones={a.opciones} filtro={a.filtro} onFiltrar={a.setFiltro} />
      {contenido()}
    </PantallaLista>
  );
}
