import { useEffect, useState } from "react";
import { Star, Quote, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  name: string;
  company: string | null;
  role: string | null;
  rating: number;
  message: string;
  created_at: string;
}

const emptyForm = { name: "", email: "", company: "", role: "", rating: 5, message: "" };

export function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, name, company, role, rating, message, created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(12);
    if (!error) setItems((data ?? []) as Testimonial[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return toast.error("Name and message are required");
    if (form.message.length > 1000) return toast.error("Message too long");
    setSubmitting(true);
    const { error } = await supabase.from("testimonials").insert({
      name: form.name.trim().slice(0, 100),
      email: form.email.trim().slice(0, 255) || null,
      company: form.company.trim().slice(0, 100) || null,
      role: form.role.trim().slice(0, 100) || null,
      rating: Math.max(1, Math.min(5, Number(form.rating) || 5)),
      message: form.message.trim(),
      approved: false,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Thanks! Your testimonial will appear once approved.");
    setForm(emptyForm);
    setOpen(false);
  };

  return (
    <section className="mt-24">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Testimonials
          </h2>
          <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Loved by <span className="text-gradient">happy clients</span>
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground btn-glow transition hover:opacity-90"
        >
          <Send className="h-3.5 w-3.5" /> Share your experience
        </button>
      </div>

      {loading ? (
        <div className="py-10 text-center text-muted-foreground">
          <Loader2 className="mx-auto h-5 w-5 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl glass p-8 text-center text-sm text-muted-foreground">
          No testimonials yet. Be the first to share your experience!
        </div>
      ) : (
        <div className={items.length > 2 ? "testimonial-marquee-wrap overflow-hidden" : ""}>
          <div
            className={items.length > 2 ? "testimonial-marquee-track" : "flex flex-wrap gap-5"}
            style={items.length > 2 ? { animationDuration: `${Math.max(14, items.length * 4)}s` } : undefined}
          >
            {(items.length > 2 ? [...items, ...items] : items).map((t, idx) => {
              const initials = t.name
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((s) => s[0]?.toUpperCase())
                .join("");
              const palettes = [
                "from-fuchsia-500 to-pink-500",
                "from-sky-500 to-indigo-500",
                "from-emerald-500 to-teal-500",
                "from-amber-500 to-orange-500",
                "from-violet-500 to-purple-500",
                "from-rose-500 to-red-500",
              ];
              let hash = 0;
              for (let i = 0; i < t.name.length; i++) hash = (hash * 31 + t.name.charCodeAt(i)) >>> 0;
              const gradient = palettes[hash % palettes.length];
              return (
                <article
                  key={`${t.id}-${idx}`}
                  className="group relative flex w-[min(22rem,85vw)] shrink-0 flex-col overflow-hidden rounded-2xl glass p-6 card-hover"
                >
                  <div
                    className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-2xl transition group-hover:opacity-30`}
                  />
                  <Quote className="absolute right-4 top-4 h-6 w-6 text-primary/40" />
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-sm font-semibold text-white shadow-lg ring-2 ring-background`}
                    >
                      {initials || "★"}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{t.name}</div>
                      {(t.role || t.company) && (
                        <div className="truncate text-xs text-muted-foreground">
                          {t.role ? <span>{t.role}</span> : null}
                          {t.role && t.company ? <span className="mx-1 text-muted-foreground/50">·</span> : null}
                          {t.company ? <span className="text-primary/80">{t.company}</span> : null}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-current" : "opacity-30"}`} />
                    ))}
                  </div>
                  <p className="mt-3 flex-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/90">
                    &ldquo;{t.message}&rdquo;
                  </p>
                </article>
              );
            })}
          </div>
        </div>

      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm overflow-y-auto">
          <form onSubmit={submit} className="w-full max-w-lg rounded-2xl glass-strong p-6 my-8">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Share your experience</h3>
              <button type="button" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">
                Close
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Name *</label>
                  <input required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
                  <input type="email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Business name</label>
                  <input maxLength={100} placeholder="Your business or brand" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Role</label>
                  <input maxLength={100} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })}
                      className="p-1">
                      <Star className={`h-6 w-6 ${n <= form.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Your testimonial *</label>
                <textarea required rows={4} maxLength={1000} value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="What did you love about working with Nandish-Tech?"
                  className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                <p className="mt-1 text-[11px] text-muted-foreground">{form.message.length}/1000</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-secondary">Cancel</button>
              <button type="submit" disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground btn-glow hover:opacity-90 disabled:opacity-60">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
