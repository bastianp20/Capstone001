import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Colors, Iconos, Badge, badgeStyles, ESTADO_LABEL, URGENCIA_LABEL } from "../../constants";
import { useAuth } from "../../Auth/AuthContext";
import { useConsulta } from "../../hooks/useConsulta";
import { getCentroDetalle, getCitasCentro, getEquipoCentro, getMisCentrosAdmin } from "../../Api/getInfo";
import { actualizarCentro } from "../../Api/postInfo";
import { ConfiguracionModal } from "../../Modal/ConfiguracionModal";
import type { CentroAdminScreenProps, CentroDetalle } from "../../interfaces";

const colors = Colors;
const iconos = Iconos;
const FONDO = "#f6f8f8";
const ROJO = "#a4272a";
const DIAS = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

type Seccion = "centro" | "equipo" | "citas";

// Panel del centro: lo usan los admins de un centro (cargo en admins_centro),
// sean veterinarios o cuentas "administrativo".
export const CentroAdminScreen = ({ centroInicialId, onVolver }: CentroAdminScreenProps) => {
  const { usuarioActual } = useAuth();
  const [seccion, setSeccion] = useState<Seccion>("centro");
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);

  // Centros que administra (puede ser más de uno)
  const { datos: misCentros = [], cargando: cargandoCentros } =
    useConsulta(() => getMisCentrosAdmin(usuarioActual!.id), [usuarioActual!.id]);
  const [centroId, setCentroId] = useState<number | null>(centroInicialId ?? null);
  // Si no venía un centro elegido, se abre el primero de la lista
  const centroActivo = centroId ?? misCentros[0]?.id ?? null;

  const navItems: { label: string; seccion: Seccion; Icono: typeof iconos.centro }[] = [
    { label: "Mi centro", seccion: "centro", Icono: iconos.centro },
    { label: "Equipo", seccion: "equipo", Icono: iconos.usuarios },
    { label: "Citas", seccion: "citas", Icono: iconos.calendario },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: FONDO, fontFamily: "system-ui, sans-serif", color: colors.text }}>
      {/* SIDEBAR */}
      <div style={{ width: 236, flexShrink: 0, background: colors.sidebarBg, display: "flex", flexDirection: "column", padding: "20px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px 22px" }}>
          <iconos.huella size={22} color={colors.accent} />
          <span style={{ color: "white", fontWeight: 700, fontSize: 16 }}>AuraPet</span>
        </div>

        {navItems.map(({ label, seccion: s, Icono }) => {
          const activo = s === seccion;
          return (
            <div
              key={s}
              onClick={() => setSeccion(s)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, fontSize: 13.5, fontWeight: 500, cursor: "pointer", color: activo ? "white" : colors.sidebarText, background: activo ? colors.sidebarActive : "transparent" }}
            >
              <Icono size={17} />
              {label}
            </div>
          );
        })}

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
          {onVolver && (
            <div onClick={onVolver} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, fontSize: 13.5, cursor: "pointer", color: colors.sidebarText }}>
              <iconos.calendario size={17} />
              Volver a mi agenda
            </div>
          )}
          <div onClick={() => setMostrarConfiguracion(true)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, fontSize: 13.5, cursor: "pointer", color: colors.sidebarText }}>
            <iconos.configuracion size={17} />
            Configuración
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* TOPBAR: selector de centro (si administra más de uno) y usuario */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 28px", background: "white", borderBottom: `1px solid ${colors.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: colors.textMuted }}>
            Administrando
            {misCentros.length > 1 ? (
              <select
                value={centroActivo ?? ""}
                onChange={(e) => setCentroId(Number(e.target.value))}
                style={{ padding: "6px 10px", borderRadius: 8, border: `1px solid ${colors.border}`, fontSize: 13.5, fontWeight: 600, color: colors.text }}
              >
                {misCentros.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            ) : (
              <strong style={{ color: colors.text }}>{misCentros[0]?.nombre ?? "—"}</strong>
            )}
          </div>
          <span style={{ fontSize: 13.5, fontWeight: 600 }}>{usuarioActual?.nombre}</span>
        </div>

        <div style={{ flex: 1, padding: "26px 28px", overflowY: "auto" }}>
          {cargandoCentros ? (
            <p style={{ color: colors.textMuted }}>Cargando…</p>
          ) : centroActivo === null ? (
            <div style={{ background: "white", border: `1px solid ${colors.border}`, borderRadius: 12, padding: 24, textAlign: "center", color: colors.textMuted }}>
              Todavía no administras ningún centro. Pídele a un superadmin que te asigne uno.
            </div>
          ) : seccion === "centro" ? (
            <SeccionCentro centroId={centroActivo} />
          ) : seccion === "equipo" ? (
            <SeccionEquipo centroId={centroActivo} />
          ) : (
            <SeccionCitas centroId={centroActivo} />
          )}
        </div>
      </div>

      {mostrarConfiguracion && <ConfiguracionModal onCerrar={() => setMostrarConfiguracion(false)} />}
    </div>
  );
};

// ---------------------------------------------------------------------
// Tarjeta reutilizable
// ---------------------------------------------------------------------
const Tarjeta = ({ titulo, children }: { titulo: string; children: ReactNode }) => (
  <div style={{ background: "white", border: `1px solid ${colors.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 18 }}>
    <div style={{ padding: "14px 18px", borderBottom: `1px solid ${colors.border}`, fontSize: 14.5, fontWeight: 700 }}>{titulo}</div>
    <div style={{ padding: "16px 18px" }}>{children}</div>
  </div>
);

const inputStyle = { padding: "8px 10px", borderRadius: 8, border: `1px solid ${colors.border}`, fontSize: 13.5 };

// ---------------------------------------------------------------------
// Mi centro: datos editables + horarios + especialidades
// ---------------------------------------------------------------------
const SeccionCentro = ({ centroId }: { centroId: number }) => {
  const [recarga, setRecarga] = useState(0);
  const { datos: centro, cargando, error } = useConsulta(() => getCentroDetalle(centroId), [centroId, recarga]);

  if (cargando) return <p style={{ color: colors.textMuted }}>Cargando…</p>;
  if (error || !centro) return <p style={{ color: ROJO }}>{error ?? "No se encontró el centro."}</p>;

  return (
    <>
      <h1 style={{ margin: "0 0 18px", fontSize: 21, fontWeight: 700 }}>
        {centro.nombre}
        {centro.esPrueba && <span style={{ marginLeft: 10, fontSize: 12, fontWeight: 600, color: "#8a5a00" }}>(centro de pruebas)</span>}
      </h1>

      {/* key: si cambia el centro, el formulario se reinicia con sus datos */}
      <FormularioCentro key={centro.id} centro={centro} onGuardado={() => setRecarga((n) => n + 1)} />

      <Tarjeta titulo="Horario de atención">
        {centro.horarios.length === 0 ? (
          <p style={{ margin: 0, color: colors.textMuted, fontSize: 13 }}>Sin horarios registrados.</p>
        ) : (
          <div style={{ display: "grid", gap: 6 }}>
            {[1, 2, 3, 4, 5, 6, 7].map((dia) => {
              const h = centro.horarios.find((x) => x.diaSemana === dia);
              return (
                <div key={dia} style={{ display: "grid", gridTemplateColumns: "110px 1fr", fontSize: 13.5 }}>
                  <span style={{ fontWeight: 600 }}>{DIAS[dia]}</span>
                  <span style={{ color: h ? colors.text : colors.textMuted }}>
                    {h ? `${h.abre} a ${h.cierra}${h.inicioColacion ? ` · colación ${h.inicioColacion} a ${h.finColacion}` : ""}` : "Cerrado"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Tarjeta>

      <Tarjeta titulo="Especialidades">
        {centro.especialidades.length === 0 ? (
          <p style={{ margin: 0, color: colors.textMuted, fontSize: 13 }}>Sin especialidades registradas.</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {centro.especialidades.map((e) => (
              <span key={e} style={{ padding: "5px 12px", borderRadius: 999, background: colors.accentSoft, color: colors.accent, fontSize: 12.5, fontWeight: 600 }}>{e}</span>
            ))}
          </div>
        )}
      </Tarjeta>
    </>
  );
};

const FormularioCentro = ({ centro, onGuardado }: { centro: CentroDetalle; onGuardado: () => void }) => {
  const [nombre, setNombre] = useState(centro.nombre);
  const [direccion, setDireccion] = useState(centro.direccion);
  const [comuna, setComuna] = useState(centro.comuna);
  // El teléfono se guarda como 56912345678; en el input se muestra sin el 56
  const [telefono, setTelefono] = useState(centro.telefono ? String(centro.telefono).replace(/^56/, "") : "");
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState<{ ok: boolean; texto: string } | null>(null);

  // El aviso de "guardado" se borra solo después de unos segundos
  useEffect(() => {
    if (!aviso?.ok) return;
    const t = setTimeout(() => setAviso(null), 3000);
    return () => clearTimeout(t);
  }, [aviso]);

  const guardar = async (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !direccion.trim() || !comuna.trim()) {
      setAviso({ ok: false, texto: "Nombre, dirección y comuna son obligatorios." });
      return;
    }
    setGuardando(true);
    try {
      const soloNumeros = telefono.replace(/\D/g, "");
      await actualizarCentro(centro.id, { nombre, direccion, comuna, telefono: soloNumeros ? `56${soloNumeros}` : "" });
      setAviso({ ok: true, texto: "Cambios guardados." });
      onGuardado();
    } catch (err) {
      setAviso({ ok: false, texto: err instanceof Error ? err.message : "No se pudieron guardar los cambios." });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Tarjeta titulo="Datos del centro">
      <form onSubmit={guardar} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 500 }}>
          Nombre
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} style={inputStyle} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 500 }}>
          Dirección
          <input value={direccion} onChange={(e) => setDireccion(e.target.value)} style={inputStyle} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 500 }}>
          Comuna
          <input value={comuna} onChange={(e) => setComuna(e.target.value)} style={inputStyle} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 500 }}>
          Teléfono (+56)
          <input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="2 2345 6789" style={inputStyle} />
        </label>

        <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
          {aviso && <span style={{ fontSize: 13, color: aviso.ok ? colors.accent : ROJO }}>{aviso.texto}</span>}
          <button type="submit" disabled={guardando} style={{ padding: "9px 16px", borderRadius: 8, border: "none", background: colors.accent, color: "white", fontWeight: 600, cursor: "pointer", opacity: guardando ? 0.6 : 1 }}>
            {guardando ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </form>
    </Tarjeta>
  );
};

// ---------------------------------------------------------------------
// Equipo: veterinarios y administradores del centro
// ---------------------------------------------------------------------
const SeccionEquipo = ({ centroId }: { centroId: number }) => {
  const { datos: equipo = [], cargando, error } = useConsulta(() => getEquipoCentro(centroId), [centroId]);

  return (
    <>
      <h1 style={{ margin: "0 0 4px", fontSize: 21, fontWeight: 700 }}>Equipo</h1>
      <p style={{ margin: "0 0 18px", fontSize: 13.5, color: colors.textMuted }}>
        Veterinarios y administradores de este centro. Para sumar o quitar personas, contacta a un superadmin.
      </p>
      <div style={{ background: "white", border: `1px solid ${colors.border}`, borderRadius: 12, overflow: "hidden" }}>
        {cargando && <p style={{ padding: 18, margin: 0, color: colors.textMuted }}>Cargando…</p>}
        {error && <p style={{ padding: 18, margin: 0, color: ROJO }}>{error}</p>}
        {!cargando && !error && equipo.length === 0 && (
          <p style={{ padding: 18, margin: 0, color: colors.textMuted, textAlign: "center" }}>Este centro todavía no tiene equipo asignado.</p>
        )}
        {equipo.map((m, i) => (
          <div key={`${m.tipo}-${m.perfilId ?? i}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px", borderTop: i === 0 ? "none" : `1px solid ${colors.border}` }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>{m.nombre}</span>
              <span style={{ fontSize: 12, color: colors.textMuted }}>{m.detalle}</span>
            </div>
            <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: m.tipo === "veterinario" ? colors.accentSoft : "#f3eefe", color: m.tipo === "veterinario" ? colors.accent : "#6b3fb8" }}>
              {m.tipo === "veterinario" ? "Veterinario" : "Admin"}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

// ---------------------------------------------------------------------
// Citas del centro
// ---------------------------------------------------------------------
const SeccionCitas = ({ centroId }: { centroId: number }) => {
  const { datos: citas = [], cargando, error } = useConsulta(() => getCitasCentro(centroId), [centroId]);
  const columnas = "1.5fr 1.3fr 1.6fr 1fr 1fr 1fr";

  return (
    <>
      <h1 style={{ margin: "0 0 18px", fontSize: 21, fontWeight: 700 }}>Citas del centro</h1>
      <div style={{ background: "white", border: `1px solid ${colors.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: columnas, gap: 12, padding: "10px 18px", background: FONDO, fontSize: 11.5, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase" }}>
          <span>Mascota / Dueño</span>
          <span>Veterinario</span>
          <span>Motivo</span>
          <span>Fecha/Hora</span>
          <span>Estado</span>
          <span>Urgencia</span>
        </div>
        {cargando && <p style={{ padding: 18, margin: 0, color: colors.textMuted }}>Cargando…</p>}
        {error && <p style={{ padding: 18, margin: 0, color: ROJO }}>{error}</p>}
        {!cargando && !error && citas.length === 0 && (
          <p style={{ padding: 18, margin: 0, color: colors.textMuted, textAlign: "center" }}>Todavía no hay citas en este centro.</p>
        )}
        {citas.map((c) => (
          <div key={c.id} style={{ display: "grid", gridTemplateColumns: columnas, gap: 12, alignItems: "center", padding: "12px 18px", borderTop: `1px solid ${colors.border}`, fontSize: 13 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 600 }}>{c.mascota}</span>
              <span style={{ fontSize: 12, color: colors.textMuted }}>{c.dueno}</span>
            </div>
            <span style={{ color: colors.textMuted }}>{c.veterinario}</span>
            <span style={{ color: colors.textMuted }}>{c.motivo}</span>
            <span style={{ color: colors.textMuted }}>{c.fechaHora}</span>
            <span style={Badge(badgeStyles[c.estado])}>{ESTADO_LABEL[c.estado]}</span>
            <span style={Badge(badgeStyles[c.urgencia])}>{URGENCIA_LABEL[c.urgencia]}</span>
          </div>
        ))}
      </div>
    </>
  );
};
