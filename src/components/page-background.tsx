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
        className="h-full w-full object-cover opacity-30"
      />
      <div className="aurora left-[-20%] top-[-15%] h-64 w-64 bg-primary/25 sm:h-96 sm:w-96" />
      <div className="aurora aurora-2 right-[-15%] top-[20%] h-64 w-64 bg-accent/20 sm:h-96 sm:w-96" />
      <div className="hero-grid absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/75 to-background" />
    </div>
  );
}
