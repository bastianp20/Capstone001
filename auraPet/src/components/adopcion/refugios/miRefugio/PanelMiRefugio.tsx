import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PESTANAS_MI_REFUGIO, rutaAnimalesDeRefugio, TEXTOS_MI_REFUGIO as T } from "../../../../constants";
import { useMiRefugio } from "../../../../hooks/useMiRefugio";
import type { PanelMiRefugioProps, PublicacionPropia } from "../../../../interfaces";
import { DarEnAdopcionModal } from "../../../../Modal/DarEnAdopcionModal";
import { Toast } from "../../comun/Toast";
import { ElegirFamilia } from "../../publicaciones/ElegirFamilia";
import { AnimalesDelRefugio } from "./AnimalesDelRefugio";
import { HeroMiRefugio } from "./HeroMiRefugio";
import { PanelEditarRefugio } from "./PanelEditarRefugio";
import { TarjetaCapacidadRefugio } from "./TarjetaCapacidadRefugio";
import { TarjetaDatosRefugio } from "./TarjetaDatosRefugio";
import { TarjetaEquipoRefugio } from "./TarjetaEquipoRefugio";
import { TarjetaEsteMesRefugio } from "./TarjetaEsteMesRefugio";
import { TarjetaRecepcionRefugio } from "./TarjetaRecepcionRefugio";

/** Todo lo de un refugio: portada, capacidad, recepción, el mes, sus animales, datos y equipo. */
export const PanelMiRefugio = ({ refugioId }: PanelMiRefugioProps) => {
  const navigate = useNavigate();
  const m = useMiRefugio(refugioId);
  const [revisando, setRevisando] = useState<PublicacionPropia | null>(null);
  const [editando, setEditando] = useState(false);
  const [publicando, setPublicando] = useState(false);
  const r = m.refugio;

  if (revisando) return <ElegirFamilia publicacion={revisando} onVolver={() => setRevisando(null)} onCambio={m.recargar} />;
  if (m.cargando && !r) return <p className="ap-estado">{T.cargando}</p>;
  if (m.error || !r) return <p className="ap-estado" role="alert">{T.error}</p>;

  return (
    <>
      <HeroMiRefugio refugio={r} onVerPublica={() => navigate(rutaAnimalesDeRefugio(r.id))} />
      {r.estado !== "aprobado" && <p className={`mr-aviso mr-aviso-${r.estado}`}>{r.estado === "pendiente" ? T.porRevisar : T.rechazado}</p>}
      {m.errorAccion && <p className="adopta-campo-error" role="alert">{m.errorAccion}</p>}

      <div className="mr-bento">
        <TarjetaCapacidadRefugio ocupados={r.cuposOcupados} totales={r.cuposTotales} actualizadoEn={r.cuposActualizadosEn} onCambiar={m.cambiarCupos} />
        <TarjetaRecepcionRefugio valor={r.recibe} ocupado={m.ocupado} onCambiar={m.cambiarRecepcion} />
        <TarjetaEsteMesRefugio publicados={r.publicadosMes} postulaciones={r.postulacionesMes} adoptados={r.adoptadosMes} porMes={r.porMes} />
      </div>

      <div className="mr-columnas">
        <AnimalesDelRefugio
          animales={m.animales}
          cargando={m.cargandoAnimales}
          pestanas={PESTANAS_MI_REFUGIO.map((p) => ({ ...p, cantidad: m.cantidad(p.valor) }))}
          pestana={m.pestana}
          onPestana={m.setPestana}
          onPublicar={() => setPublicando(true)}
          onVerPostulaciones={setRevisando}
        />
        <div className="mr-lateral">
          <TarjetaDatosRefugio refugio={r} onEditar={() => setEditando(true)} />
          <TarjetaEquipoRefugio equipo={r.equipo} />
        </div>
      </div>

      {editando && (
        <PanelEditarRefugio
          refugio={r}
          onCerrar={() => setEditando(false)}
          onGuardado={() => {
            setEditando(false);
            m.avisar(T.datosGuardados);
            m.recargar();
          }}
        />
      )}
      {publicando && <DarEnAdopcionModal refugioId={r.id} onCerrar={() => setPublicando(false)} onPublicada={m.recargar} />}
      <Toast mensaje={m.toast} />
    </>
  );
};
