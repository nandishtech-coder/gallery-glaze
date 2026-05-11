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
    <header className="sticky top-0 z-40 w-full">
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between gap-4 rounded-2xl glass px-5 py-3">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-gradient">Nandish-Tech</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              className="rounded-lg px-3 py-1.5 text-foreground/70 transition hover:bg-secondary hover:text-foreground data-[status=active]:text-foreground data-[status=active]:bg-secondary/60"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 text-sm">
          {user && isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-foreground/80 transition hover:bg-secondary hover:text-foreground"
            >
              <LayoutDashboard className="h-4 w-4" /> Admin
            </Link>
          )}
          {user && (
            <button
              onClick={() => signOut()}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-foreground/80 transition hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="mx-auto mt-2 flex max-w-6xl items-center justify-center gap-1 px-4 text-sm md:hidden">
        {navLinks.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeOptions={{ exact: true }}
            className="rounded-lg px-3 py-1.5 text-foreground/70 transition hover:bg-secondary hover:text-foreground data-[status=active]:text-foreground data-[status=active]:bg-secondary/60"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
