import { useEffect, useState, useRef } from "react";
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

function useFooterVisible() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);
  return visible;
}

export function LiveOffers() {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [offersOpen, setOffersOpen] = useState(true);
  const [offerIndex, setOfferIndex] = useState(0);
  const [offerProgress, setOfferProgress] = useState(0);
  const footerVisible = useFooterVisible();
  const missedShownRef = useRef<Set<string>>(new Set());
  const now = useNow(1000);

  useEffect(() => {
    supabase
      .from("public_projects")
      .select("id, name, live_url, offer_enabled, offer_label, offer_discount_percent, offer_ends_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => { setProjects((data ?? []) as PublicProject[]); });

    supabase
      .from("services")
      .select("id, title, price, price_suffix, discount_percent")
      .order("sort_order", { ascending: true })
      .then(({ data }) => { setServices((data ?? []) as Service[]); });
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
    return () => { clearInterval(tickId); clearTimeout(advId); };
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
  }, [projects]);

  if (totalOffers === 0 || footerVisible) return null;

  const current = liveOffers[offerIndex % totalOffers];
  const currentRemaining =
    current && current.kind === "project" && current.endsAt
      ? formatRemaining(new Date(current.endsAt).getTime() - now)
      : null;

  return (
    <div className="relative z-20 mt-0 w-full px-4 sm:px-8">
      <div className="ml-auto w-[min(20rem,calc(100vw-1.5rem))]">
        {offersOpen ? (
          <div className="live-offer-card rounded-xl p-3.5">
          {/* Header */}
          <div className="mb-2.5 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest live-offer-timer">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: "#818cf8" }} />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "#6366f1" }} />
              </span>
              Live offer {totalOffers > 1 ? `${(offerIndex % totalOffers) + 1}/${totalOffers}` : ""}
            </span>
            <button
              type="button"
              onClick={() => setOffersOpen(false)}
              aria-label="Hide offers"
              className="live-offer-close flex h-5 w-5 items-center justify-center rounded-full text-[11px] leading-none transition-all hover:scale-110"
              style={{ background: "rgba(99,102,241,0.1)" }}
            >
              ✕
            </button>
          </div>

          {/* Offer item */}
          <a
            key={current.id}
            href={current.href || "#"}
            target={current.href ? "_blank" : undefined}
            rel={current.href ? "noopener noreferrer" : undefined}
            className="offer-rise live-offer-inner flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-xs transition-all duration-200"
          >
            <span className="min-w-0 flex-1">
              <span className="live-offer-kind mb-0.5 block text-[9px] font-semibold uppercase tracking-widest">
                {current.kind === "project" ? "Project" : "Service"}
              </span>
              <span className="live-offer-title block truncate text-sm font-semibold leading-tight">{current.title}</span>
            </span>
            <span className="flex shrink-0 flex-col items-end gap-1">
              {current.discount && current.discount > 0 && (
                <span
                  className="rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)" }}
                >
                  {current.discount}% OFF
                </span>
              )}
              {current.kind === "project" && currentRemaining && (
                <span className="live-offer-timer font-mono text-[10px] tabular-nums">{currentRemaining}</span>
              )}
            </span>
          </a>

          {/* Progress bar */}
          <div className="live-offer-progress-bg mt-2.5 h-0.5 w-full overflow-hidden rounded-full">
            <div
              className="h-full transition-[width] duration-100 ease-linear"
              style={{ width: `${offerProgress}%`, background: "linear-gradient(90deg, #6366f1, #22d3ee)" }}
            />
          </div>

          {/* Dots */}
          {totalOffers > 1 && (
            <div className="mt-2 flex justify-center gap-1">
              {liveOffers.map((_, i) => (
                <span
                  key={i}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: i === offerIndex % totalOffers ? "1rem" : "0.25rem",
                    background: i === offerIndex % totalOffers ? "#6366f1" : "rgba(99,102,241,0.25)",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOffersOpen(true)}
          className="live-offer-pill inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all duration-200"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: "#818cf8" }} />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "#6366f1" }} />
          </span>
          {totalOffers} live offer{totalOffers > 1 ? "s" : ""}
        </button>
      )}
      </div>
    </div>
  );
}
