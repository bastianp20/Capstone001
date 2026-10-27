import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AvisoConfianzaAdopcion } from "../../components/adopcion/AvisoConfianzaAdopcion";
import { BandaDarEnAdopcion } from "../../components/adopcion/BandaDarEnAdopcion";
import { FiltrosAdopcion } from "../../components/adopcion/FiltrosAdopcion";
import { GrillaAdopcion } from "../../components/adopcion/GrillaAdopcion";
import { HeroAdopcion } from "../../components/adopcion/HeroAdopcion";
import { HistoriasExito } from "../../components/adopcion/HistoriasExito";
import { PanelFiltrosAdopcion } from "../../components/adopcion/PanelFiltrosAdopcion";
import { TarjetaDestacadaAdopcion } from "../../components/adopcion/TarjetaDestacadaAdopcion";
import { FOTOS_HERO_ADOPCION, RUTA_PUBLICAR_ADOPCION, rutaFichaAdopcion, TEXTOS_ADOPCION as T } from "../../constants";
import { useAdopciones } from "../../hooks/useAdopciones";
import { useFiltrosAdopcion } from "../../hooks/useFiltrosAdopcion";
import type { AnimalAdopcion } from "../../interfaces";
import "../../css/AdopcionCompartido.css";
import "../../css/AdopcionPage.css";

/**
 * Página pública /adopta (datos de la base, migraciones 36 y 37): se ve sin cuenta.
 * "Conocer a…" abre la ficha y "Dar en adopción" el formulario (que pide sesión).
 */
export const AdopcionScreen = () => {
  const navigate = useNavigate();
  const { animales, historias, estadisticas, destacado, cargando, error } = useAdopciones();
  const f = useFiltrosAdopcion(animales);
  const grillaRef = useRef<HTMLDivElement>(null);

  const irAGrilla = () => grillaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const darEnAdopcion = () => navigate(RUTA_PUBLICAR_ADOPCION);
  const conocer = (animal: AnimalAdopcion) => navigate(rutaFichaAdopcion(animal.id));

  return (
    <main className="adopta">
      <HeroAdopcion
        estadisticas={estadisticas}
        fotos={FOTOS_HERO_ADOPCION}
        etiquetaFlotante={historias[0] ? T.yaTieneFamilia(historias[0].nombre) : null}
        onConocerlos={irAGrilla}
        onDarEnAdopcion={darEnAdopcion}
      />

      <div className="adopta-contenedor">
        {destacado && <TarjetaDestacadaAdopcion animal={destacado} onConocer={conocer} />}

        <div ref={grillaRef} className="adopta-ancla">
          <FiltrosAdopcion
            especie={f.especie}
            onEspecie={f.setEspecie}
            soloRevisados={f.extra.soloRevisados}
            onSoloRevisados={(soloRevisados) => f.cambiarExtra({ soloRevisados })}
            filtrosActivos={f.filtrosPanel}
            onMasFiltros={f.abrirPanel}
          />
          <GrillaAdopcion
            animales={f.visibles}
            cargando={cargando}
            hayPublicaciones={animales.length > 0}
            error={error}
            onLimpiarFiltros={f.limpiar}
            onConocer={conocer}
          />
        </div>
      </div>

      <BandaDarEnAdopcion onPublicar={darEnAdopcion} />
      <div className="adopta-contenedor">
        <HistoriasExito historias={historias} />
      </div>
      <AvisoConfianzaAdopcion />

      <PanelFiltrosAdopcion
        abierto={f.panelAbierto}
        busqueda={f.busqueda}
        onBusqueda={f.setBusqueda}
        filtros={f.extra}
        onCambiar={f.cambiarExtra}
        comunas={f.comunas}
        resultados={f.visibles.length}
        onLimpiar={f.limpiar}
        onCerrar={f.cerrarPanel}
      />

    </main>
  );
};
