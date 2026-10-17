import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowRight,
  Code2,
  Palette,
  ShoppingCart,
  Smartphone,
  Search,
  ShieldCheck,
  Rocket,
  Headphones,
  Check,
  MessageCircle,
} from "lucide-react";
import nandishLogo from "@/assets/nandish-logo.png";
import { NavBar } from "@/components/nav-bar";
import { SiteFooter } from "@/components/site-footer";
import { TestimonialsSection } from "@/components/testimonials-section";
import { BetterBusiness } from "@/components/better-business";
import { LiveOffers } from "@/components/live-offers";
import { PageBackground } from "@/components/page-background";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Nandish-Tech — Web Design & Development" },
      {
        name: "description",
        content:
          "Nandish-Tech builds websites, web apps, eCommerce stores and brand identities that help your business grow online.",
      },
      { property: "og:title", content: "Nandish-Tech — Web Design & Development" },
      {
        property: "og:description",
        content:
          "Websites, web apps, eCommerce, UI/UX, graphics — everything your brand needs to grow online.",
      },
    ],
  }),
  component: Home,
});

const ADMIN_PHONE = "917406386316";
const waLink = (msg: string) => `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(msg)}`;

const solutions = [
  {
    icon: Code2,
    title: "Website Development",
    text: "Fast, secure and scalable websites built on modern frameworks.",
  },
  {
    icon: Palette,
    title: "Website Design — UI/UX",
    text: "Clean interfaces and user journeys designed to convert visitors.",
  },
  {
    icon: ShoppingCart,
    title: "eCommerce Development",
    text: "Online stores with payments, inventory and order management.",
  },
  {
    icon: Smartphone,
    title: "Custom Web Applications",
    text: "Dashboards, portals and internal tools tailored to your workflow.",
  },
];

const fallbackStats = [
  { value: "50+", label: "Projects delivered" },
  { value: "30+", label: "Happy clients" },
  { value: "3+", label: "Years experience" },
  { value: "24/7", label: "Support on WhatsApp" },
];

const heroText = "We focus on growing your brand online for you.";

const whyUs = [
  { icon: Rocket, title: "Quick turnaround", text: "Most small websites go live within days, not months." },
  { icon: ShieldCheck, title: "Transparent pricing", text: "Fixed, clearly listed pricing with no hidden charges." },
  { icon: Headphones, title: "Direct communication", text: "You talk to the developer, never a call centre." },
  { icon: Search, title: "SEO ready", text: "Every build ships with clean metadata and fast loading." },
];

const process = [
  { step: "01", title: "Discuss", text: "Share your idea on WhatsApp or the contact form." },
  { step: "02", title: "Plan & quote", text: "You get a clear scope, timeline and fixed price." },
  { step: "03", title: "Design & build", text: "Regular previews so you see progress as it happens." },
  { step: "04", title: "Launch & support", text: "Deployment, domain setup and post-launch help." },
];

const industries = [
  "Startups",
  "Retail & eCommerce",
  "Education",
  "Real Estate",
  "Healthcare",
  "Restaurants & Cafés",
  "Travel",
  "Personal Brands",
];

function Home() {
  const [stats, setStats] = useState<typeof fallbackStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    supabase
      .from("site_stats")
      .select(
        "hero_stat1_value, hero_stat1_label, hero_stat2_value, hero_stat2_label, hero_stat3_value, hero_stat3_label, hero_stat4_value, hero_stat4_label",
      )
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return setStats(fallbackStats);
        setStats([
          { value: data.hero_stat1_value, label: data.hero_stat1_label },
          { value: data.hero_stat2_value, label: data.hero_stat2_label },
          { value: data.hero_stat3_value, label: data.hero_stat3_label },
          { value: data.hero_stat4_value, label: data.hero_stat4_label },
        ]);
      });
  }, []);

  const [liveOffersOpen, setLiveOffersOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      <PageBackground variant="hero" />

      <NavBar
        liveOffersOpen={liveOffersOpen}
        onToggleLiveOffers={() => setLiveOffersOpen((current) => !current)}
      />
      <LiveOffers isOpen={liveOffersOpen} onToggle={setLiveOffersOpen} />

      {isLoading ? (
        <div className="relative z-10 flex min-h-[calc(100vh-76px)] items-start justify-center px-4 pt-16 sm:pt-28">
          <div className="glass relative w-full max-w-[360px] overflow-hidden rounded-[2rem] border border-primary/20 px-6 py-8 text-center shadow-[0_20px_60px_rgba(20,27,55,0.55)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_45%),radial-gradient(circle_at_bottom,rgba(34,211,238,0.12),transparent_35%)]" />
            <div className="relative flex flex-col items-center">
              <div className="relative mb-5 flex h-28 w-28 items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-primary/30 border-t-transparent border-l-transparent animate-spin [animation-duration:7s]" />
                <div className="absolute inset-3 rounded-full border border-cyan-400/40 border-r-transparent border-b-transparent animate-spin [animation-duration:5s] [animation-direction:reverse]" />
                <div className="absolute inset-0 animate-[spin_9s_linear_infinite]">
                  <span className="absolute left-1/2 top-0 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-cyan-400 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                  <span className="absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-primary shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                  <span className="absolute bottom-0 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-cyan-400 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                  <span className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-primary shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                </div>

                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10 shadow-[0_0_30px_rgba(99,102,241,0.35)]">
                  <img src={nandishLogo} alt="Nandish-Tech" className="h-10 w-10 object-contain" />
                </div>
              </div>

              <div className="mb-4 flex items-center justify-center gap-2">
                {[0, 1, 2].map((bar) => (
                  <span
                    key={bar}
                    className="h-2.5 w-2.5 rounded-full bg-gradient-to-b from-primary to-cyan-400 animate-pulse"
                    style={{ animationDelay: `${bar * 180}ms`, animationDuration: "1.2s" }}
                  />
                ))}
              </div>

              <p className="text-lg font-semibold tracking-[0.18em] text-foreground/90 uppercase">Loading</p>
              <p className="mt-2 text-sm text-muted-foreground">Preparing your digital experience</p>
            </div>
          </div>
        </div>
      ) : (
        <main>
        <div className="relative">
          <section className="relative w-full px-4 pb-10 pt-8 sm:px-12 sm:pt-12">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 xl:flex-row xl:items-center xl:gap-16">
              {/* Left: Text content */}
              <div className="min-w-0 flex-1">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground rise-in rise-delay-1">
                  <img src={nandishLogo} alt="Nandish-Tech" className="h-3.5 w-3.5 object-contain" /> Solutions for all your needs
                </div>
                <h1 className="max-w-[900px] text-[clamp(3.2rem,6vw,7rem)] font-semibold leading-[0.9] tracking-[-0.06em] rise-in rise-delay-2">
                  <span className="block text-white" style={{ wordBreak: "keep-all" }}>
                    <span className="text-white">We focus on growing your </span>
                    <span className="text-gradient">brand online for you.</span>
                  </span>
                </h1>
                <p className="mt-5 max-w-xl text-balance text-base text-muted-foreground sm:text-lg rise-in rise-delay-3">
                  We build websites, web apps, eCommerce stores and brand identities — crafted to make
                  your business look professional, trustworthy, and stand out online.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3 rise-in rise-delay-3">
                  <a
                    href={waLink("Hello Nandish-Tech! I'd like to get started on a project. Could you share the details?")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground btn-glow transition hover:opacity-90"
                  >
                    <MessageCircle className="h-4 w-4" /> Get Started
                  </a>
                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-2 rounded-lg glass border border-border px-6 py-3 text-sm font-medium text-foreground transition hover:bg-secondary"
                  >
                    Find Out More <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

            </div>
          </section>
        </div>

        {/* Stats */}
        <section className="w-full px-6 sm:px-12">
          <div className="rounded-2xl glass p-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {(stats ?? [null, null, null, null]).map((s, i) => (
                <div key={s?.label ?? i} className="text-center">
                  {s ? (
                    <>
                      <div className="text-2xl font-semibold text-gradient sm:text-3xl">{s.value}</div>
                      <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</div>
                    </>
                  ) : (
                    <>
                      <div className="mx-auto h-8 w-16 animate-pulse rounded-md bg-muted/60" />
                      <div className="mx-auto mt-2 h-3 w-24 animate-pulse rounded bg-muted/40" />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Solutions */}
        <section className="w-full px-6 py-20 sm:px-12">
          <div className="mb-10 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">What we do</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-gradient sm:text-4xl">
              All the digital services that are convenient for you
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s) => (
              <article key={s.title} className="rounded-2xl glass p-6 card-hover">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground btn-glow transition hover:opacity-90"
            >
              View services & pricing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Why us */}
        <section className="w-full px-6 pb-20 sm:px-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-primary">Why choose us</p>
              <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                <span className="inline-block whitespace-nowrap">
                  <span className="inline-block text-3d-primary">Your</span>{" "}
                  <span className="inline-block text-3d-accent">Vision</span>
                  <span aria-hidden className="mx-2 text-muted-foreground/40">|</span>
                </span>
                <span className="inline-block whitespace-nowrap">
                  <span className="inline-block text-3d-primary">Our</span>{" "}
                  <span className="inline-block text-3d-accent">Technology</span>
                  <span aria-hidden className="mx-2 text-muted-foreground/40">|</span>
                </span>
                <span className="inline-block whitespace-nowrap">
                  <span className="inline-block text-3d-primary">Better</span>{" "}
                  <span className="inline-block text-3d-accent">Together</span>
                </span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Every project is handled personally — from the first message to launch day and beyond. You get
                honest timelines, fixed pricing and a website you can grow with.
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                {["Fixed price, shared upfront", "Live preview links while we build", "Mobile-first, fast-loading pages", "Domain, hosting & deployment handled"].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-foreground/85">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {whyUs.map((w) => (
                <div key={w.title} className="rounded-2xl glass p-5 card-hover">
                  <w.icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-3 font-semibold">{w.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{w.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="w-full px-6 pb-20 sm:px-12">
          <div className="mb-10 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gradient sm:text-4xl">A simple 4-step process</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <div key={p.step} className="rounded-2xl glass p-6 card-hover">
                <div className="text-sm font-semibold text-primary">{p.step}</div>
                <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Industries */}
        <section className="w-full px-6 pb-20 text-center sm:px-12">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">Industries</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gradient sm:text-4xl">
            Multi-industry design & development
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {industries.map((i) => (
              <span key={i} className="rounded-full glass border border-border px-4 py-1.5 text-sm text-foreground/85">
                {i}
              </span>
            ))}
          </div>
        </section>
        <BetterBusiness />

        <div className="w-full px-6 sm:px-12">
          <TestimonialsSection />
        </div>


        {/* CTA */}
        <section className="mt-20 w-full px-6 sm:px-12">
          <div className="rounded-3xl glass p-8 text-center sm:p-12">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-gradient sm:text-4xl">
              Ready to take your brand online?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Tell us what you need — you'll get a clear quote and timeline on the same day.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href={waLink("Hello Nandish-Tech! I'd like a quote for my project.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground btn-glow transition hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg glass border border-border px-5 py-3 text-sm font-medium text-foreground transition hover:bg-secondary"
              >
                Contact form <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
        </main>
      )}

      <SiteFooter />
    </div>
  );
}
