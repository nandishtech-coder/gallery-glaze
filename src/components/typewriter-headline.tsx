import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const SEGMENTS = [
  { text: "We focus on ", accent: false },
  { text: "growing your brand", accent: true },
  { text: " online for you...", accent: false },
] as const;

const FULL_TEXT = SEGMENTS.map((s) => s.text).join("");
const TYPE_BASE_MS = 55;
const TYPE_JITTER_MS = 45;
const PUNCTUATION_PAUSE_MS = 240;
const DELETE_BASE_MS = 30;
const HOLD_FULL_MS = 2000;
const HOLD_EMPTY_MS = 500;

/**
 * True when the visitor has not asked for reduced motion (via OS setting or
 * the in-app motion toggle), so the typewriter loop may run.
 */
function useMotionEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compute = () =>
      setEnabled(!mq.matches && !document.documentElement.classList.contains("no-anim"));
    compute();
    mq.addEventListener("change", compute);
    const observer = new MutationObserver(compute);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      mq.removeEventListener("change", compute);
      observer.disconnect();
    };
  }, []);

  return enabled;
}

/**
 * Infinite type-and-delete headline with ZERO layout shift:
 * an invisible copy of the full sentence reserves the exact space (including
 * wrapped lines), while the typed text renders in the same grid cell on top.
 */
export function TypewriterHeadline({ className }: { className?: string }) {
  const motion = useMotionEnabled();
  const [count, setCount] = useState(FULL_TEXT.length);
  const [deleting, setDeleting] = useState(false);
  const startedRef = useRef(false);

  // After hydration, start from an empty headline.
  useEffect(() => {
    if (!motion) {
      startedRef.current = false;
      setCount(FULL_TEXT.length);
      setDeleting(false);
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;
    setCount(0);
  }, [motion]);

  useEffect(() => {
    if (!motion || !startedRef.current) return;

    if (!deleting) {
      if (count < FULL_TEXT.length) {
        const nextChar = FULL_TEXT[count];
        const pause = ".,".includes(nextChar) ? PUNCTUATION_PAUSE_MS : 0;
        const t = window.setTimeout(
          () => setCount((c) => c + 1),
          TYPE_BASE_MS + Math.random() * TYPE_JITTER_MS + pause,
        );
        return () => window.clearTimeout(t);
      }
      const t = window.setTimeout(() => setDeleting(true), HOLD_FULL_MS);
      return () => window.clearTimeout(t);
    }

    if (count > 0) {
      const t = window.setTimeout(
        () => setCount((c) => c - 1),
        DELETE_BASE_MS + Math.random() * 18,
      );
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setDeleting(false), HOLD_EMPTY_MS);
    return () => window.clearTimeout(t);
  }, [count, deleting, motion]);

  let remaining = count;
  const typed = SEGMENTS.map((seg, i) => {
    if (remaining <= 0) return null;
    const text = seg.text.slice(0, remaining);
    remaining -= seg.text.length;
    return text ? (
      <span key={i} className={seg.accent ? "type-accent" : undefined}>
        {text}
      </span>
    ) : null;
  });

  return (
    <h1 aria-label={FULL_TEXT} className={cn("text-foreground", className)}>
      <span aria-hidden="true" className="type-stack">
        {/* Invisible full sentence: reserves the final height so nothing moves. */}
        <span className="type-cell type-ghost">
          {FULL_TEXT}
          <span className="type-cursor-ghost" />
        </span>
        <span className="type-cell">
          {typed}
          {motion && <span className="type-cursor" />}
        </span>
      </span>
    </h1>
  );
}
