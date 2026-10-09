// Crea una cuenta de dueño de mascota. Solo la puede usar un superadmin.
import { createClient } from "@supabase/supabase-js";


// una rcp es una funcion remota que se ejecuta en la base de datos, en este caso es para saber si el usuario que está creando el dueño es efectivamente un superadmin

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

  // el q llama es un superAdmin?
  const comoUsuario = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const { data: { user } } = await comoUsuario.auth.getUser();
  if (!user) return responder({ error: "Debes iniciar sesión." }, 401);

  const { data: esSuper } = await comoUsuario.rpc("es_superadmin");
  if (!esSuper) return responder({ error: "Solo un superadmin puede crear dueños." }, 403);

  // y esto es pal Modal que crea al dueño
  const { nombre, correo, telefono } = await req.json();
  if (!nombre?.trim() || !correo?.trim()) {
    return responder({ error: "Faltan nombre o correo." }, 400);
  }

  // Crear la cuenta. El trigger arma el perfil con rol 'dueno'
  // (es el rol por defecto: no mandamos 'rol' en los metadatos).
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const contrasenaTemporal = crypto.randomUUID().slice(0, 12);

  const { error } = await admin.auth.admin.createUser({
    email: correo.trim(),
    password: contrasenaTemporal,
    email_confirm: true,
    user_metadata: { nombre: nombre.trim(), telefono },
  });
  if (error) {
    const yaExiste = error.message.toLowerCase().includes("already");
    return responder({ error: yaExiste ? "Ya existe una cuenta con ese correo." : error.message }, 400);
  }

  return responder({ ok: true, contrasenaTemporal });
});