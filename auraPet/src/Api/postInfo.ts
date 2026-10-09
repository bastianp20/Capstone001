// aquí van las acciones que CREAN o CAMBIAN datos en la base (los "POST").
import type { DatosNuevaMascota, DatosNuevoDueno, DatosNuevoProfesional } from "../interfaces";
import { supabase } from "../lib/supabase";


// Crea un veterinario llamando a la edge Function "crear-profesional" que está en la base de datos. la función se encarga de generar la contraseña temporal y 
// de crear el registro en la tabla veterinarios. la función devuelve la contraseña temporal para que el superAdmin pueda mostrarsela al usuario
// supabase-js manda solo el token del superadmin conectado; la función
// revisa que sea superadmin antes de crear nada, ya que solo el superAdmin PUEDE CREAR UN PROFESIONAL
// luegos los mismos veterinarios pueden crear sus propias cuentas, pero no pueden crear otras cuentas de veterinarios ni de centro
// ese trabajo es exclusivo del superAdmin.
export const crearProfesional = async (datos: DatosNuevoProfesional) => {
  const { data, error } = await supabase.functions.invoke<{ ok: boolean; contrasenaTemporal: string }>(
    "crear-profesional",
    { body: datos }
  );

  if (error) {
    // El mensaje real que mandó la función viene dentro de error.context
    const detalle = await error.context?.json?.().catch(() => null);
    throw new Error(detalle?.error ?? "No se pudo crear el profesional.");
  }
  return data!;
};


// CREAR DUEÑO (SOLO EL SUPERADMIN PUEDE HACERLO) 
export const crearDueno = async (datos: DatosNuevoDueno) => {
  const { data, error } = await supabase.functions.invoke<{ ok: boolean; contrasenaTemporal: string }>(
    "crear-dueno",
    { body: datos }
  );
  if (error) {
    const detalle = await error.context?.json?.().catch(() => null);
    throw new Error(detalle?.error ?? "No se pudo crear el dueño.");
  }
  return data!;
};

// Crear Mascota (ésto el dueño puede hacerlo) 
export const crearMascota = async (duenoId: string, datos: DatosNuevaMascota) => {
  const { error } = await supabase.from("mascotas").insert({
    dueno_id: duenoId,
    nombre: datos.nombre.trim(),
    especie: datos.especie,
    sexo: datos.sexo,
    raza: datos.raza.trim() || null,               // vacío → null
    fecha_nacimiento: datos.fechaNacimiento || null,
    peso_kg: datos.pesoKg ? Number(datos.pesoKg) : null,
    esterilizado: datos.esterilizado,
  });
  if (error) throw new Error("No se pudo registrar la mascota.");
};
