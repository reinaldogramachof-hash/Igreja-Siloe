// OPS-01 homologacao — Edge Function descartavel.
// Prova: deploy + invocacao autenticada de function; falha sem sessao.
// Deploy: dashboard -> Edge Functions -> Deploy a new function (ou `supabase
// functions deploy homolog-echo`). Manter "Verify JWT" LIGADO (padrao).
// Remover no aceite da OPS-01.

import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "missing Authorization" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return new Response(
      JSON.stringify({ error: "invalid session" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  const body = await req.json().catch(() => ({}));
  return new Response(
    JSON.stringify({ echo: body, user_id: user.id, at: new Date().toISOString() }),
    { headers: { "Content-Type": "application/json" } },
  );
});
