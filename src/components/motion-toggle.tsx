import { useEffect, useState } from "react";
import { Sparkles, SparklesIcon, Zap, ZapOff } from "lucide-react";

const STORAGE_KEY = "nt-animations-disabled";

export function applyMotionPreference() {
  if (typeof document === "undefined") return;
  const disabled = localStorage.getItem(STORAGE_KEY) === "1";
  document.documentElement.classList.toggle("no-anim", disabled);
}

export function MotionToggle() {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) === "1";
    setDisabled(stored);
    document.documentElement.classList.toggle("no-anim", stored);
  }, []);

  const toggle = () => {
    const next = !disabled;
    setDisabled(next);
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    document.documentElement.classList.toggle("no-anim", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={disabled}
      aria-label={disabled ? "Enable animations" : "Disable animations"}
      title={disabled ? "Enable animations" : "Disable animations"}
      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-foreground/80 transition hover:bg-secondary hover:text-foreground sm:px-3"
    >
      {disabled ? <ZapOff className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
      <span className="hidden sm:inline">{disabled ? "Motion off" : "Motion on"}</span>
    </button>
  );
}
