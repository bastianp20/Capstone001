import { House, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { rutaAnimalesDeRefugio, TEXTOS_REFUGIOS_ADMIN as T } from "../../../../constants";
import { useRefugiosAdmin } from "../../../../hooks/useRefugiosAdmin";
import { AvisoRefugiosPorRevisar } from "./AvisoRefugiosPorRevisar";
import { BandaKpisRefugios } from "./BandaKpisRefugios";
import { FiltrosRefugiosAdmin } from "./FiltrosRefugiosAdmin";
import { ModalRefugio } from "./ModalRefugio";
import { PanelDetalleRefugio } from "./PanelDetalleRefugio";
import { TablaRefugiosAdmin } from "./TablaRefugiosAdmin";
import "../../../../css/AdopcionCompartido.css";
import "../../../../css/AdopcionPanel.css";
import "../../../../css/RefugiosAdmin.css";

/** "Refugios" del superadmin: verificar, crear, editar y asignar administradores. */
export const SeccionRefugiosAdmin = () => {
  const navigate = useNavigate();
  const g = useRefugiosAdmin();
  const verAnimales = (id: number) => navigate(rutaAnimalesDeRefugio(id));
  const sel = g.seleccionado;

  return (
    <div className="ap ra">
      <header className="ra-encabezado">
        <div>
          <h1>{T.titulo}</h1>
          <p className="ap-suave">{T.bajada}</p>
        </div>
        <button type="button" className="ap-btn ap-btn-primario" onClick={g.abrirNuevo}>
          <Plus size={18} aria-hidden /> {T.nuevo}
        </button>
      </header>

      <BandaKpisRefugios kpis={g.kpis} onRevisar={g.verPorRevisar} />
      {g.filtros.estado !== "pendiente" && <AvisoRefugiosPorRevisar refugios={g.porRevisar} onRevisar={g.verPorRevisar} />}
      <FiltrosRefugiosAdmin filtros={g.filtros} regiones={g.regiones} onCambiar={g.cambiarFiltros} />
      {g.errorAccion && <p className="adopta-campo-error" role="alert">{g.errorAccion}</p>}

      {g.cargando ? (
        <p className="ap-estado">{T.cargando}</p>
      ) : g.error ? (
        <p className="ap-estado" role="alert">{T.error}</p>
      ) : !g.lista.length ? (
        <div className="ap-vacio">
          <span className="ap-vacio-icono" aria-hidden>
            <House size={34} />
          </span>
          <h2>{T.vacioTitulo}</h2>
          <p>{T.vacioTexto}</p>
          <button type="button" className="ap-btn ap-btn-primario" onClick={g.abrirNuevo}>
            <Plus size={18} aria-hidden /> {T.nuevo}
          </button>
        </div>
      ) : !g.visibles.length ? (
        <p className="ap-estado">{T.vacioFiltro}</p>
      ) : (
        <>
          <TablaRefugiosAdmin
            refugios={g.visibles}
            seleccionadoId={sel?.id ?? null}
            onVer={g.seleccionar}
            onEditar={g.abrirEdicion}
            onVerAnimales={(r) => verAnimales(r.id)}
            onVerificar={g.verificar}
          />
          <p className="ap-suave ra-mostrando">{T.mostrando(g.visibles.length, g.lista.length)}</p>
        </>
      )}

      {sel && (
        <PanelDetalleRefugio
          key={sel.id}
          refugio={sel}
          ocupado={g.ocupado}
          onCerrar={() => g.seleccionar(null)}
          onEditar={() => {
            g.seleccionar(null);
            g.abrirEdicion(sel);
          }}
          onVerificar={(aprobar) => g.verificar(sel, aprobar)}
        />
      )}
      {g.enModal !== undefined && (
        <ModalRefugio
          refugio={g.enModal}
          onCerrar={g.cerrarModal}
          onGuardado={() => {
            g.cerrarModal();
            g.recargar();
          }}
        />
      )}
    </div>
  );
};
