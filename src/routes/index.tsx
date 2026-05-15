import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink, Sparkles, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { NavBar } from "@/components/nav-bar";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  component: Index,
});

interface PublicProject {
  id: string;
  name: string;
  description: string;
  live_url: string | null;
  thumbnail_url: string | null;
}

function Index() {
  const [projects, setProjects] = useState<PublicProject[]>([]);
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
  }, []);

  return (
    <div className="min-h-screen">
      <NavBar />

      <main className="mx-auto max-w-6xl px-4 pt-16 pb-24">
        <section className="mb-16 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Available for new work
          </div>
          <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
            Crafting <span className="text-gradient">digital products</span><br />
            with care and precision.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-muted-foreground">
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
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                      {p.description}
                    </p>
                    {p.live_url && (
                      <a
                        href={p.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                      >
                        View Live <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
