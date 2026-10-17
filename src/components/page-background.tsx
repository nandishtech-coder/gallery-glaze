import techBg from "@/assets/tech-bg.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import heroBg2 from "@/assets/hero-bg-2.jpg";

const images = { tech: techBg, hero: heroBg, hero2: heroBg2 } as const;

export function PageBackground({ variant = "tech" }: { variant?: keyof typeof images }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <img
        src={images[variant]}
        alt=""
        className="bg-pan h-full w-full object-cover opacity-20"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.10),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.10),transparent_40%)]" />

      <div className="glow-orb glow-orb-violet absolute -left-20 top-[-10%] h-80 w-80 sm:h-[28rem] sm:w-[28rem]" />
      <div className="glow-orb glow-orb-cyan absolute right-[-8%] top-[10%] h-72 w-72 sm:h-[22rem] sm:w-[22rem]" />
      <div className="glow-orb glow-orb-blue absolute bottom-[-14%] left-[28%] h-64 w-64 sm:h-80 sm:w-80" />
      <div className="glow-sheen absolute inset-x-[10%] top-0 h-[28rem]" />
      <div className="glow-ring absolute left-1/2 top-[18%] h-72 w-72 -translate-x-1/2 rounded-full border border-white/10" />

      <div className="hero-grid absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(10,14,26,0.48) 0%, rgba(10,14,26,0.72) 45%, rgba(10,14,26,0.96) 100%)" }}
      />
    </div>
  );
}
