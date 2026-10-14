import { useState, type FormEvent } from "react";
import styles from "../css/modal/CrearProfesionalModal.module.css"; // mismo diseño que los otros modales de crear
import type { CrearCentroModalProps, HorarioCentroNuevo } from "../interfaces";
import { useConsulta } from "../hooks/useConsulta";
import { getEspecialidades } from "../Api/getInfo";
import { crearCentro } from "../Api/postInfo";

// Un día del formulario de horarios
interface DiaFormulario {
  dia: number;           // 1 = lunes ... 7 = domingo
  nombre: string;
  atiende: boolean;
  abre: string;
  cierra: string;
  conColacion: boolean;
  inicioColacion: string;
  finColacion: string;
}

// Valores por defecto: lunes a viernes 9 a 19 con colación, sábado 10 a 14, domingo cerrado
const DIAS_INICIALES: DiaFormulario[] = [
  "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo",
].map((nombre, i) => ({
  dia: i + 1,
  nombre,
  atiende: i < 6,
  abre: i === 5 ? "10:00" : "09:00",
  cierra: i === 5 ? "14:00" : "19:00",
  conColacion: i < 5,
  inicioColacion: "14:00",
  finColacion: "15:00",
}));

export const ModalCrearCentro = ({ onClose }: CrearCentroModalProps) => {
  const { datos: especialidades = [] } = useConsulta(() => getEspecialidades(), []);

  // Campos del formulario
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [telefono, setTelefono] = useState("");
  const [especialidadIds, setEspecialidadIds] = useState<number[]>([]); // un centro puede tener varias
  const [dias, setDias] = useState<DiaFormulario[]>(DIAS_INICIALES);
  const [esPrueba, setEsPrueba] = useState(false);

  // Estado del envío
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creado, setCreado] = useState(false);

  const cambiarDia = (dia: number, cambios: Partial<DiaFormulario>) =>
    setDias((actuales) => actuales.map((d) => (d.dia === dia ? { ...d, ...cambios } : d)));

  const alternarEspecialidad = (id: number) =>
    setEspecialidadIds((actuales) =>
      actuales.includes(id) ? actuales.filter((e) => e !== id) : [...actuales, id]
    );

  // Revisa los horarios antes de mandarlos (la base igual los vuelve a revisar)
  const validarHorarios = (): string | null => {
    const abiertos = dias.filter((d) => d.atiende);
    if (abiertos.length === 0) return "Marca al menos un día de atención.";
    for (const d of abiertos) {
      if (!d.abre || !d.cierra || d.cierra <= d.abre) {
        return `${d.nombre}: la hora de cierre debe ser después de la de apertura.`;
      }
      if (d.conColacion) {
        const ok = d.abre < d.inicioColacion && d.inicioColacion < d.finColacion && d.finColacion < d.cierra;
        if (!ok) return `${d.nombre}: la colación debe quedar dentro del horario de atención.`;
      }
    }
    return null;
  };

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !direccion.trim() || !comuna.trim()) {
      setError("Completa nombre, dirección y comuna.");
      return;
    }
    const errorHorario = validarHorarios();
    if (errorHorario) {
      setError(errorHorario);
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      const horarios: HorarioCentroNuevo[] = dias
        .filter((d) => d.atiende)
        .map((d) => ({
          dia_semana: d.dia,
          abre: d.abre,
          cierra: d.cierra,
          inicio_colacion: d.conColacion ? d.inicioColacion : null,
          fin_colacion: d.conColacion ? d.finColacion : null,
        }));
      const soloNumeros = telefono.replace(/\D/g, ""); // "2 2345 6789" → "223456789"
      await crearCentro({
        nombre,
        direccion,
        comuna,
        telefono: soloNumeros ? `56${soloNumeros}` : "",
        esPrueba,
        horarios,
        especialidadIds,
      });
      setCreado(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el centro.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.fondo} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Agregar centro</h2>
          <button className={styles.cerrar} onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {creado ? (
          // ---------- Pantalla de éxito ----------
          <div className={styles.exito}>
            <p>✅ Centro <strong>{nombre}</strong> creado y aprobado.</p>
            <p>
              Para asignarle un administrador, crea una cuenta profesional en este centro y marca
              "Hacer administrador del centro".
            </p>
            <div className={styles.acciones}>
              <button type="button" className={styles.enviar} onClick={onClose}>Listo</button>
            </div>
          </div>
        ) : (
          // ---------- Formulario ----------
          <form className={styles.grid} onSubmit={enviar}>
            <label className={`${styles.campo} ${styles.completo}`}>
              Nombre del centro
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </label>

            <label className={styles.campo}>
              Dirección
              <input
                type="text"
                placeholder="Av. Siempre Viva 123"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </label>

            <label className={styles.campo}>
              Comuna
              <input type="text" value={comuna} onChange={(e) => setComuna(e.target.value)} />
            </label>

            <label className={styles.campo}>
              Teléfono (opcional)
              <div className={styles.telefono}>
                <span>+56</span>
                <input
                  type="tel"
                  placeholder="2 2345 6789"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
            </label>

            <div className={`${styles.campo} ${styles.completo}`}>
              Especialidades
              <div className={styles.chips}>
                {especialidades.map((esp) => (
                  <button
                    key={esp.id}
                    type="button"
                    className={especialidadIds.includes(esp.id) ? styles.chipActivo : styles.chip}
                    onClick={() => alternarEspecialidad(esp.id)}
                  >
                    {esp.nombre}
                  </button>
                ))}
              </div>
            </div>

            <div className={`${styles.campo} ${styles.completo}`}>
              Horario de atención
              <div className={styles.horarios}>
                {dias.map((d) => (
                  <div key={d.dia} className={d.atiende ? styles.dia : styles.diaCerrado}>
                    <label className={styles.check}>
                      <input
                        type="checkbox"
                        checked={d.atiende}
                        onChange={(e) => cambiarDia(d.dia, { atiende: e.target.checked })}
                      />
                      {d.nombre}
                    </label>

                    {d.atiende ? (
                      <div className={styles.horas}>
                        <input type="time" value={d.abre} onChange={(e) => cambiarDia(d.dia, { abre: e.target.value })} />
                        a
                        <input type="time" value={d.cierra} onChange={(e) => cambiarDia(d.dia, { cierra: e.target.value })} />

                        <label className={styles.colacion}>
                          <input
                            type="checkbox"
                            checked={d.conColacion}
                            onChange={(e) => cambiarDia(d.dia, { conColacion: e.target.checked })}
                          />
                          Colación
                        </label>

                        {d.conColacion && (
                          <>
                            <input
                              type="time"
                              value={d.inicioColacion}
                              onChange={(e) => cambiarDia(d.dia, { inicioColacion: e.target.value })}
                            />
                            a
                            <input
                              type="time"
                              value={d.finColacion}
                              onChange={(e) => cambiarDia(d.dia, { finColacion: e.target.value })}
                            />
                          </>
                        )}
                      </div>
                    ) : (
                      <span className={styles.horas}>Cerrado</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <label className={`${styles.check} ${styles.completo}`}>
              <input type="checkbox" checked={esPrueba} onChange={(e) => setEsPrueba(e.target.checked)} />
              Centro de pruebas (no aparece para el público)
            </label>

            {error && <p className={`${styles.error} ${styles.completo}`}>{error}</p>}

            <div className={`${styles.acciones} ${styles.completo}`}>
              <button type="button" className={styles.cancelar} onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className={styles.enviar} disabled={enviando}>
                {enviando ? "Creando…" : "Crear centro"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
