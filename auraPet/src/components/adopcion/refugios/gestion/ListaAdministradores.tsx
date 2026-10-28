import { TEXTOS_MODAL_REFUGIO as T, TEXTOS_REFUGIOS_ADMIN } from "../../../../constants";
import type { ListaAdministradoresProps } from "../../../../interfaces";
import { iniciales } from "../../../../lib/publicacionesAdopcion";

/** Personas que administran el refugio (con "Quitar" si se puede editar). */
export const ListaAdministradores = ({ administradores, onQuitar }: ListaAdministradoresProps) => (
  <ul className="ap-admins">
    {administradores.map((a) => (
      <li key={a.id} className="ap-admin">
        <span className="ap-avatar" aria-hidden>{iniciales(a.nombre)}</span>
        <span className="ap-admin-datos">
          <strong>
            {a.nombre}
            {a.esPrueba && <span className="ap-chip ap-chip-prueba">{TEXTOS_REFUGIOS_ADMIN.prueba}</span>}
          </strong>
          <small>{a.correo}</small>
        </span>
        {onQuitar && (
          <button type="button" className="ap-btn-texto ap-btn-texto-peligro" onClick={() => onQuitar(a.id)}>
            {T.quitar}
          </button>
        )}
      </li>
    ))}
  </ul>
);
