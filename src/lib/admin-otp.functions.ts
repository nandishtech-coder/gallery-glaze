import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SENDER = "contactnandishtech@gmail.com";

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

function sessionIdOf(claims: Record<string, unknown>) {
  const sid = claims["session_id"];
  console.log("OTP claims keys", Object.keys(claims));
  if (typeof sid === "string" && sid) return sid;
  if (claims["sub"] && claims["iat"]) return `${claims["sub"]}:${claims["iat"]}`;
  throw new Error("Invalid session " + Object.keys(claims).join(","));
}

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!data) throw new Error("Only admins can sign in here.");
}

export const requestAdminOtp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId, claims } = context;
    await assertAdmin(supabase, userId);
    const email = (claims as any).email as string | undefined;
    if (!email) throw new Error("No email on account");
    const sid = sessionIdOf(claims as any);

    const pass = process.env["GMAIL_APP_PASSWORD"];
    if (!pass) throw new Error("Email sending is not configured");

    const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, "0");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("admin_login_otps").delete().eq("session_id", sid);
    const { error } = await supabaseAdmin.from("admin_login_otps").insert({
      user_id: userId,
      session_id: sid,
      code_hash: await sha256(code + sid),
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });
    if (error) throw new Error("Could not create code");

    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: SENDER, pass: pass.replace(/\s+/g, "") },
    });
    try {
      await transporter.sendMail({
        from: `"NANDISH-TECH" <${SENDER}>`,
        to: email,
        subject: `Your admin login code: ${code}`,
        text: `Your NANDISH-TECH admin login code is ${code}. It expires in 10 minutes. If you didn't try to sign in, please change your password.`,
        html: `<div style="font-family:Arial,sans-serif;padding:24px;background:#ffffff"><h2 style="margin:0 0 12px">NANDISH-TECH Admin Login</h2><p>Your one-time login code is:</p><p style="font-size:32px;letter-spacing:8px;font-weight:bold;margin:16px 0">${code}</p><p style="color:#666">This code expires in 10 minutes. If you didn't try to sign in, please change your password.</p></div>`,
      });
    } catch (e) {
      console.error("OTP email failed", e);
      throw new Error("Could not send the code email. Please try again.");
    }
    return { sentTo: email };
  });

export const verifyAdminOtp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { code: string }) => {
    if (!/^\d{6}$/.test(d?.code ?? "")) throw new Error("Enter the 6-digit code");
    return d;
  })
  .handler(async ({ data, context }) => {
    const sid = sessionIdOf(context.claims as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("admin_login_otps")
      .select("*")
      .eq("session_id", sid)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!row) throw new Error("No code requested. Please resend.");
    if (new Date(row.expires_at).getTime() < Date.now()) throw new Error("Code expired. Please resend.");
    if (row.attempts >= 5) throw new Error("Too many attempts. Please resend a new code.");
    if ((await sha256(data.code + sid)) !== row.code_hash) {
      await supabaseAdmin.from("admin_login_otps").update({ attempts: row.attempts + 1 }).eq("id", row.id);
      throw new Error("Incorrect code");
    }
    await supabaseAdmin
      .from("admin_login_otps")
      .update({ verified: true, expires_at: new Date(Date.now() + 12 * 3600 * 1000).toISOString() })
      .eq("id", row.id);
    return { ok: true };
  });

export const checkAdminOtp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sid = sessionIdOf(context.claims as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("admin_login_otps")
      .select("verified, expires_at")
      .eq("session_id", sid)
      .eq("user_id", context.userId)
      .maybeSingle();
    return { verified: !!row?.verified && new Date(row.expires_at).getTime() > Date.now() };
  });
