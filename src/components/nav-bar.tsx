import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Sparkles, LayoutDashboard } from "lucide-react";

export function NavBar() {
  const { user, isAdmin, signOut } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-2xl glass px-5 py-3">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-gradient">Portfolio</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          {user && isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-foreground/80 hover:bg-secondary hover:text-foreground transition"
            >
              <LayoutDashboard className="h-4 w-4" /> Admin
            </Link>
          )}
          {user && (
            <button
              onClick={() => signOut()}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-foreground/80 hover:bg-secondary hover:text-foreground transition"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
