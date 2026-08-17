import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  heading: string;
  subheading: string;
  projects_count: string;
  projects_label: string;
  success_rate: string;
  success_label: string;
}

export function BetterBusiness() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    supabase
      .from("site_stats")
      .select("heading, subheading, projects_count, projects_label, success_rate, success_label")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setStats((data as Stats) ?? null));
  }, []);

  if (!stats) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="grid gap-10 rounded-3xl glass p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-primary">Better business</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {stats.heading}
          </h2>
          <p className="mt-4 text-muted-foreground">{stats.subheading}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {[
            { value: stats.projects_count, label: stats.projects_label },
            { value: stats.success_rate, label: stats.success_label },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="relative grid h-36 w-36 place-items-center rounded-full sm:h-40 sm:w-40">
                <div className="absolute inset-0 rounded-full border-4 border-border" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-accent btn-glow" />
                <span className="text-2xl font-semibold text-gradient sm:text-3xl">{s.value}</span>
              </div>
              <div className="mt-3 max-w-[10rem] text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
