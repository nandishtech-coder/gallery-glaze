import { Link } from "@tanstack/react-router";
import { Mail, Briefcase } from "lucide-react";
import { GithubIcon } from "@/components/icons/github";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/50 bg-background/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-semibold text-gradient">Nandish-Tech</h3>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Crafting digital products with care, precision, and a focus on meaningful user experience.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Navigate
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="text-foreground/80 hover:text-foreground">Home</Link></li>
            <li><Link to="/projects" className="text-foreground/80 hover:text-foreground">Projects</Link></li>
            <li><Link to="/about" className="text-foreground/80 hover:text-foreground">About</Link></li>

            <li><Link to="/services" className="text-foreground/80 hover:text-foreground">Services</Link></li>
            <li><Link to="/contact" className="text-foreground/80 hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Services I Offer
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services" className="text-foreground/80 hover:text-foreground">Website Setup / Deployment</Link></li>
            <li><Link to="/services" className="text-foreground/80 hover:text-foreground">Bug Fixing / Small Tasks</Link></li>
            <li><Link to="/services" className="text-foreground/80 hover:text-foreground">Custom Web Development</Link></li>
            <li><Link to="/services" className="text-foreground/80 hover:text-foreground">View all services →</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Connect
          </h4>
          <div className="flex items-center gap-3">
            <a href="mailto:contactnandishtech@gmail.com" aria-label="Email" className="rounded-lg border border-border bg-secondary/40 p-2 text-foreground/80 transition hover:bg-secondary hover:text-foreground">
              <Mail className="h-4 w-4" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="rounded-lg border border-border bg-secondary/40 p-2 text-foreground/80 transition hover:bg-secondary hover:text-foreground">
              <GithubIcon className="h-4 w-4" />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="rounded-lg border border-border bg-secondary/40 p-2 text-foreground/80 transition hover:bg-secondary hover:text-foreground">
              <Briefcase className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Nandish-Tech · All rights reserved.
      </div>
    </footer>
  );
}
