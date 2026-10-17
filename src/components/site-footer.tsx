import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram";
import { FacebookIcon } from "@/components/icons/facebook";
import nandishLogo from "@/assets/nandish-logo.png";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t" style={{ borderColor: "rgba(99,102,241,0.12)", background: "rgba(10,14,26,0.6)" }}>
      <div className="page-shell px-4 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <img src={nandishLogo} alt="" width={36} height={36} className="navbar-logo h-8 w-8 shrink-0 object-contain" />
              <span className="text-base font-bold text-gradient text-glow">Nandish-Tech</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#8892b4" }}>
              Crafting digital products with care, precision, and a focus on meaningful user experience.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#6366f1" }}>
              Navigate
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/projects", label: "Projects" },
                { to: "/about", label: "About" },
                { to: "/services", label: "Services" },
                { to: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="transition-colors duration-150"
                    style={{ color: "#8892b4" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f4ff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#8892b4")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#6366f1" }}>
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                "Website Setup / Deployment",
                "Bug Fixing / Small Tasks",
                "Custom Web Development",
              ].map((s) => (
                <li key={s}>
                  <Link
                    to="/services"
                    className="transition-colors duration-150"
                    style={{ color: "#8892b4" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f4ff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#8892b4")}
                  >
                    {s}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/services"
                  className="transition-colors duration-150 font-medium"
                  style={{ color: "#a5b4fc" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#6366f1")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#a5b4fc")}
                >
                  View all services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#6366f1" }}>
              Connect
            </h4>
            <div className="flex items-center gap-3">
              <a href="mailto:contactnandishtech@gmail.com" aria-label="Email" className="social-brand social-mail">
                <Mail className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/nandish.tech?stkn=czJ5bmR5MTA1cG0x" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-brand social-ig">
                <InstagramIcon className="h-8 w-8" />
              </a>
              <a href="https://www.facebook.com/share/1F5douFjuA/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-brand social-fb">
                <FacebookIcon className="h-8 w-8" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-center text-xs sm:flex-row sm:text-left"
          style={{ borderColor: "rgba(99,102,241,0.10)", color: "#64748b" }}
        >
          <span>© {new Date().getFullYear()} Nandish-Tech · All rights reserved.</span>
          <span className="opacity-60">Built with ♥ in India</span>
        </div>
      </div>
    </footer>
  );
}
