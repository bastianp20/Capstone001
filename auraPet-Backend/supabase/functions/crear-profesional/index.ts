// Crea una cuenta de veterinario. Solo la puede usar un superadmin.
import { createClient } from "@supabase/supabase-js";

// Permisos para que el localHost pueda llamar a la función
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const responder = (cuerpo: unknown, status = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  // El navegador primero "pregunta" si puede llamar (OPTIONS)
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const url = Deno.env.get("SUPABASE_URL")!;

  // 1) ¿Quién está llamando? Cliente con el token de esa persona.
  const comoUsuario = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const { data: { user } } = await comoUsuario.auth.getUser();
  if (!user) return responder({ error: "Debes iniciar sesión." }, 401);

  const { data: esSuper } = await comoUsuario.rpc("es_superadmin");
  if (!esSuper) return responder({ error: "Solo un superadmin puede crear profesionales." }, 403);

  // 2) Datos que mandó el modal
  const { nombre, correo, telefono, numeroColegiado, especialidadId, centroId, esAdminCentro } =
    await req.json();
  if (!nombre?.trim() || !correo?.trim() || !centroId) {
    return responder({ error: "Faltan nombre, correo o centro." }, 400);
  }

  // 3) Cliente "admin" con la clave secreta (solo existe aquí, nunca en el front)
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const contrasenaTemporal = crypto.randomUUID().slice(0, 12);

  // Crea la cuenta. El trigger crear_perfil_nuevo_usuario arma el perfil
  // con nombre, rol 'veterinario' y teléfono desde estos metadatos.
  const { data: creado, error: errorCuenta } = await admin.auth.admin.createUser({
    email: correo.trim(),
    password: contrasenaTemporal,
    email_confirm: true, // sin correo de confirmación
    user_metadata: { nombre: nombre.trim(), rol: "veterinario", telefono },
  });
  if (errorCuenta) {
    const yaExiste = errorCuenta.message.toLowerCase().includes("already");
    return responder({ error: yaExiste ? "Ya existe una cuenta con ese correo." : errorCuenta.message }, 400);
  }
  const perfilId = creado.user.id;

  // 4) Ficha de veterinario, centro y (opcional) admin del centro
  try {
    const { data: vet, error: e1 } = await admin
      .from("veterinarios")
      .insert({
        perfil_id: perfilId,
        especialidad_id: especialidadId ?? null,
        numero_colegiado: numeroColegiado?.trim() || null, // vacío → null (no "")
        estado_verificacion: "aprobado", // lo crea el superadmin: ya viene aprobado
        revisado_por: user.id,
        revisado_en: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (e1) throw e1;

    const { error: e2 } = await admin
      .from("veterinario_centros")
      .insert({ veterinario_id: vet.id, centro_id: centroId });
    if (e2) throw e2;

    if (esAdminCentro) {
      const { error: e3 } = await admin
        .from("admins_centro")
        .insert({ centro_id: centroId, perfil_id: perfilId, asignado_por: user.id });
      if (e3) throw e3;
    }
  } catch (e) {
    // Si algo falló a medio camino, deshacemos todo para no dejar cuentas a medias
    await admin.from("veterinarios").delete().eq("perfil_id", perfilId);
    await admin.auth.admin.deleteUser(perfilId);
    const err = e as { code?: string; message?: string };
    const mensaje = err.code === "23505"
      ? "Ese número de colegiatura ya está registrado."
      : err.message ?? "No se pudo guardar el profesional.";
    return responder({ error: mensaje }, 400);
  }

  return responder({ ok: true, contrasenaTemporal });
});