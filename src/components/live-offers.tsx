import { useEffect, useState, useRef } from "react";
import { Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { computeDiscounted } from "@/lib/price";

interface Service {
  id: string;
  title: string;
  price: string;
  price_suffix: string;
  discount_percent: number;
}

interface PublicProject {
  id: string;
  name: string;
  live_url: string | null;
  offer_enabled: boolean | null;
  offer_label: string | null;
  offer_discount_percent: number | null;
  offer_ends_at: string | null;
}

interface LiveOfferItem {
  kind: "project" | "service";
  id: string;
  title: string;
  discount: number | null;
  endsAt?: string;
  href?: string;
}

const ADMIN_WHATSAPP = "917406386316";

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

function waForService(s: Service) {
  const discounted = computeDiscounted(s.price, s.discount_percent);
  const priceLine = discounted
    ? `${discounted} ${s.price_suffix} (after ${s.discount_percent}% off, original ${s.price})`
    : `${s.price} ${s.price_suffix}`;
  const msg = `Hello! I'm interested in your *${s.title}* service (${priceLine}).\n\nCould you please share more details and the next steps?\n\nThank you!`;
  return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

export function LiveOffers() {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [offersOpen, setOffersOpen] = useState(true);
  const [offerIndex, setOfferIndex] = useState(0);
  const [offerProgress, setOfferProgress] = useState(0);
  const missedShownRef = useRef<Set<string>>(new Set());
  const now = useNow(1000);

  useEffect(() => {
    supabase
      .from("public_projects")
      .select(
        "id, name, live_url, offer_enabled, offer_label, offer_discount_percent, offer_ends_at",
      )
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProjects((data ?? []) as PublicProject[]);
      });

    supabase
      .from("services")
      .select("id, title, price, price_suffix, discount_percent")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setServices((data ?? []) as Service[]);
      });
  }, []);

  const activeProjectOffers = projects
    .filter((p) => p.offer_enabled && p.offer_ends_at && new Date(p.offer_ends_at).getTime() > now)
    .sort((a, b) => new Date(a.offer_ends_at!).getTime() - new Date(b.offer_ends_at!).getTime());

  const serviceOffers = services.filter((s) => (s.discount_percent ?? 0) > 0);

  const liveOffers: LiveOfferItem[] = [
    ...activeProjectOffers.map((p) => ({
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

  useEffect(() => {
    if (totalOffers === 0) return;
    const start = Date.now();
    setOfferProgress(0);
    const tickId = setInterval(() => {
      const elapsed = Date.now() - start;
      setOfferProgress(Math.min(100, (elapsed / 5000) * 100));
    }, 80);
    const advId = setTimeout(() => {
      if (totalOffers > 1) setOfferIndex((i) => (i + 1) % totalOffers);
      else setOfferProgress(0);
    }, 5000);
    return () => {
      clearInterval(tickId);
      clearTimeout(advId);
    };
  }, [totalOffers, offerIndex]);

  useEffect(() => {
    if (offerIndex >= totalOffers) setOfferIndex(0);
  }, [totalOffers, offerIndex]);

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
    if (newlyMissed.length && typeof window !== "undefined") {
      sessionStorage.setItem("missedOffersShown", JSON.stringify(Array.from(seen)));
    }
    // Missed-project notifications are intentionally shown on the projects page only
    // to avoid duplicating toasts when LiveOffers is used on multiple routes.
  }, [projects]);

  if (totalOffers === 0) return null;

  const current = liveOffers[offerIndex % totalOffers];
  const currentRemaining =
    current && current.kind === "project" && current.endsAt
      ? formatRemaining(new Date(current.endsAt).getTime() - now)
      : null;

  return (
    <div className="fixed left-1/2 top-[8.5rem] z-40 w-[min(19rem,calc(100vw-1.5rem))] -translate-x-1/2 sm:left-auto sm:right-4 sm:top-[8rem] sm:translate-x-0">
      {offersOpen ? (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 shadow-lg shadow-emerald-500/10 backdrop-blur">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Live offer {totalOffers > 1 ? `${(offerIndex % totalOffers) + 1}/${totalOffers}` : ""}
            </span>
            <button
              type="button"
              onClick={() => setOffersOpen(false)}
              aria-label="Hide offers"
              className="text-sm leading-none text-emerald-500/70 hover:text-emerald-400"
            >
              ✕
            </button>
          </div>
          <a
            key={current.id}
            href={current.href || "#"}
            target={current.href ? "_blank" : undefined}
            rel={current.href ? "noopener noreferrer" : undefined}
            className="offer-rise flex items-center justify-between gap-2 rounded-lg bg-background/40 px-3 py-2 text-xs transition hover:bg-background/60"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] uppercase tracking-wider text-emerald-500/70">
                {current.kind === "project" ? "Project" : "Service"}
              </span>
              <span className="block truncate font-medium text-foreground">{current.title}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1.5">
              {current.discount && current.discount > 0 && (
                <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {current.discount}% OFF
                </span>
              )}
              {current.kind === "project" && currentRemaining && (
                <span className="font-mono tabular-nums text-emerald-400">{currentRemaining}</span>
              )}
            </span>
          </a>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-emerald-500/15">
            <div
              className="h-full bg-emerald-400 transition-[width] duration-100 ease-linear"
              style={{ width: `${offerProgress}%` }}
            />
          </div>
          {totalOffers > 1 && (
            <div className="mt-2 flex justify-center gap-1">
              {liveOffers.map((_, i) => (
                <span
                  key={i}
                  className={
                    "h-1 rounded-full transition-all " +
                    (i === offerIndex % totalOffers ? "w-4 bg-emerald-400" : "w-1 bg-emerald-500/30")
                  }
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOffersOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-500 shadow-lg backdrop-blur hover:bg-emerald-500/20"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          {totalOffers} live offer{totalOffers > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}
