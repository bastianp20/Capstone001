// Crea una cuenta "administrativo" y la deja como admin de un centro.
// Solo la puede usar un superadmin.
import { createClient } from "@supabase/supabase-js";

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
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const url = Deno.env.get("SUPABASE_URL")!;

  // 1. ¿Quien llama es superadmin?
  const comoUsuario = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const { data: { user } } = await comoUsuario.auth.getUser();
  if (!user) return responder({ error: "Debes iniciar sesión." }, 401);

  const { data: esSuper } = await comoUsuario.rpc("es_superadmin");
  if (!esSuper) return responder({ error: "Solo un superadmin puede crear cuentas administrativas." }, 403);

  const { nombre, correo, telefono, centroId, esPrueba } = await req.json();
  if (!nombre?.trim() || !correo?.trim() || !centroId) {
    return responder({ error: "Faltan nombre, correo o centro." }, 400);
  }

  // 2. Crear la cuenta (el trigger la arma como 'dueno')
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const contrasenaTemporal = crypto.randomUUID().slice(0, 12);

  const { data: creado, error } = await admin.auth.admin.createUser({
    email: correo.trim(),
    password: contrasenaTemporal,
    email_confirm: true,
    user_metadata: { nombre: nombre.trim(), telefono },
  });
  if (error || !creado.user) {
    const yaExiste = error?.message.toLowerCase().includes("already");
    return responder({ error: yaExiste ? "Ya existe una cuenta con ese correo." : error?.message ?? "No se pudo crear la cuenta." }, 400);
  }
  const nuevoId = creado.user.id;

  // 3. Rol (y marca de prueba) + cargo, con la sesión del superadmin: la base vuelve a revisar sus reglas.
  //    La marca de prueba va antes del cargo: la base solo deja cuentas de prueba en centros de prueba.
  const { data: conRol, error: errorRol } = await comoUsuario
    .from("perfiles")
    .update({ rol: "administrativo", es_prueba: Boolean(esPrueba) })
    .eq("id", nuevoId)
    .select("id");

  const { error: errorCargo } = await comoUsuario
    .from("admins_centro")
    .insert({ centro_id: centroId, perfil_id: nuevoId, asignado_por: user.id });

  // Si algo falló, se borra la cuenta para no dejarla a medias
  if (errorRol || !conRol?.length || errorCargo) {
    await admin.auth.admin.deleteUser(nuevoId);
    return responder({ error: "No se pudo asignar el rol o el centro." }, 500);
  }

  return responder({ ok: true, contrasenaTemporal });
});
