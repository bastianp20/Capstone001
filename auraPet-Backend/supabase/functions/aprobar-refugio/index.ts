// Aprueba un refugio que postuló SIN cuenta desde "Súmate a AuraPet" (migración 48).
// Solo la puede usar un superadmin.
//   · Si el correo de la postulación ya tiene cuenta → esa cuenta queda como administradora.
//   · Si no → se crea la cuenta (dueño) con una invitación por correo para que elija
//     su contraseña, y queda como administradora.
// La lógica de la base (mundo prueba/real, que siga pendiente) vive en
// vincular_postulacion_refugio; la service_role solo se usa para invitar.
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

  // ¿Quien llama es superadmin? (todo lo de la base se hace con su sesión)
  const comoUsuario = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const { data: { user } } = await comoUsuario.auth.getUser();
  if (!user) return responder({ error: "Debes iniciar sesión." }, 401);
  const { data: esSuper } = await comoUsuario.rpc("es_superadmin");
  if (!esSuper) return responder({ error: "Solo un superadmin puede aprobar refugios." }, 403);

  // redirigir: la página donde la persona elige su contraseña (la manda la web)
  const { refugioId, redirigir } = await req.json();
  if (!Number.isInteger(refugioId)) return responder({ error: "Falta el refugio." }, 400);

  const { data: refugio, error: errorRefugio } = await comoUsuario
    .from("refugios")
    .select("id, estado_verificacion, correo_acceso, responsable, telefono")
    .eq("id", refugioId)
    .single();
  if (errorRefugio || !refugio) return responder({ error: "Ese refugio no existe." }, 404);
  if (refugio.estado_verificacion !== "pendiente" || !refugio.correo_acceso) {
    return responder({ error: "Esa postulación no está pendiente o ya tiene cuenta." }, 400);
  }

  // ¿Ya tiene cuenta?
  const { data: cuentas, error: errorCuenta } = await comoUsuario.rpc("cuenta_por_correo", { p_correo: refugio.correo_acceso });
  if (errorCuenta) return responder({ error: errorCuenta.message }, 400);

  let perfilId: string = cuentas?.[0]?.id;
  let invitada = false;

  if (!perfilId) {
    // Cuenta nueva: el trigger arma el perfil (rol dueño) con estos metadatos
    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: invitacion, error } = await admin.auth.admin.inviteUserByEmail(refugio.correo_acceso, {
      data: { nombre: refugio.responsable ?? undefined, telefono: refugio.telefono ? String(refugio.telefono) : undefined },
      redirectTo: typeof redirigir === "string" ? redirigir : undefined,
    });
    if (error || !invitacion.user) return responder({ error: error?.message ?? "No se pudo enviar la invitación." }, 400);
    perfilId = invitacion.user.id;
    invitada = true;

    const { error: errorVincular } = await comoUsuario.rpc("vincular_postulacion_refugio", { p_refugio_id: refugioId, p_perfil_id: perfilId });
    if (errorVincular) {
      await admin.auth.admin.deleteUser(perfilId); // no dejar la cuenta a medias
      return responder({ error: errorVincular.message }, 400);
    }
  } else {
    const { error: errorVincular } = await comoUsuario.rpc("vincular_postulacion_refugio", { p_refugio_id: refugioId, p_perfil_id: perfilId });
    if (errorVincular) return responder({ error: errorVincular.message }, 400);
  }

  return responder({ ok: true, invitada, correo: refugio.correo_acceso });
});
