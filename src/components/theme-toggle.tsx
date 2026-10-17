import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "nt-theme";

export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const isLight = stored === "light";
    setLight(isLight);
    document.documentElement.classList.toggle("light", isLight);
    document.documentElement.classList.toggle("dark", !isLight);
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    localStorage.setItem(STORAGE_KEY, next ? "light" : "dark");
    document.documentElement.classList.toggle("light", next);
    document.documentElement.classList.toggle("dark", !next);
  };

  return (
    <button
      type="button"
      id="theme-toggle-btn"
      onClick={toggle}
      aria-pressed={light}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      title={light ? "Switch to dark mode" : "Switch to light mode"}
      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-foreground/60 transition-all duration-200 hover:text-foreground sm:px-3"
      style={{
        background: light
          ? "rgba(79,70,229,0.08)"
          : "rgba(99,102,241,0.10)",
        border: light
          ? "1px solid rgba(79,70,229,0.15)"
          : "1px solid rgba(99,102,241,0.18)",
      }}
    >
      {light
        ? <Moon className="h-[15px] w-[15px] text-indigo-600" />
        : <Sun className="h-[15px] w-[15px] text-indigo-400" />
      }
      <span className="hidden text-xs font-medium sm:inline" style={{ color: light ? "#4f46e5" : "#a5b4fc" }}>
        {light ? "Dark" : "Light"}
      </span>
    </button>
  );
}
