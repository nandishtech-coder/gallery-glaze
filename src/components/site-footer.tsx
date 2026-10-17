import { Link } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram";
import { FacebookIcon } from "@/components/icons/facebook";
import nandishLogo from "@/assets/nandish-logo.png";

export function SiteFooter() {
  return (
    <footer className="mt-24 w-full border-t border-white/10 pt-8" style={{ background: "linear-gradient(180deg, rgba(7,31,90,0.10), rgba(7,31,90,0.22))" }}>
      <div className="page-shell px-4 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-3 rounded-full bg-white/10 px-5 py-2.5 backdrop-blur-sm">
              <img src={nandishLogo} alt="Nandish-Tech" width={30} height={30} className="navbar-logo h-8 w-8 shrink-0 object-contain" />
              <span className="text-xl font-bold tracking-wide text-white">Nandish-Tech</span>
            </div>
          </div>

          <div className="grid gap-8 pb-8 lg:grid-cols-[1.45fr_1fr_1fr_0.8fr] lg:gap-x-6">
            <div className="space-y-4 text-white">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white shadow-md ring-1 ring-white/15">
                  <Phone className="h-4 w-4" />
                </span>
                <a href="tel:+917406386316" className="text-base font-medium text-white/90 transition hover:text-white">
                  7406386316
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white shadow-md ring-1 ring-white/15">
                  <Phone className="h-4 w-4" />
                </span>
                <a href="tel:+918431304103" className="text-base font-medium text-white/90 transition hover:text-white">
                  8431304103
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white shadow-md ring-1 ring-white/15">
                  <Mail className="h-4 w-4" />
                </span>
                <a href="mailto:contactnandishtech@gmail.com" className="break-all text-base font-medium text-white/90 transition hover:text-white">
                  contactnandishtech@gmail.com
                </a>
              </div>
            </div>

            <div>
              <h4 className="mb-6 text-[15px] font-bold uppercase tracking-wide text-white">Our Services</h4>
              <ul className="space-y-3 text-base text-white/80">
                {[
                  "Website Setup / Deployment",
                  "Mobile Application Development",
                  "Website Development",
                  "UI/UX Designing",
                  "Website to Mobile Development",
                ].map((service) => (
                  <li key={service}>
                    <Link to="/services" className="transition hover:text-white">
                      {service}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-[15px] font-bold uppercase tracking-wide text-white">Quick Links</h4>
              <ul className="space-y-3 text-base text-white/80">
                {[
                  { to: "/about", label: "About" },
                  { to: "/services", label: "Services" },
                  { to: "/projects", label: "Pricing" },
                  { to: "/contact", label: "Contact" },
                ].map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-[15px] font-bold uppercase tracking-wide text-white">Social Links</h4>
              <div className="flex items-center gap-4">
                <a href="mailto:contactnandishtech@gmail.com" aria-label="Email" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white shadow-lg ring-1 ring-white/15 transition hover:scale-105">
                  <Mail className="h-5 w-5" />
                </a>
                <a href="https://www.instagram.com/nandish.tech?stkn=czJ5bmR5MTA1cG0x" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white shadow-lg ring-1 ring-white/15 transition hover:scale-105">
                  <InstagramIcon className="h-7 w-7" />
                </a>
                <a href="https://www.facebook.com/share/1F5douFjuA/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white shadow-lg ring-1 ring-white/15 transition hover:scale-105">
                  <FacebookIcon className="h-7 w-7" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/25 pt-6 text-center text-sm text-white/80">
            © {new Date().getFullYear()} Nandish-Tech · All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
