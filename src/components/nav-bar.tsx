import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { checkAdminOtp } from "@/lib/admin-otp.functions";
import { LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import nandishLogo from "@/assets/nandish-logo.png";

interface NavBarProps {
  liveOffersOpen?: boolean;
  onToggleLiveOffers?: () => void;
}

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function NavBar({
  liveOffersOpen = false,
  onToggleLiveOffers,
}: NavBarProps) {
  const { user, isAdmin, signOut } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const [otpVerified, setOtpVerified] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user || !isAdmin) { setOtpVerified(false); return; }
    let cancelled = false;
    checkAdminOtp()
      .then((r) => { if (!cancelled) setOtpVerified(!!r.verified); })
      .catch(() => { if (!cancelled) setOtpVerified(false); });
    return () => { cancelled = true; };
  }, [user, isAdmin, pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const showAdminControls = !!user && isAdmin && otpVerified;

  return (
    <header className={`sticky top-0 z-40 w-full rise-in nav-bar ${scrolled ? "nav-bar--scrolled" : ""}`}>
      <style>{`
        /* ── Gradient accent line ── */
        .nav-bar::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #6366f1 30%, #22d3ee 70%, transparent 100%);
          opacity: 0.6;
        }

        /* ── Dark navbar ── */
        .nav-bar {
          background: rgba(10, 14, 26, 0.6);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border-bottom: 1px solid rgba(99, 102, 241, 0.12);
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }
        .nav-bar--scrolled {
          background: rgba(10, 14, 26, 0.88);
          box-shadow: 0 1px 0 rgba(99,102,241,0.12), 0 8px 32px rgba(0,0,0,0.4);
        }

        /* ── Light navbar ── */
        :root.light .nav-bar {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
        }
        :root.light .nav-bar--scrolled {
          background: rgba(255, 255, 255, 0.93);
          box-shadow: 0 1px 0 rgba(15,23,42,0.08), 0 4px 20px rgba(0,0,0,0.06);
        }
        :root.light .nav-bar::before {
          background: linear-gradient(90deg, transparent 0%, #4f46e5 30%, #0891b2 70%, transparent 100%);
          opacity: 0.5;
        }

        /* ── Active link ── */
        .nav-link-active {
          color: #6366f1 !important;
          background: rgba(99, 102, 241, 0.10);
          position: relative;
        }
        .nav-link-active::after {
          content: "";
          position: absolute;
          bottom: 3px;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 2px;
          border-radius: 99px;
          background: linear-gradient(90deg, #6366f1, #22d3ee);
        }

        :root.light .nav-link-active {
          color: #4f46e5 !important;
          background: rgba(79, 70, 229, 0.08);
        }
        :root.light .nav-link-active::after {
          background: linear-gradient(90deg, #4f46e5, #0891b2);
        }

        /* ── Nav shimmer keyframes ── */
        @keyframes nav-shimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>

      <div className="flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-8">

        {/* Logo */}
        <Link
          to={isAdminPage ? "/admin" : "/"}
          className="flex shrink-0 items-center gap-2.5 group"
        >
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full blur-md transition-all duration-300 group-hover:blur-lg"
              style={{ background: "rgba(99,102,241,0.35)" }}
            />
            <img
              src={nandishLogo}
              alt="Nandish-Tech"
              width={44}
              height={44}
              className="navbar-logo relative h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
            />
          </div>
          <span className="text-gradient text-glow whitespace-nowrap text-xl font-bold tracking-tight sm:text-2xl">
            {isAdminPage ? "Admin Dashboard" : "NANDISH-TECH"}
          </span>
        </Link>

        {/* Nav links */}
        {!isAdminPage && (
          <nav className="hidden items-center justify-center gap-0.5 text-[13px] sm:gap-1 sm:text-sm lg:flex">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: true }}
                activeProps={{ className: "relative rounded-lg px-3 py-1.5 nav-link-active font-medium transition-all duration-200" }}
                inactiveProps={{ className: "relative rounded-lg px-3 py-1.5 text-foreground/60 font-medium transition-all duration-200 hover:text-foreground hover:bg-white/5" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right: theme + admin */}
        <div className="ml-auto flex shrink-0 items-center gap-1 text-sm lg:ml-0">
          {!isAdminPage && onToggleLiveOffers && (
            <button
              type="button"
              onClick={onToggleLiveOffers}
              className={`hidden items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-all sm:inline-flex sm:px-3 ${
                liveOffersOpen
                  ? "border-primary/30 bg-primary/10 text-primary shadow-[0_0_18px_rgba(99,102,241,0.18)]"
                  : "border-white/10 bg-white/5 text-foreground/70 hover:border-primary/20 hover:text-foreground"
              }`}
              aria-label="Toggle live offers"
            >
              <img
                src={nandishLogo}
                alt="Nandish-Tech"
                className="h-4 w-4 shrink-0 rounded-full object-contain"
              />
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: "#818cf8" }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "#22d3ee" }} />
              </span>
              <span className="hidden sm:inline">Live offers</span>
            </button>
          )}
          <ThemeToggle />
          {showAdminControls && !isAdminPage && (
            <Link
              to="/admin"
              aria-label="Admin"
              className="hidden items-center gap-1.5 rounded-lg px-2 py-1.5 text-foreground/60 transition-all hover:bg-white/8 hover:text-foreground sm:inline-flex sm:px-3"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}
          {showAdminControls && (
            <button
              onClick={() => signOut()}
              aria-label="Sign out"
              className="hidden items-center gap-1.5 rounded-lg px-2 py-1.5 text-foreground/60 transition-all hover:bg-white/8 hover:text-foreground sm:inline-flex sm:px-3"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          )}
          {!isAdminPage && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-foreground/80 transition hover:border-primary/20 hover:text-foreground lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {!isAdminPage && (
        <>
          <div
            className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
            onClick={() => setMobileMenuOpen(false)}
          />

          <aside
            className={`fixed right-0 top-0 z-50 flex h-full w-[82vw] max-w-xs flex-col border-l border-white/10 bg-slate-950/95 p-5 shadow-2xl backdrop-blur-xl transition-transform duration-300 lg:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
            aria-label="Mobile navigation"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src={nandishLogo} alt="Nandish-Tech" className="h-8 w-8 object-contain" />
                <span className="text-base font-semibold text-foreground">NANDISH-TECH</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-foreground/80 transition hover:text-foreground"
                aria-label="Close navigation menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  activeOptions={{ exact: true }}
                  onClick={() => setMobileMenuOpen(false)}
                  activeProps={{ className: "flex items-center justify-between rounded-xl bg-primary/10 px-3 py-3 text-sm font-medium text-primary border border-primary/20" }}
                  inactiveProps={{ className: "flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-medium text-foreground/80 hover:border-primary/20 hover:text-foreground" }}
                >
                  <span>{l.label}</span>
                  <span className="text-xs text-foreground/40">→</span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto space-y-3 border-t border-white/10 pt-5">
              {!isAdminPage && onToggleLiveOffers && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onToggleLiveOffers();
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-3 text-sm font-medium text-primary"
                >
                  <img src={nandishLogo} alt="Nandish-Tech" className="h-4 w-4 object-contain" />
                  Live offers
                </button>
              )}

              {showAdminControls && !isAdminPage && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-medium text-foreground/80"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin
                </Link>
              )}

              {showAdminControls && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-medium text-foreground/80"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              )}
            </div>
          </aside>
        </>
      )}
    </header>
  );
}
