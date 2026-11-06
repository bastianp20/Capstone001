// Crea una cuenta de superadmin. Solo la puede usar otro superadmin.
// Igual que crear-dueno, pero con un paso extra: la base arma toda cuenta
// nueva como 'dueno', y aquí la subimos a 'superadmin'.
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
  if (!esSuper) return responder({ error: "Solo un superadmin puede crear superadmins." }, 403);

  const { nombre, correo, telefono } = await req.json();
  if (!nombre?.trim() || !correo?.trim()) {
    return responder({ error: "Faltan nombre o correo." }, 400);
  }

  // 2. Crear la cuenta con la clave secreta. El trigger la arma como 'dueno'.
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

  // 3. Subirla a superadmin con la sesión de QUIEN LLAMA (no con la clave secreta),
  //    así la base vuelve a revisar con sus reglas (RLS + trigger proteger_cambio_de_rol).
  const { data: actualizado, error: errorRol } = await comoUsuario
    .from("perfiles")
    .update({ rol: "superadmin" })
    .eq("id", creado.user.id)
    .select("id");

  // Si no se pudo cambiar el rol, borramos la cuenta para no dejar un dueño "huérfano".
  if (errorRol || !actualizado?.length) {
    await admin.auth.admin.deleteUser(creado.user.id);
    return responder({ error: "No se pudo asignar el rol de superadmin." }, 500);
  }

  return responder({ ok: true, contrasenaTemporal });
});
