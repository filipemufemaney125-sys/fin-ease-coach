import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { name, email, message } = await req.json();
    const n = String(name || "").trim();
    const e = String(email || "").trim().toLowerCase();
    const m = String(message || "").trim();
    if (!n || n.length > 200) return bad("Invalid name");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e) || e.length > 320) return bad("Invalid email");
    if (!m || m.length > 5000) return bad("Invalid message");
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { error } = await supabase.from("contact_messages").insert({ name: n, email: e, message: m });
    if (error) {
      console.error(error);
      return bad("Could not send message", 500);
    }
    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch {
    return bad("Bad request");
  }
  function bad(error: string, status = 400) {
    return new Response(JSON.stringify({ error }), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});