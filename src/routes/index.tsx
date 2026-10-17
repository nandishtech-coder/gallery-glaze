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

  return (
    <div className="relative min-h-screen">
      <PageBackground variant="hero" />

      <NavBar />
      <LiveOffers />

      <main>
        <div className="relative">
          <section className="relative w-full px-6 pb-16 pt-12 sm:px-12 sm:pt-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
              {/* Left: Text content */}
              <div className="flex-1">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground rise-in rise-delay-1">
                  <img src={nandishLogo} alt="Nandish-Tech" className="h-3.5 w-3.5 object-contain" /> Solutions for all your needs
                </div>
                <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-7xl rise-in rise-delay-2">
                  We focus on growing <br />
                  your <span className="text-gradient">brand online</span>.
                </h1>
                <p className="mt-6 max-w-xl text-balance text-lg text-muted-foreground rise-in rise-delay-3">
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
              {/* Right: Brand Trust Panel */}
              <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
                <div className="relative flex flex-col items-center gap-5 rise-in rise-delay-3">
                  {/* Ambient glows */}
                  <div className="aurora pointer-events-none absolute -top-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
                  <div className="aurora aurora-2 pointer-events-none absolute top-10 right-0 h-48 w-48 rounded-full bg-accent/20 blur-2xl" />

                  {/* Main brand card */}
                  <div className="relative z-10 w-full rounded-3xl glass border border-white/10 p-8 shadow-2xl backdrop-blur-xl">
                    {/* Logo + brand name */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-primary/30 blur-md" />
                        <img src={nandishLogo} alt="Nandish-Tech" className="relative h-20 w-20 object-contain drop-shadow-lg" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold tracking-tight text-foreground">Nandish-Tech</p>
                        <p className="text-sm text-primary font-medium">Web Design &amp; Development</p>
                      </div>
                      {/* Verified badge */}
                      <div className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 border border-primary/40">
                        <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                    {/* Trust badges row */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {/* 100% Satisfaction badge */}
                      <div className="flex flex-col items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 py-3 px-4">
                        <svg className="h-7 w-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                        </svg>
                        <span className="text-xs text-emerald-400 font-bold leading-tight text-center">100%<br />Satisfaction</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 rounded-xl bg-primary/10 border border-primary/30 py-3 px-4">
                        <svg className="h-7 w-7 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                        <span className="text-xs text-primary font-bold leading-tight text-center">MSME<br />Verified</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 rounded-xl py-3 px-4" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)" }}>
                        <svg className="h-7 w-7 text-accent" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                        <span className="text-xs text-muted-foreground font-medium">Fast Delivery</span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="mb-3 h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent)" }} />

                    {/* Happy clients row */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-semibold text-foreground">Happy Clients</p>
                        <p className="text-sm text-muted-foreground mt-0.5">Trusted by businesses across India</p>
                      </div>
                      <div className="flex items-center">
                        {/* Stacked avatar bubbles */}
                        {["N", "R", "S", "A", "M"].map((letter, i) => (
                          <div
                            key={i}
                            className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-background text-xs font-bold text-white"
                            style={{
                              marginLeft: i === 0 ? 0 : -10,
                              zIndex: 5 - i,
                              background: `hsl(${(i * 60 + 200) % 360}, 70%, 45%)`
                            }}
                          >
                            {letter}
                          </div>
                        ))}
                        <div className="relative ml-[-10px] flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary text-[10px] font-bold text-primary-foreground" style={{ zIndex: 0 }}>
                          30+
                        </div>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Stats */}
        <section className="w-full px-6 sm:px-12">
          <div className="grid grid-cols-2 gap-4 rounded-2xl glass p-6 sm:grid-cols-4">
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

      <SiteFooter />
    </div>
  );
}
