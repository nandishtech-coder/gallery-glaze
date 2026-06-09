import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Sparkles, LayoutDashboard } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
] as const;

export function NavBar() {
  const { user, isAdmin, signOut } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full px-2 sm:px-4 rise-in">
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between gap-1 rounded-2xl glass px-2 py-2 sm:gap-2 sm:px-5 sm:py-3">
        <Link to="/" className="flex min-w-0 shrink items-center gap-1 text-sm font-semibold tracking-tight sm:gap-2 sm:text-base">
          <Sparkles className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
          <span className="text-gradient hidden xs:inline sm:inline">Nandish-Tech</span>
        </Link>

        <nav className="flex shrink-0 items-center gap-0 text-[11px] sm:gap-1 sm:text-sm">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              className="rounded-lg px-1.5 py-1.5 text-foreground/70 transition hover:bg-secondary hover:text-foreground active:bg-secondary active:text-foreground sm:px-3 data-[status=active]:bg-secondary/60 data-[status=active]:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 text-sm">
          {user && isAdmin && (
            <Link
              to="/admin"
              aria-label="Admin"
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-foreground/80 transition hover:bg-secondary hover:text-foreground sm:px-3"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}
          {user && (
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
