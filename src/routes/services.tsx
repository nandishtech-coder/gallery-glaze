import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Sparkles, MessageCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { NavBar } from "@/components/nav-bar";
import { SiteFooter } from "@/components/site-footer";
import { computeDiscounted } from "@/lib/price";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services I Offer — Nandish-Tech" },
      { name: "description", content: "Professional web development and digital solutions tailored to your business needs." },
      { property: "og:title", content: "Services I Offer — Nandish-Tech" },
      { property: "og:description", content: "Professional web development and digital solutions tailored to your business needs." },
    ],
  }),
  component: ServicesPage,
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

const ADMIN_WHATSAPP = "917899560461";

function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setServices((data ?? []) as Service[]);
        setLoading(false);
      });
  }, []);

  const wa = (s: Service) => {
    const discounted = computeDiscounted(s.price, s.discount_percent);
    const priceLine = discounted
      ? `${discounted} ${s.price_suffix} (after ${s.discount_percent}% off, original ${s.price})`
      : `${s.price} ${s.price_suffix}`;
    const msg = `Hello! I'm interested in your *${s.title}* service (${priceLine}).\n\nCould you please share more details and the next steps?\n\nThank you!`;
    return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(msg)}`;
  };

  const customWa = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(
    "Hello! I have a custom project requirement and would like to discuss a tailored solution. Could we connect?"
  )}`;

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 pt-16 pb-24">
        <section className="mb-12 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground rise-in rise-delay-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> What I can build for you
          </div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl rise-in rise-delay-2">
            Services <span className="text-gradient">I Offer</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-muted-foreground rise-in rise-delay-3">
            Professional web development and digital solutions tailored to your business needs.
          </p>
        </section>

        {loading ? (
          <div className="py-16 text-center text-muted-foreground">
            <Loader2 className="mx-auto h-5 w-5 animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl glass p-12 text-center text-muted-foreground">
            No services have been added yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <article
                key={s.id}
                className="group relative flex flex-col rounded-2xl glass p-6 transition hover:border-primary/40"
              >
                {s.popular && (
                  <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow-lg">
                    Popular
                  </span>
                )}
                {s.discount_percent > 0 && (
                  <span className="absolute -top-3 right-6 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg">
                    {s.discount_percent}% OFF
                  </span>
                )}
                <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 min-h-[3rem] text-sm text-muted-foreground">{s.description}</p>

                {(() => {
                  const discounted = computeDiscounted(s.price, s.discount_percent);
                  return (
                    <div className="mt-4 flex items-baseline gap-2 flex-wrap">
                      <span className="text-3xl font-bold text-gradient">{discounted ?? s.price}</span>
                      {discounted && (
                        <span className="text-sm text-muted-foreground line-through">{s.price}</span>
                      )}
                      <span className="text-xs text-muted-foreground">{s.price_suffix}</span>
                    </div>
                  );
                })()}

                <ul className="mt-5 flex-1 space-y-2.5">
                  {s.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={wa(s)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground btn-glow transition hover:opacity-90"
                >
                  <MessageCircle className="h-4 w-4" /> {s.cta_label || "Get Started"}
                </a>
              </article>
            ))}
          </div>
        )}

        <section className="mt-16 rounded-2xl glass-strong p-8 text-center sm:p-12">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Custom Solutions Available</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Have a unique project requirement? Let's discuss your specific needs and create a custom solution tailored to you.
          </p>
          <a
            href={customWa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground btn-glow transition hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" /> Contact Me for Custom Quote
          </a>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
