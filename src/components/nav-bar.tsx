import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Sparkles, LayoutDashboard } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function NavBar() {
  const { user, isAdmin, signOut } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full px-4">
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between gap-2 rounded-2xl glass px-3 py-2.5 sm:px-5 sm:py-3">
        <Link to="/" className="flex shrink-0 items-center gap-1.5 text-sm font-semibold tracking-tight sm:gap-2 sm:text-base">
          <Sparkles className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
          <span className="text-gradient">Nandish-Tech</span>
        </Link>

        <nav className="flex items-center gap-0.5 text-xs sm:gap-1 sm:text-sm">
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
