import { Heart, Wallet } from "lucide-react";
import {
  ESTADOS_GENERALES_ATENCION,
  MAX_RESUMEN_ATENCION,
  PROCEDIMIENTOS_ATENCION,
  TEXTOS_REGISTRAR_ATENCION as T,
  TONOS_ADOPCION,
} from "../../../constants";
import { useRegistrarAtencion } from "../../../hooks/useRegistrarAtencion";
import type { PanelRegistrarAtencionProps } from "../../../interfaces";
import { AvatarAnimal } from "../AvatarAnimal";
import { ControlSegmentado } from "../comun/ControlSegmentado";
import { PanelLateralAdopcion } from "../comun/PanelLateralAdopcion";
import { CampoTextoAdopcion } from "../formulario/CampoTextoAdopcion";
import { VistaPreviaAtencion } from "./VistaPreviaAtencion";

/** Panel "Registrar atención": formulario a la izquierda y vista previa del sello a la derecha. */
export const PanelRegistrarAtencion = ({ animal, centros, veterinario, onCerrar, onGuardada }: PanelRegistrarAtencionProps) => {
  const f = useRegistrarAtencion(animal.id, centros, onGuardada);
  const centro = centros.find((c) => c.id === f.datos.centroId)?.nombre ?? null;

  return (
    <PanelLateralAdopcion
      titulo={T.titulo(animal.nombre)}
      onCerrar={onCerrar}
      ancho="grande"
      pie={
        <>
          {f.error && <p className="adopta-campo-error" role="alert">{f.error}</p>}
          <button type="button" className="ap-btn ap-btn-borde" onClick={onCerrar} disabled={f.guardando}>
            {T.cancelar}
          </button>
          <button type="button" className="ap-btn ap-btn-primario" onClick={f.guardar} disabled={f.guardando}>
            {f.guardando ? T.guardando : T.guardar}
          </button>
        </>
      }
    >
      <div className="ap-atender">
        <div className="ap-atender-form">
          <div className="ap-atender-animal">
            <AvatarAnimal especie={animal.especie} fotoUrl={animal.fotoUrl} nombre={animal.nombre} tono={TONOS_ADOPCION[0]} tamanoIcono={30} className="ap-atender-foto" />
            <div>
              <strong>{animal.nombre}</strong>
              <span className="ap-suave">
                {animal.raza} · {animal.edad} · {animal.comuna}
              </span>
              <span className="ap-suave">{T.publicadoPor(animal.refugio ?? animal.publicador)}</span>
            </div>
          </div>

          <div className="publica-fila-doble">
            <div className="adopta-campo">
              <label htmlFor="atencion-fecha">{T.fecha}</label>
              <input id="atencion-fecha" type="date" className="adopta-input" value={f.datos.fecha} onChange={(e) => f.cambiar({ fecha: e.target.value })} />
            </div>
            <div className="adopta-campo">
              <label htmlFor="atencion-centro">{T.centro}</label>
              <select
                id="atencion-centro"
                className="adopta-input adopta-select"
                value={f.datos.centroId ?? ""}
                onChange={(e) => f.cambiar({ centroId: e.target.value ? Number(e.target.value) : null })}
              >
                {centros.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
                <option value="">{T.sinCentro}</option>
              </select>
            </div>
          </div>

          <ControlSegmentado etiqueta={T.estado} opciones={ESTADOS_GENERALES_ATENCION} valor={f.datos.estadoGeneral} onCambiar={(estadoGeneral) => f.cambiar({ estadoGeneral })} />

          <fieldset className="adopta-campo">
            <legend>{T.hecho}</legend>
            <div className="adopta-grupo-opciones">
              {PROCEDIMIENTOS_ATENCION.map(({ valor, label, icono: Icono }) => {
                const activo = f.datos.procedimientos.includes(valor);
                return (
                  <button
                    key={valor}
                    type="button"
                    className={`adopta-pildora ${activo ? "adopta-pildora-activa" : ""}`}
                    aria-pressed={activo}
                    onClick={() => f.alternarProcedimiento(valor)}
                  >
                    <Icono size={15} aria-hidden /> {label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <CampoTextoAdopcion id="atencion-peso" etiqueta={T.peso} tipo="number" valor={f.datos.pesoKg} onCambiar={(pesoKg) => f.cambiar({ pesoKg })} error={f.errores.pesoKg} />
          <CampoTextoAdopcion
            id="atencion-resumen"
            etiqueta={T.resumen}
            valor={f.datos.resumen}
            onCambiar={(resumen) => f.cambiar({ resumen })}
            placeholder={T.resumenPlaceholder}
            multilinea
            maximo={MAX_RESUMEN_ATENCION}
            error={f.errores.resumen}
          />

          <fieldset className="adopta-campo">
            <legend>{T.costo}</legend>
            <div className="ap-costos">
              <button type="button" className={`ap-costo ${f.datos.solidario ? "ap-costo-activo" : ""}`} aria-pressed={f.datos.solidario} onClick={() => f.cambiar({ solidario: true })}>
                <Heart size={20} fill={f.datos.solidario ? "currentColor" : "none"} aria-hidden />
                <strong>{T.gratisTitulo}</strong>
                <small>{T.gratisDetalle}</small>
              </button>
              <button type="button" className={`ap-costo ${!f.datos.solidario ? "ap-costo-activo" : ""}`} aria-pressed={!f.datos.solidario} onClick={() => f.cambiar({ solidario: false })}>
                <Wallet size={20} aria-hidden />
                <strong>{T.costoTitulo}</strong>
                <small>{T.costoDetalle}</small>
              </button>
            </div>
            {!f.datos.solidario && (
              <CampoTextoAdopcion id="atencion-monto" etiqueta={T.monto} valor={f.datos.monto} onCambiar={(monto) => f.cambiar({ monto })} placeholder="Ej: 15000" error={f.errores.monto} />
            )}
          </fieldset>
        </div>

        <VistaPreviaAtencion animal={animal} veterinario={veterinario} centro={centro} datos={f.datos} />
      </div>
    </PanelLateralAdopcion>
  );
};
