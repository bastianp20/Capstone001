import { useEffect, useState, type FormEvent } from "react";
import { MS_AVISO_GUARDADO, TEXTOS_CENTRO_ADMIN as T } from "../../constants";
import { actualizarCentro } from "../../Api/postInfo";
import { useAccion } from "../../hooks/useAccion";
import type { FormularioCentroProps } from "../../interfaces";
import { Boton } from "../ui/Boton";
import { TarjetaCentro } from "./TarjetaCentro";
import styles from "../../css/centroAdmin/PanelCentro.module.css";

// Datos editables del centro (nombre, dirección, comuna, teléfono).
export const FormularioCentro = ({ centro, onGuardado }: FormularioCentroProps) => {
  const [nombre, setNombre] = useState(centro.nombre);
  const [direccion, setDireccion] = useState(centro.direccion);
  const [comuna, setComuna] = useState(centro.comuna);
  // El teléfono se guarda como 56912345678; en el input se muestra sin el 56
  const [telefono, setTelefono] = useState(centro.telefono ? String(centro.telefono).replace(/^56/, "") : "");
  const [faltan, setFaltan] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const { ejecutar, ocupado, error } = useAccion();

  // El aviso de "guardado" se borra solo después de unos segundos
  useEffect(() => {
    if (!guardado) return;
    const t = setTimeout(() => setGuardado(false), MS_AVISO_GUARDADO);
    return () => clearTimeout(t);
  }, [guardado]);

  const guardar = async (e: FormEvent) => {
    e.preventDefault();
    const incompleto = !nombre.trim() || !direccion.trim() || !comuna.trim();
    setFaltan(incompleto);
    if (incompleto) return;
    const soloNumeros = telefono.replace(/\D/g, "");
    const ok = await ejecutar(
      () => actualizarCentro(centro.id, { nombre, direccion, comuna, telefono: soloNumeros ? `56${soloNumeros}` : "" }),
      "No se pudieron guardar los cambios."
    );
    if (ok) {
      setGuardado(true);
      onGuardado();
    }
  };

  const mensaje = faltan ? T.obligatorios : error;

  return (
    <TarjetaCentro titulo={T.datosCentro}>
      <form onSubmit={guardar} className={styles.formulario}>
        <label className={styles.campo}>
          Nombre
          <input className={styles.control} value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label>
        <label className={styles.campo}>
          Dirección
          <input className={styles.control} value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        </label>
        <label className={styles.campo}>
          Comuna
          <input className={styles.control} value={comuna} onChange={(e) => setComuna(e.target.value)} />
        </label>
        <label className={styles.campo}>
          Teléfono (+56)
          <input className={styles.control} value={telefono} onChange={(e) => setTelefono(e.target.value)}
            placeholder="2 2345 6789" inputMode="tel" />
        </label>

        <div className={styles.formularioPie}>
          {mensaje && <span className={styles.error} role="alert">{mensaje}</span>}
          {guardado && <span className={styles.ok} role="status">{T.guardado}</span>}
          <Boton type="submit" cargando={ocupado}>{ocupado ? T.guardando : T.guardar}</Boton>
        </div>
      </form>
    </TarjetaCentro>
  );
};
