import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowRight,
  Code2,
  Palette,
  Megaphone,
  ShoppingCart,
  Smartphone,
  Search,
  Sparkles,
  ShieldCheck,
  Rocket,
  Headphones,
  Check,
  MessageCircle,
} from "lucide-react";
import { NavBar } from "@/components/nav-bar";
import { SiteFooter } from "@/components/site-footer";
import { TestimonialsSection } from "@/components/testimonials-section";
import { BetterBusiness } from "@/components/better-business";
import { LiveOffers } from "@/components/live-offers";
import techBg from "@/assets/tech-bg.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import heroBg2 from "@/assets/hero-bg-2.jpg";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nandish-Tech — Web Design, Development & Digital Marketing" },
      {
        name: "description",
        content:
          "Nandish-Tech builds websites, web apps, eCommerce stores and brand identities, with digital marketing that helps your business grow online.",
      },
      { property: "og:title", content: "Nandish-Tech — Web Design, Development & Digital Marketing" },
      {
        property: "og:description",
        content:
          "Websites, web apps, eCommerce, UI/UX, graphics and digital marketing — everything your brand needs to grow online.",
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
  {
    icon: Sparkles,
    title: "Graphics & Branding",
    text: "Logos, brochures, banners and visiting cards with a consistent identity.",
  },
  {
    icon: Megaphone,
    title: "Digital & Social Marketing",
    text: "SEO, social media and campaigns that put your brand in front of buyers.",
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
      {/* Realistic modern-tech backdrop */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <img
          src={techBg}
          alt=""
          width={1920}
          height={1088}
          className="h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      <NavBar />
      <LiveOffers />

      <main>
        {/* Hero */}
        <div className="relative">
          {/* Layered, animated decorative background for the first section */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <img
              src={heroBg}
              alt=""
              width={1920}
              height={1080}
              className="hero-layer bg-pan absolute inset-0 h-full w-full object-cover opacity-30"
            />
            <img
              src={heroBg2}
              alt=""
              width={1920}
              height={1088}
              className="hero-layer hero-layer-2 bg-pan bg-pan-slow absolute inset-0 h-full w-full object-cover opacity-30"
            />
            <img
              src={techBg}
              alt=""
              width={1920}
              height={1088}
              className="hero-layer hero-layer-3 bg-pan absolute inset-0 h-full w-full object-cover opacity-30"
            />
            <div className="aurora left-[-10%] top-[-20%] h-72 w-72 bg-primary/30 sm:h-96 sm:w-96" />
            <div className="aurora aurora-2 right-[-10%] top-[10%] h-72 w-72 bg-accent/25 sm:h-96 sm:w-96" />
            <div className="hero-grid absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
          </div>

          <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-32 text-center sm:pt-28">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground rise-in rise-delay-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Solutions for all your needs
          </div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl rise-in rise-delay-2">
            We focus on growing <br className="hidden sm:block" />
            your <span className="text-gradient">brand online</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-muted-foreground rise-in rise-delay-3">
            Design, development and marketing under one roof — websites, web apps, eCommerce stores and
            brand identity that help startups and businesses look credible and sell more.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 rise-in rise-delay-3">
            <a
              href={waLink("Hello Nandish-Tech! I'd like to get started on a project. Could you share the details?")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground btn-glow transition hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> Get Started
            </a>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-lg glass border border-border px-5 py-3 text-sm font-medium text-foreground transition hover:bg-secondary"
            >
              Find Out More <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>

        {/* Stats */}
        <section className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-4 rounded-2xl glass p-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-semibold text-gradient sm:text-3xl">{s.value}</div>
                <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Solutions */}
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-10 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">What we do</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
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
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-primary">Why choose us</p>
              <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                A freelance partner that actually ships
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
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="mb-10 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">A simple 4-step process</h2>
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
        <section className="mx-auto max-w-6xl px-4 pb-20 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">Industries</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Multi-industry design & marketing
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

        <div className="mx-auto max-w-6xl px-4">
          <TestimonialsSection />
        </div>


        {/* CTA */}
        <section className="mx-auto mt-20 max-w-6xl px-4">
          <div className="rounded-3xl glass p-8 text-center sm:p-12">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
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
