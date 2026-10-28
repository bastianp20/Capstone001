import { Loader2, Search } from "lucide-react";
import { ESTILO_ROL, TEXTOS_MODAL_REFUGIO as T, TEXTOS_REFUGIOS_ADMIN } from "../../../../constants";
import { useBuscarCuentas } from "../../../../hooks/useBuscarCuentas";
import type { BuscadorCuentasProps, RolCuenta } from "../../../../interfaces";
import { iniciales } from "../../../../lib/publicacionesAdopcion";

/** Buscar una cuenta por correo o nombre y agregarla como administradora. */
export const BuscadorCuentas = ({ excluir, refugioDePrueba, onAgregar }: BuscadorCuentasProps) => {
  const b = useBuscarCuentas();
  const abierto = b.texto.trim().length >= 2;
  return (
    <div className="ap-buscador-cuentas">
      <label className="ap-buscador" htmlFor="buscar-cuenta-refugio">
        <span className="ap-solo-lector">{T.buscarCuenta}</span>
        {b.buscando ? <Loader2 size={18} className="ap-girando" aria-hidden /> : <Search size={18} aria-hidden />}
        <input
          id="buscar-cuenta-refugio"
          type="search"
          placeholder={T.buscarCuenta}
          value={b.texto}
          autoComplete="off"
          onChange={(e) => b.setTexto(e.target.value)}
        />
      </label>
      {abierto && (b.resultados.length > 0 || b.sinResultados) && (
        <ul className="ap-resultados-cuentas">
          {b.sinResultados && <li className="ap-resultado-vacio">{T.sinResultados}</li>}
          {b.resultados.map((c) => {
            const yaEsta = excluir.includes(c.id);
            const otroMundo = c.esPrueba !== refugioDePrueba;
            return (
              <li key={c.id} className="ap-resultado-cuenta">
                <span className="ap-avatar" aria-hidden>{iniciales(c.nombre)}</span>
                <span className="ap-admin-datos">
                  <strong>{c.nombre}</strong>
                  <small>{c.correo}</small>
                  <span className="ap-chips">
                    <span className="ap-chip">{ESTILO_ROL[c.rol as RolCuenta]?.texto ?? c.rol}</span>
                    {c.esPrueba && <span className="ap-chip ap-chip-prueba">{TEXTOS_REFUGIOS_ADMIN.prueba}</span>}
                  </span>
                  {otroMundo && <small className="ap-aviso-mundo">{c.esPrueba ? T.avisoPrueba(c.nombre) : T.avisoReal(c.nombre)}</small>}
                </span>
                <button
                  type="button"
                  className="ap-btn ap-btn-primario ap-btn-chico"
                  disabled={yaEsta || otroMundo}
                  onClick={() => {
                    onAgregar(c);
                    b.limpiar();
                  }}
                >
                  {yaEsta ? T.agregado : T.agregar}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
