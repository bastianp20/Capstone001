import { MAX_DESCRIPCION_REFUGIO, TEXTOS_MI_REFUGIO as T, TEXTOS_MODAL_REFUGIO as M } from "../../../../constants";
import { useEditarMiRefugio } from "../../../../hooks/useEditarMiRefugio";
import type { PanelEditarRefugioProps } from "../../../../interfaces";
import { PanelLateralAdopcion } from "../../comun/PanelLateralAdopcion";
import { CampoTextoAdopcion } from "../../formulario/CampoTextoAdopcion";
import { CampoImagenesRefugio } from "../gestion/CampoImagenesRefugio";
import { CampoTelefono } from "../gestion/CampoTelefono";
import { SelectorEspecies } from "../gestion/SelectorEspecies";

/** Panel lateral para editar portada, logo, descripción, contacto y especies. */
export const PanelEditarRefugio = ({ refugio, onCerrar, onGuardado }: PanelEditarRefugioProps) => {
  const e = useEditarMiRefugio(refugio, onGuardado);
  const pie = (
    <>
      {e.error && <p className="adopta-campo-error" role="alert">{e.error}</p>}
      <button type="button" className="ap-btn ap-btn-borde" onClick={onCerrar} disabled={e.ocupado}>
        {T.cancelar}
      </button>
      <button type="button" className="ap-btn ap-btn-primario" onClick={e.guardar} disabled={e.ocupado}>
        {e.ocupado ? M.guardando : T.guardar}
      </button>
    </>
  );
  return (
    <PanelLateralAdopcion titulo={T.editarTitulo} onCerrar={onCerrar} pie={pie}>
      <CampoImagenesRefugio
        nombre={refugio.nombre}
        logo={e.datos.logo}
        portada={e.datos.portada}
        onLogo={e.elegirLogo}
        onPortada={e.elegirPortada}
        error={e.errorImagen ?? undefined}
      />
      <CampoTextoAdopcion
        id="mi-refugio-descripcion"
        etiqueta={M.descripcion}
        valor={e.datos.descripcion}
        onCambiar={(v) => e.cambiar("descripcion", v)}
        placeholder={M.descripcionPlaceholder}
        multilinea
        maximo={MAX_DESCRIPCION_REFUGIO}
      />
      <CampoTelefono id="mi-refugio-telefono" etiqueta={M.telefono} valor={e.datos.telefono} onCambiar={(v) => e.cambiar("telefono", v)} error={e.errores.telefono} />
      <CampoTextoAdopcion id="mi-refugio-correo" etiqueta={M.correo} valor={e.datos.correo} onCambiar={(v) => e.cambiar("correo", v)} error={e.errores.correo} />
      <fieldset className="adopta-campo">
        <legend>{M.especies}</legend>
        <SelectorEspecies valor={e.datos.especies} onCambiar={(v) => e.cambiar("especies", v)} error={e.errores.especies} />
      </fieldset>
    </PanelLateralAdopcion>
  );
};
