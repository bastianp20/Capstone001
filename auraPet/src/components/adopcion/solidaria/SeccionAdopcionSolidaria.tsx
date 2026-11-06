import { HandHeart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PESTANAS_SOLIDARIA, rutaFichaAdopcion, TEXTOS_SOLIDARIA as T, TONOS_ADOPCION } from "../../../constants";
import { useAdopcionSolidaria } from "../../../hooks/useAdopcionSolidaria";
import type { AnimalParaVeterinario, SeccionAdopcionSolidariaProps } from "../../../interfaces";
import { PestanasSubrayadas } from "../comun/PestanasSubrayadas";
import { FiltrosSolidaria } from "./FiltrosSolidaria";
import { ListaMisAtenciones } from "./ListaMisAtenciones";
import { PanelRegistrarAtencion } from "./PanelRegistrarAtencion";
import { TarjetaAliadoSolidario } from "./TarjetaAliadoSolidario";
import { TarjetaAnimalVeterinario } from "./TarjetaAnimalVeterinario";
import { TarjetaImpacto } from "./TarjetaImpacto";
import { TarjetaUrgente } from "./TarjetaUrgente";
import "../../../css/AdopcionCompartido.css";
import "../../../css/AdopcionPanel.css";

/** "Adopción solidaria" (panel del veterinario): impacto, aliado, urgentes y todos los animales. */
export const SeccionAdopcionSolidaria = ({ veterinario }: SeccionAdopcionSolidariaProps) => {
  const navigate = useNavigate();
  const s = useAdopcionSolidaria();
  const [atendiendo, setAtendiendo] = useState<AnimalParaVeterinario | null>(null);
  const verFicha = (id: number) => navigate(rutaFichaAdopcion(id));

  const vacio = s.pestana === "esperando" ? T.vacioEsperando : s.pestana === "todos" ? T.vacioTodos : T.vacioMias;

  return (
    <div className="ap">
      <div className="ap-bento ap-bento-solidaria">
        <header className="ap-hero-solidaria ap-tono-menta">
          <span className="ap-hero-icono" aria-hidden>
            <HandHeart size={28} />
          </span>
          <h1>{T.titulo}</h1>
          <p>{T.bajada}</p>
        </header>
        {s.resumen && <TarjetaImpacto resumen={s.resumen} />}
      </div>
      {s.resumen && <TarjetaAliadoSolidario activo={s.resumen.aliado} ocupado={s.aliadoOcupado} onCambiar={s.cambiarAliado} />}

      {s.urgentes.length > 0 && (
        <section>
          <h2 className="ap-subtitulo">{T.urgentes}</h2>
          <div className="ap-urgentes">
            {s.urgentes.map((a) => (
              <TarjetaUrgente key={a.id} animal={a} onAtender={setAtendiendo} />
            ))}
          </div>
        </section>
      )}

      <div className="ap-barra-pestanas">
        <PestanasSubrayadas
          etiqueta={T.titulo}
          opciones={PESTANAS_SOLIDARIA.map((o) => ({
            ...o,
            cantidad: o.valor === "esperando" ? s.totalEsperando : o.valor === "mias" ? s.atenciones.length : undefined,
          }))}
          valor={s.pestana}
          onCambiar={s.setPestana}
        />
        {s.pestana !== "mias" && <FiltrosSolidaria filtros={s.filtros} comunas={s.comunas} onCambiar={s.cambiarFiltros} />}
      </div>

      {s.cargando ? (
        <p className="ap-estado">{T.cargando}</p>
      ) : s.error ? (
        <p className="ap-estado" role="alert">{T.error}</p>
      ) : s.pestana === "mias" ? (
        s.atenciones.length ? <ListaMisAtenciones atenciones={s.atenciones} onVerFicha={verFicha} /> : <p className="ap-estado">{vacio}</p>
      ) : s.visibles.length ? (
        <div className="ap-grilla-animales">
          {s.visibles.map((a, i) => (
            <TarjetaAnimalVeterinario
              key={a.id}
              animal={a}
              tono={TONOS_ADOPCION[i % TONOS_ADOPCION.length]}
              onAtender={setAtendiendo}
              onVerFicha={(x) => verFicha(x.id)}
            />
          ))}
        </div>
      ) : (
        <p className="ap-estado">{vacio}</p>
      )}

      {atendiendo && (
        <PanelRegistrarAtencion
          animal={atendiendo}
          centros={s.centros}
          veterinario={veterinario}
          onCerrar={() => setAtendiendo(null)}
          onGuardada={() => {
            setAtendiendo(null);
            s.recargar();
          }}
        />
      )}
    </div>
  );
};
