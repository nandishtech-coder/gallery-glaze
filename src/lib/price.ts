export function computeDiscounted(price: string, discountPercent: number): string | null {
  if (!discountPercent || discountPercent <= 0) return null;
  const m = price.match(/^(\D*)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  const [, pre, num, post] = m;
  const n = Number(num.replace(/,/g, ""));
  if (!isFinite(n)) return null;
  const d = Math.round(n * (1 - discountPercent / 100));
  return `${pre}${d.toLocaleString("en-IN")}${post}`;
}
