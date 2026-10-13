import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { checkAdminOtp } from "@/lib/admin-otp.functions";
import { LogOut, LayoutDashboard } from "lucide-react";
import nandishLogo from "@/assets/nandish-logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;


export function NavBar() {
  const { user, isAdmin, signOut } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const [otpVerified, setOtpVerified] = useState(false);

  useEffect(() => {
    if (!user || !isAdmin) { setOtpVerified(false); return; }
    let cancelled = false;
    checkAdminOtp()
      .then((r) => { if (!cancelled) setOtpVerified(!!r.verified); })
      .catch(() => { if (!cancelled) setOtpVerified(false); });
    return () => { cancelled = true; };
  }, [user, isAdmin, pathname]);

  const showAdminControls = !!user && isAdmin && otpVerified;

  return (
    <header className="sticky top-0 z-40 w-full px-2 sm:px-4 rise-in">
      <div className="mx-auto mt-4 flex max-w-6xl flex-col items-center gap-2 rounded-2xl glass px-3 py-2 sm:flex-row sm:justify-between sm:gap-3 sm:px-5 sm:py-3">
        <Link
          to={isAdminPage ? "/admin" : "/"}
          className="flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl"
        >
          <img src={nandishLogo} alt="" width={48} height={48} className="navbar-logo h-11 w-11 shrink-0 object-contain sm:h-12 sm:w-12" />
          <span className="text-gradient text-glow whitespace-nowrap">
            {isAdminPage ? "Admin Dashboard" : "NANDISH-TECH"}
          </span>
        </Link>

        {!isAdminPage && (
          <nav className="flex flex-wrap items-center justify-center gap-0.5 text-[12px] sm:gap-1 sm:text-sm">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: true }}
                className="rounded-lg px-2 py-1.5 text-foreground/70 transition hover:bg-secondary hover:text-foreground active:bg-secondary active:text-foreground sm:px-3 data-[status=active]:bg-secondary/60 data-[status=active]:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex shrink-0 items-center gap-1 text-sm">
          <ThemeToggle />
          {showAdminControls && !isAdminPage && (
            <Link
              to="/admin"
              aria-label="Admin"
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-foreground/80 transition hover:bg-secondary hover:text-foreground sm:px-3"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}
          {showAdminControls && (
            <button
              onClick={() => signOut()}
              aria-label="Sign out"
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-foreground/80 transition hover:bg-secondary hover:text-foreground sm:px-3"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
