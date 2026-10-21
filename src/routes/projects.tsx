import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ExternalLink, Sparkles, Search, MessageCircle, Check, ArrowRight, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { NavBar } from "@/components/nav-bar";
import { PageBackground } from "@/components/page-background";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { computeDiscounted } from "@/lib/price";
import nandishLogo from "@/assets/nandish-logo.png";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Projects & Services — Nandish-Tech" },
      { name: "description", content: "Browse shipped websites, live project demos, limited-time offers, and the technology services I offer." },
      { property: "og:title", content: "Projects & Services — Nandish-Tech" },
      { property: "og:description", content: "Browse shipped websites, live project demos, limited-time offers, and the technology services I offer." },
    ],
  }),
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
  discount_percent: number;
}

const ADMIN_WHATSAPP = "917406386316";

interface PublicProject {
  id: string;
  name: string;
  description: string;
  live_url: string | null;
  thumbnail_url: string | null;
  offer_enabled: boolean | null;
  offer_label: string | null;
  offer_discount_percent: number | null;
  offer_ends_at: string | null;
  project_type: string | null;
  live_enabled: boolean | null;
  is_completed: boolean | null;
  project_status: string | null;
}

type ProjectTab = "demo" | "ongoing" | "completed";

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

function formatRemaining(ms: number) {
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return d > 0 ? `${d}d ${pad(h)}h ${pad(m)}m ${pad(sec)}s` : `${pad(h)}h ${pad(m)}m ${pad(sec)}s`;
}

function Index() {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<ProjectTab>("demo");

  const getProjectStatus = (p: PublicProject) => (p.project_status ?? (p.is_completed ? "completed" : "ongoing")).toLowerCase();
  const demoProjects = projects.filter((p) => getProjectStatus(p) === "demo");
  const ongoingProjects = projects.filter((p) => ["ongoing", "upcoming"].includes(getProjectStatus(p)));
  const completedProjects = projects.filter((p) => getProjectStatus(p) === "completed");
  const currentProjectSet =
    activeTab === "demo" ? demoProjects : activeTab === "ongoing" ? ongoingProjects : completedProjects;
  const tabs: Array<{ key: ProjectTab; label: string; count: number }> = [
    { key: "demo", label: "Demo Projects", count: demoProjects.length },
    { key: "ongoing", label: "Ongoing Projects", count: ongoingProjects.length },
    { key: "completed", label: "Completed Projects", count: completedProjects.length },
  ];

  const tags = ["All", ...Array.from(new Set(currentProjectSet.map((p) => p.name).filter(Boolean)))];

  const filtered = currentProjectSet.filter((p) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || p.name.toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q);
    const matchesTag = activeTag === "All" || p.name === activeTag;
    return matchesQuery && matchesTag;
  });

  useEffect(() => {
    setActiveTag("All");
  }, [activeTab]);

  useEffect(() => {
    supabase
      .from("public_projects")
      .select("id, name, description, live_url, thumbnail_url, offer_enabled, offer_label, offer_discount_percent, offer_ends_at, project_type, live_enabled, is_completed, project_status")
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
    const discounted = computeDiscounted(s.price, s.discount_percent);
    const priceLine = discounted
      ? `${discounted} ${s.price_suffix} (after ${s.discount_percent}% off, original ${s.price})`
      : `${s.price} ${s.price_suffix}`;
    const msg = `Hello! I'm interested in your *${s.title}* service (${priceLine}).\n\nCould you please share more details and the next steps?\n\nThank you!`;
    return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(msg)}`;
  };

  const now = useNow(1000);
  const activeOffers = projects.filter(
    (p) => p.offer_enabled && p.offer_ends_at && new Date(p.offer_ends_at).getTime() > now,
  );
  const sortedOffers = activeOffers
    .slice()
    .sort((a, b) => new Date(a.offer_ends_at!).getTime() - new Date(b.offer_ends_at!).getTime());
  const soonest = sortedOffers[0];
  const soonestRemaining = soonest ? formatRemaining(new Date(soonest.offer_ends_at!).getTime() - now) : null;

  const missedShownRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!projects.length) return;
    const nowMs = Date.now();
    const WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
    const seenRaw = typeof window !== "undefined" ? sessionStorage.getItem("missedOffersShown") : null;
    const seen: Set<string> = new Set(seenRaw ? (JSON.parse(seenRaw) as string[]) : []);
    const newlyMissed = projects.filter((p) => {
      if (!p.offer_enabled || !p.offer_ends_at) return false;
      const end = new Date(p.offer_ends_at).getTime();
      const expired = end <= nowMs && nowMs - end <= WINDOW_MS;
      const key = `${p.id}:${p.offer_ends_at}`;
      if (!expired || seen.has(key) || missedShownRef.current.has(key)) return false;
      missedShownRef.current.add(key);
      seen.add(key);
      return true;
    });
    if (newlyMissed.length) {
      sessionStorage.setItem("missedOffersShown", JSON.stringify(Array.from(seen)));
      newlyMissed.forEach((p, i) => {
        setTimeout(() => {
          toast.error(`You missed the offer on ${p.name}`, {
            description:
              (p.offer_discount_percent ?? 0) > 0
                ? `${p.offer_discount_percent}% OFF just ended. Ping us on WhatsApp — we may still help!`
                : `${p.offer_label || "Limited-time offer"} just ended.`,
            duration: 6000,
          });
        }, i * 600);
      });
    }
  }, [projects]);

  useEffect(() => {
    const offerServices = services.filter((s) => (s.discount_percent ?? 0) > 0);
    if (!offerServices.length) return;
    const TOAST_ID = "service-offer-rotator";
    let i = 0;
    let gapId: ReturnType<typeof setTimeout> | null = null;
    let cycleId: ReturnType<typeof setTimeout> | null = null;
    const showNext = () => {
      const s = offerServices[i % offerServices.length];
      const discounted = computeDiscounted(s.price, s.discount_percent);
      toast.success(`${s.discount_percent}% OFF on ${s.title}`, {
        id: TOAST_ID,
        description: discounted
          ? `Now ${discounted} ${s.price_suffix} (was ${s.price}) — tap to enquire.`
          : `${s.price} ${s.price_suffix} — tap to enquire.`,
        duration: 5000,
        position: "bottom-right",
        action: {
          label: "WhatsApp",
          onClick: () => window.open(waForService(s), "_blank", "noopener,noreferrer"),
        },
      });
      i++;
      cycleId = setTimeout(() => {
        toast.dismiss(TOAST_ID);
        gapId = setTimeout(showNext, 2000);
      }, 5000);
    };
    const startId = setTimeout(showNext, 1500);
    return () => {
      clearTimeout(startId);
      if (gapId) clearTimeout(gapId);
      if (cycleId) clearTimeout(cycleId);
      toast.dismiss(TOAST_ID);
    };
  }, [services]);


  const renderOfferPill = (p: PublicProject, key: string) => {
    const remaining = formatRemaining(new Date(p.offer_ends_at!).getTime() - now);
    return (
      <span
        key={key}
        className="inline-flex max-w-full shrink-0 flex-wrap items-center justify-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-500 sm:rounded-full sm:px-4 sm:text-sm"
      >
        <Clock className="h-4 w-4 animate-pulse" />
        <span className="text-foreground/90">
          {p.offer_label || "Offer ends soon"} on <span className="font-semibold">{p.name}</span>
        </span>
        {(p.offer_discount_percent ?? 0) > 0 && (
          <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
            {p.offer_discount_percent}% OFF
          </span>
        )}
        <span className="font-mono tabular-nums text-emerald-400">{remaining}</span>
      </span>
    );
  };

  const [offersOpen, setOffersOpen] = useState(true);
  const serviceOffers = services.filter((s) => (s.discount_percent ?? 0) > 0);

  type LiveOfferItem =
    | { kind: "project"; id: string; title: string; discount: number | null; endsAt: string; href?: string }
    | { kind: "service"; id: string; title: string; discount: number; href: string };

  const liveOffers: LiveOfferItem[] = [
    ...sortedOffers.map((p) => ({
      kind: "project" as const,
      id: `p-${p.id}`,
      title: p.name,
      discount: p.offer_discount_percent ?? null,
      endsAt: p.offer_ends_at!,
      href: p.live_url ?? undefined,
    })),
    ...serviceOffers.map((s) => ({
      kind: "service" as const,
      id: `s-${s.id}`,
      title: s.title,
      discount: s.discount_percent,
      href: waForService(s),
    })),
  ];
  const totalOffers = liveOffers.length;

  const OFFER_DURATION = 5000;
  const [offerIndex, setOfferIndex] = useState(0);
  const [offerProgress, setOfferProgress] = useState(0);
  useEffect(() => {
    if (totalOffers === 0) return;
    const start = Date.now();
    setOfferProgress(0);
    const tickId = setInterval(() => {
      const elapsed = Date.now() - start;
      setOfferProgress(Math.min(100, (elapsed / OFFER_DURATION) * 100));
    }, 80);
    const advId = setTimeout(() => {
      if (totalOffers > 1) setOfferIndex((i) => (i + 1) % totalOffers);
      else setOfferProgress(0);
    }, OFFER_DURATION);
    return () => {
      clearInterval(tickId);
      clearTimeout(advId);
    };
  }, [totalOffers, offerIndex]);
  useEffect(() => {
    if (offerIndex >= totalOffers) setOfferIndex(0);
  }, [totalOffers, offerIndex]);

  const current = totalOffers > 0 ? liveOffers[offerIndex % totalOffers] : null;
  const currentRemaining =
    current && current.kind === "project" ? formatRemaining(new Date(current.endsAt).getTime() - now) : null;

  return (
    <div className="relative min-h-screen">
      <PageBackground variant="hero" />
      <NavBar />




      <main className="page-shell px-4 pb-24 pt-8 sm:pt-10">
        <section className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground rise-in rise-delay-1">
              <img src={nandishLogo} alt="Nandish-Tech" className="h-3.5 w-3.5 object-contain" /> Available for new work
            </div>
            <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl rise-in rise-delay-2">
              Crafting <span className="text-gradient">digital products</span><br />
              with care and precision.
            </h1>
            <p className="mt-5 max-w-xl text-balance text-muted-foreground rise-in rise-delay-3">
              I help startups and businesses bring their products to life with precision and modern tech.
            </p>
            {sortedOffers.length === 1 && soonest && soonestRemaining && (
              <div className="mt-6 flex justify-start">{renderOfferPill(soonest, soonest.id)}</div>
            )}
          </div>

          <div className="w-full max-w-md lg:flex lg:justify-end">
            <div className="w-full rounded-3xl border border-white/10 bg-slate-950/30 p-4 shadow-2xl backdrop-blur-md">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <img
                    src={nandishLogo}
                    alt="Nandish-Tech"
                    className="h-6 w-6 shrink-0 rounded-full object-contain"
                  />
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                  {totalOffers > 0 ? "Live offers" : "Available now"}
                </div>
                <span className="rounded-full border border-border bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {totalOffers > 0 ? `${totalOffers} ${totalOffers === 1 ? "offer" : "offers"}` : "New work"}
                </span>
              </div>

              {current ? (
                <a
                  href={current.href || "#"}
                  target={current.href ? "_blank" : undefined}
                  rel={current.href ? "noopener noreferrer" : undefined}
                  className="block rounded-2xl border border-primary/20 bg-primary/5 p-3 transition hover:border-primary/40 hover:bg-primary/10"
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                    {current.kind === "project" ? "Project" : "Service"} offer
                  </div>
                  <div className="mt-2 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-base font-semibold text-foreground">{current.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {current.kind === "project"
                          ? (currentRemaining ? `Ends in ${currentRemaining}` : "Limited-time availability")
                          : "Special launch pricing"}
                      </div>
                    </div>
                    {current.discount && current.discount > 0 && (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-bold text-emerald-400">
                        {current.discount}% OFF
                      </span>
                    )}
                  </div>
                </a>
              ) : (
                <div className="rounded-2xl border border-border bg-white/5 p-3 text-sm text-muted-foreground">
                  No active offers right now — new projects are still available.
                </div>
              )}

              {totalOffers > 1 && (
                <div className="mt-3 flex items-center justify-between rounded-xl border border-border bg-white/5 px-3 py-2 text-xs text-muted-foreground">
                  <span>Next offer</span>
                  <div className="flex items-center gap-1">
                    {liveOffers.map((_, idx) => (
                      <span
                        key={idx}
                        className="inline-block h-1.5 rounded-full transition-all"
                        style={{
                          width: idx === offerIndex % totalOffers ? "1.2rem" : "0.4rem",
                          background: idx === offerIndex % totalOffers ? "#22d3ee" : "rgba(148,163,184,0.35)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {sortedOffers.length > 1 && (
          <div className="mb-16 flex justify-center px-2">
            <div key={sortedOffers[offerIndex % sortedOffers.length].id} className="offer-rise w-full max-w-md">
              <div className="flex justify-center">
                {renderOfferPill(sortedOffers[offerIndex % sortedOffers.length], `rot-${sortedOffers[offerIndex % sortedOffers.length].id}`)}
              </div>
              <div className="mx-auto mt-3 h-1 w-40 overflow-hidden rounded-full bg-emerald-500/15">
                <div
                  className="h-full bg-emerald-400 transition-[width] duration-100 ease-linear"
                  style={{ width: `${offerProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}




        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={
                      "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] transition " +
                      (isActive
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border bg-transparent text-muted-foreground hover:text-foreground")
                    }
                  >
                    <span>{tab.label}</span>
                    <span className="inline-flex min-w-6 items-center justify-center rounded-full border border-current/30 bg-background/60 px-1.5 py-0.5 text-[10px]">
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
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
              {query ? `No projects match “${query}”.` : "Project gallery will be updated shortly."}
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <article
                  key={p.id}
                  className="group flex flex-col overflow-hidden rounded-2xl glass card-hover"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
                    {p.thumbnail_url ? (
                      <img
                        src={p.thumbnail_url}
                        alt={`${p.name} project logo`}
                        loading="lazy"
                        className="h-full w-full bg-white/5 object-contain p-4 transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-gradient-to-br from-primary/10 via-secondary to-transparent">
                        <Sparkles className="h-8 w-8 opacity-40" />
                      </div>
                    )}
                    {p.offer_enabled && p.offer_ends_at && new Date(p.offer_ends_at).getTime() > now && (
                      <div className="absolute left-3 top-3 flex flex-col items-start gap-1">
                        {(p.offer_discount_percent ?? 0) > 0 && (
                          <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg">
                            {p.offer_discount_percent}% OFF
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-medium text-foreground backdrop-blur">
                          <Clock className="h-3 w-3 text-emerald-500" />
                          <span className="font-mono tabular-nums">{formatRemaining(new Date(p.offer_ends_at).getTime() - now)}</span>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="mb-2 inline-flex w-fit items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                      {p.project_type ?? "Web Application"}
                    </span>
                    <h3 className="text-lg font-semibold transition-transform duration-300 hover:scale-105 hover:text-primary inline-block origin-left cursor-default">
                      {p.name}
                    </h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground transition-transform duration-300 hover:scale-[1.02] hover:text-foreground origin-left cursor-default">
                      {p.description}
                    </p>
                    {(p.live_url || p.name) && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {p.live_enabled === false ? (
                          <span className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-2 text-sm font-medium text-muted-foreground">
                            🔒 Private Project
                          </span>
                        ) : p.live_url && (
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
                          href={`https://wa.me/917406386316?text=${encodeURIComponent(`Hello Nandish-Tech 👋,\n\nI came across your portfolio and I'm interested in the "${p.name}" demo project.\n\nCould you please share more details regarding:\n• Features & customization options\n• Pricing & delivery timeline\n• Next steps to get started\n\nLooking forward to your response.\n\nThank you!`)}`}
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

        <section className="mt-24 flex justify-center">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-primary/20 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.20),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(30,41,59,0.96),rgba(76,29,149,0.82))] p-8 text-center shadow-[0_24px_60px_rgba(15,23,42,0.5)] sm:p-12 card-hover">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Let&apos;s build your digital product
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-slate-200">
              Have a business idea, an existing process that needs application, or an idea that needs to be
              transformed digitally? Let&apos;s turn your idea into a working digital solution.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#facc15,#fbbf24)] px-8 py-3.5 text-base font-bold text-slate-900 shadow-lg shadow-amber-500/30 transition-transform duration-300 hover:scale-105 hover:bg-yellow-300"
            >
              Start Your Project <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
