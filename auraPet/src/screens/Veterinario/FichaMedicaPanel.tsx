// ============================================================
// Panel lateral "Ficha Médica" — se abre al presionar
// "Registrar Diagnóstico" en la fila de una cita en curso.
//
// SOLO VISUAL por ahora: no tiene useState ni onSubmit real, y no
// está montado dentro de VeterinarioScreen.tsx todavía — impórtalo
// y renderízalo cuando quieras conectar el clic real del botón
// "Registrar Diagnóstico" (típicamente con un estado tipo
// `citaSeleccionada` en VeterinarioScreen, igual que hicimos con
// `solicitudARechazar` en el SuperAdmin).
// ============================================================

const colors = {
  border: "#e2e2e2",
  text: "#1f2420",
  textMuted: "#70706f",
  primary: "#3b6fa8",
  disabledBg: "#f2f2f2",
  disabledText: "#a3a3a3",
};

interface FichaMedicaPanelProps {
  nombreMascota: string;
  motivoConsulta: string;
}

export const FichaMedicaPanel = ({ nombreMascota, motivoConsulta }: FichaMedicaPanelProps) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: 460,
        background: "white",
        borderLeft: `1px solid ${colors.border}`,
        boxShadow: "-8px 0 30px rgba(0,0,0,0.12)",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: `1px solid ${colors.border}` }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Ficha Médica: {nombreMascota}</h2>
        <button style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: colors.textMuted }}>×</button>
      </div>

      {/* Contenido (scrollable) */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: colors.textMuted }}>{motivoConsulta}</span>

        <textarea
          readOnly
          rows={4}
          placeholder="Diagnóstico: Describa el diagnóstico principal, signos clínicos y observaciones. Ej: Gastroenteritis hemorrágica, deshidratación…"
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: `1px solid ${colors.border}`,
            fontFamily: "inherit",
            fontSize: 13.5,
            resize: "vertical",
            color: colors.textMuted,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontSize: 14.5, fontWeight: 700 }}>Tratamiento y Receta</span>

          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1.3fr", gap: 8, fontSize: 11.5, fontWeight: 600, color: colors.textMuted }}>
            <span>Medicamento</span>
            <span>Dosis</span>
            <span>Frecuencia/Duración</span>
          </div>

          {["Metronidazol", "Suero Ringer"].map((medicamento) => (
            <div key={medicamento} style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1.3fr", gap: 8 }}>
              <select disabled style={{ padding: "8px 10px", borderRadius: 8, border: `1px solid ${colors.border}`, fontSize: 13 }}>
                <option>{medicamento}</option>
              </select>
              <input disabled placeholder="Dosis" style={{ padding: "8px 10px", borderRadius: 8, border: `1px solid ${colors.border}`, fontSize: 13 }} />
              <input disabled placeholder="Frecuencia/Duración" style={{ padding: "8px 10px", borderRadius: 8, border: `1px solid ${colors.border}`, fontSize: 13 }} />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 6, borderTop: `1px solid ${colors.border}` }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600 }}>
            <input type="checkbox" disabled />
            Derivación requerida
          </label>

          <select
            disabled
            style={{
              padding: "9px 10px",
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
              fontSize: 13,
              background: colors.disabledBg,
              color: colors.disabledText,
            }}
          >
            <option>Clínica de Destino (para exámenes)</option>
          </select>

          <textarea
            disabled
            rows={2}
            placeholder="Motivo de Derivación"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
              fontFamily: "inherit",
              fontSize: 13,
              background: colors.disabledBg,
              color: colors.disabledText,
              resize: "vertical",
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", gap: 10, padding: "16px 24px", borderTop: `1px solid ${colors.border}` }}>
        <button
          style={{
            flex: 1,
            padding: "11px 14px",
            borderRadius: 9,
            border: `1px solid ${colors.border}`,
            background: "white",
            fontSize: 13.5,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Finalizar Cita (sin derivación)
        </button>
        <button
          style={{
            flex: 1,
            padding: "11px 14px",
            borderRadius: 9,
            border: "none",
            background: colors.primary,
            color: "white",
            fontSize: 13.5,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Completar Cita y Guardar Ficha
        </button>
      </div>
    </div>
  );
};
