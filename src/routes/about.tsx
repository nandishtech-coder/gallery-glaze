import { createFileRoute } from "@tanstack/react-router";
import { NavBar } from "@/components/nav-bar";
import { PageBackground } from "@/components/page-background";
import { SiteFooter } from "@/components/site-footer";
import { Code2, Sparkles, Rocket, Layers } from "lucide-react";
import nandishLogo from "@/assets/nandish-logo.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "About — Nandish-Tech" },
      { name: "description", content: "About Nandish-Tech: building thoughtful, modern digital products." },
      { property: "og:title", content: "About — Nandish-Tech" },
      { property: "og:description", content: "About Nandish-Tech: building thoughtful, modern digital products." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Sparkles, title: "Craft", text: "Pixel-level care, motion that feels right, and details that make products feel alive." },
  { icon: Code2, title: "Engineering", text: "Modern stacks: React, TypeScript, Tailwind, and serverless backends — built to scale." },
  { icon: Rocket, title: "Velocity", text: "Ship fast, iterate based on real signal, and keep the user at the center of every decision." },
  { icon: Layers, title: "Systems", text: "Design tokens, reusable patterns, and clean architecture — for teams that need to move." },
];

function AboutPage() {
  return (
    <div className="relative min-h-screen">
      <PageBackground variant="hero" />
      <NavBar />
      <main className="page-shell px-4 pb-20 pt-0 sm:pt-0">
        <header className="pb-6 pt-6 text-center sm:pt-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground rise-in rise-delay-1">
            <img src={nandishLogo} alt="Nandish-Tech" className="h-3.5 w-3.5 object-contain" /> Available for new work
          </div>
          <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl rise-in rise-delay-2">
            Building <span className="text-gradient">digital experiences</span><br />
            with care and precision.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-muted-foreground rise-in rise-delay-3">
            Nandish-Tech is an independent studio focused on designing and engineering modern digital
            products — from polished marketing sites to full-stack applications and dashboards.
          </p>
        </header>

        <section className="mt-14 grid gap-5 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl glass p-6 card-hover">
              <div className="mb-3 inline-flex rounded-lg bg-secondary/60 p-2">
                <v.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold">{v.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </section>

        <section className="mt-14 rounded-2xl glass p-8 card-hover">
          <h2 className="text-xl font-semibold text-gradient">What I do</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            I work end-to-end on web products — design systems, frontend architecture, and the backend
            services that power them. Recent work spans healthcare platforms, internal tools, and SaaS
            dashboards. I care about typography, performance, accessibility, and the small details that
            make software feel considered.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
