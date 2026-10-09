import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { LogIn, Sparkles, Loader2, ShieldCheck } from "lucide-react";
import { requestAdminOtp, verifyAdminOtp, checkAdminOtp } from "@/lib/admin-otp.functions";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — NANDISH-TECH" },
      { name: "description", content: "Secure admin sign in with email code verification." },
      { property: "og:title", content: "Admin Sign In — NANDISH-TECH" },
      { property: "og:description", content: "Secure admin sign in with email code verification." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const sendOtp = useServerFn(requestAdminOtp);
  const verifyOtp = useServerFn(verifyAdminOtp);
  const checkOtp = useServerFn(checkAdminOtp);
  const [mode, setMode] = useState<"signin" | "signup" | "otp">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading || !user || mode === "otp") return;
    checkOtp().then((r) => {
      if (r.verified) navigate({ to: "/admin" });
      else setMode("otp");
    }).catch(() => {});
  }, [user, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const send = async () => {
    const r = await sendOtp();
    setSentTo(r.sentTo);
    toast.success(`Code sent to ${r.sentTo}`);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Account created. Awaiting admin approval before you can sign in.");
        await supabase.auth.signOut();
        setMode("signin");
      } else if (mode === "signin") {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const { data: profile } = await supabase
          .from("profiles").select("approved").eq("user_id", data.user.id).maybeSingle();
        if (!profile?.approved) {
          await supabase.auth.signOut();
          toast.error("Your account is pending admin approval.");
          return;
        }
        setMode("otp");
        try { await send(); } catch (err) {
          toast.error(err instanceof Error ? err.message : "Could not send code");
        }
      } else {
        await verifyOtp({ data: { code: code.trim() } });
        toast.success("Welcome back.");
        navigate({ to: "/admin" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  const cancelOtp = async () => {
    await supabase.auth.signOut();
    setCode("");
    setMode("signin");
  };

  const inputCls = "w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl glass-strong p-8">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <Sparkles className="h-4 w-4 text-primary" /> Back to portfolio
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Enter login code"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "otp"
            ? `We emailed a 6-digit code${sentTo ? ` to ${sentTo}` : ""}. It expires in 10 minutes.`
            : "Admin access to manage your portfolio."}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {mode === "otp" ? (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Login code</label>
              <input
                inputMode="numeric" autoComplete="one-time-code" required maxLength={6} pattern="\d{6}"
                value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                className={`${inputCls} text-center text-2xl tracking-[0.5em]`}
              />
            </div>
          ) : (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Password</label>
                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
              </div>
            </>
          )}
          <button
            type="submit" disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-medium text-primary-foreground btn-glow transition hover:opacity-90 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "otp" ? <ShieldCheck className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Verify code"}
          </button>
        </form>

        {mode === "otp" ? (
          <div className="mt-4 flex justify-between text-sm text-muted-foreground">
            <button onClick={async () => { setBusy(true); try { await send(); } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); } finally { setBusy(false); } }} className="hover:text-foreground">Resend code</button>
            <button onClick={cancelOtp} className="hover:text-foreground">Use another account</button>
          </div>
        ) : (
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground"
          >
            {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        )}
      </div>
    </div>
  );
}
