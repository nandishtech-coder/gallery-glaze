import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NavBar } from "@/components/nav-bar";
import { SiteFooter } from "@/components/site-footer";
import { Mail, MapPin, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Nandish-Tech" },
      { name: "description", content: "Get in touch with Nandish-Tech for project inquiries and collaborations." },
      { property: "og:title", content: "Contact — Nandish-Tech" },
      { property: "og:description", content: "Get in touch with Nandish-Tech for project inquiries and collaborations." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const subject = encodeURIComponent(`New inquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:hello@nandish-tech.com?subject=${subject}&body=${body}`;
    setTimeout(() => {
      toast.success("Opening your email client…");
      setSending(false);
    }, 400);
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto max-w-5xl px-4 pt-16 pb-20">
        <header className="text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground">
            <Mail className="h-3.5 w-3.5 text-primary" /> Get in touch
          </div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Let's <span className="text-gradient">build something</span> together.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-muted-foreground">
            Have a project in mind, a question, or just want to say hi? Drop a message — I usually reply within 24 hours.
          </p>
        </header>

        <div className="mt-12 grid gap-6 md:grid-cols-[1fr_1.4fr]">
          <aside className="space-y-4">
            <a href="mailto:hello@nandish-tech.com" className="block rounded-2xl glass p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]">
              <Mail className="h-5 w-5 text-primary" />
              <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">Email</div>
              <div className="mt-1 text-sm font-medium">hello@nandish-tech.com</div>
            </a>
            <div className="rounded-2xl glass p-5 transition hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]">
              <MapPin className="h-5 w-5 text-primary" />
              <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">Based in</div>
              <div className="mt-1 text-sm font-medium">Bangalore, India · Remote worldwide</div>
            </div>
          </aside>

          <form onSubmit={submit} className="rounded-2xl glass p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Message</label>
              <textarea
                required rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground btn-glow transition hover:opacity-90 disabled:opacity-60"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send message
            </button>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
