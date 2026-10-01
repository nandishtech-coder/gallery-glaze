import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NavBar } from "@/components/nav-bar";
import { PageBackground } from "@/components/page-background";
import { SiteFooter } from "@/components/site-footer";
import { Mail, MapPin, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim().slice(0, 100);
    const email = form.email.trim().slice(0, 255);
    const phone = form.phone.trim().slice(0, 20);
    const message = form.message.trim().slice(0, 2000);
    if (!name || !email || !phone || !message) return;
    setSending(true);
    // Open WhatsApp window synchronously so popup blockers allow it
    const text =
      `Hello Nandish-Tech,\n\nNew enquiry from the website:\n\n` +
      `Name: ${name}\nEmail: ${email}\nWhatsApp: ${phone}\n\nMessage:\n${message}`;
    const waUrl = `https://wa.me/917406386316?text=${encodeURIComponent(text)}`;
    const win = window.open(waUrl, "_blank", "noopener,noreferrer");
    const { error } = await supabase.from("contact_messages").insert({ name, email, phone, message });
    setSending(false);
    if (error) {
      toast.error("Could not save your message. Please try again.");
      return;
    }
    if (!win) window.location.href = waUrl;
    toast.success("Message saved! Opening WhatsApp…");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="relative min-h-screen">
      <PageBackground variant="hero2" />
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
            <a href="mailto:contactnandishtech@gmail.com" className="block rounded-2xl glass p-5 card-hover">
              <Mail className="h-5 w-5 text-primary" />
              <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">Email</div>
              <div className="mt-1 text-sm font-medium">contactnandishtech@gmail.com</div>
            </a>
            <div className="rounded-2xl glass p-5 card-hover">
              <MapPin className="h-5 w-5 text-primary" />
              <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">Based in</div>
              <div className="mt-1 text-sm font-medium">Bangalore, India · Remote worldwide</div>
            </div>
          </aside>

          <form onSubmit={submit} className="rounded-2xl glass p-6 card-hover">
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
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Mobile / WhatsApp number</label>
              <input
                required
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
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
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground btn-glow transition hover:opacity-90 disabled:opacity-60"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send message
              </button>
            </div>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
