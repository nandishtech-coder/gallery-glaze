import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink, Sparkles, Search, MessageCircle, Check, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { NavBar } from "@/components/nav-bar";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  component: Index,
});

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  price_suffix: string;
  features: string[];
  popular: boolean;
  cta_label: string;
  sort_order: number;
}

const ADMIN_WHATSAPP = "917899560461";

interface PublicProject {
  id: string;
  name: string;
  description: string;
  live_url: string | null;
  thumbnail_url: string | null;
}

function Index() {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string>("All");

  const tags = ["All", ...Array.from(new Set(projects.map((p) => p.name).filter(Boolean)))];

  const filtered = projects.filter((p) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || p.name.toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q);
    const matchesTag = activeTag === "All" || p.name === activeTag;
    return matchesQuery && matchesTag;
  });

  useEffect(() => {
    supabase
      .from("public_projects")
      .select("id, name, description, live_url, thumbnail_url")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProjects((data ?? []) as PublicProject[]);
        setLoading(false);
      });
    supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setServices((data ?? []) as Service[]);
      });
  }, []);

  const waForService = (s: Service) => {
    const msg = `Hello! I'm interested in your *${s.title}* service (${s.price} ${s.price_suffix}).\n\nCould you please share more details and the next steps?\n\nThank you!`;
    return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen">
      <NavBar />

      <main className="mx-auto max-w-6xl px-4 pt-16 pb-24">
        <section className="mb-16 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground rise-in rise-delay-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Available for new work
          </div>
          <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl rise-in rise-delay-2">
            Crafting <span className="text-gradient">digital products</span><br />
            with care and precision.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-muted-foreground rise-in rise-delay-3">
            A selection of recent projects — interfaces, tools, and experiments shipped to real users.
          </p>
        </section>

        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Selected Work
            </h2>
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects…"
                className="w-full rounded-lg border border-border bg-input/50 pl-9 pr-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {tags.length > 1 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {tags.map((t) => {
                const active = activeTag === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setActiveTag(t)}
                    className={
                      "rounded-full px-4 py-1.5 text-sm transition border " +
                      (active
                        ? "bg-primary text-primary-foreground border-primary btn-glow"
                        : "glass border-border text-muted-foreground hover:text-foreground")
                    }
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          )}

          {loading ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 rounded-2xl glass animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl glass p-12 text-center text-muted-foreground">
              {query ? `No projects match “${query}”.` : "No projects yet. Sign in to add your first."}
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <article
                  key={p.id}
                  className="group flex flex-col overflow-hidden rounded-2xl glass card-hover"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                    {p.thumbnail_url ? (
                      <img
                        src={p.thumbnail_url}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Sparkles className="h-8 w-8 opacity-40" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-semibold transition-transform duration-300 hover:scale-105 hover:text-primary inline-block origin-left cursor-default">
                      {p.name}
                    </h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground transition-transform duration-300 hover:scale-[1.02] hover:text-foreground origin-left cursor-default">
                      {p.description}
                    </p>
                    {(p.live_url || p.name) && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {p.live_url && (
                          <a
                            href={p.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-105 hover:opacity-90"
                          >
                            View Live <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                        <a
                          href={`https://wa.me/917899560461?text=${encodeURIComponent(`Hello Nandish-Tech 👋,\n\nI came across your portfolio and I'm interested in the "${p.name}" demo project.\n\nCould you please share more details regarding:\n• Features & customization options\n• Pricing & delivery timeline\n• Next steps to get started\n\nLooking forward to your response.\n\nThank you!`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Enquire about ${p.name} on WhatsApp`}
                          className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-border glass px-3 py-2 text-sm font-medium transition-transform duration-300 hover:scale-105 hover:text-primary"
                        >
                          WhatsApp <MessageCircle className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {services.length > 0 && (
          <section className="mt-24">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                  Services I Offer
                </h2>
                <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Build something <span className="text-gradient">great together</span>
                </p>
              </div>
              <Link
                to="/services"
                className="inline-flex w-fit items-center gap-1.5 rounded-lg glass border border-border px-4 py-2 text-sm font-medium transition hover:text-primary"
              >
                View all services <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.slice(0, 3).map((s) => (
                <article
                  key={s.id}
                  className="group relative flex flex-col rounded-2xl glass p-6 card-hover"
                >
                  {s.popular && (
                    <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow-lg">
                      Popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{s.description}</p>

                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-gradient">{s.price}</span>
                    <span className="text-xs text-muted-foreground">{s.price_suffix}</span>
                  </div>

                  <ul className="mt-4 flex-1 space-y-2">
                    {s.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="line-clamp-1">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={waForService(s)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground btn-glow transition hover:opacity-90"
                  >
                    <MessageCircle className="h-4 w-4" /> {s.cta_label || "Get Started"}
                  </a>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
