import { Phone } from "lucide-react";

const ADMIN_PHONE = "917899560461";

export function FloatingContact() {
  return (
    <div className="fixed bottom-5 left-4 z-50 flex flex-col gap-3">
      <a
        href={`tel:+${ADMIN_PHONE}`}
        aria-label="Call us"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition hover:scale-110 hover:bg-emerald-400"
      >
        <Phone className="h-5 w-5" />
      </a>
      <a
        href={`https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(
          "Hello Nandish-Tech! I'd like to discuss a project. Could you share more details?",
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-500/30 transition hover:scale-110"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-40" />
        <svg viewBox="0 0 24 24" fill="currentColor" className="relative h-6 w-6">
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.08-.3-.15-1.12-.41-2.13-1.32-.79-.7-1.32-1.57-1.47-1.87-.15-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.34 5.09 4.55 2.99 1.2 2.99.8 3.53.75.54-.05 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" />
          <path d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.32 4.94L2 22l5.36-1.4a9.83 9.83 0 004.68 1.19h.01c5.43 0 9.85-4.42 9.85-9.86C21.9 6.42 17.47 2 12.04 2zm0 17.93a8.1 8.1 0 01-4.13-1.13l-.3-.18-3.07.8.82-3-.19-.31a8.07 8.07 0 01-1.24-4.3c0-4.47 3.64-8.1 8.11-8.1a8.1 8.1 0 018.1 8.11c0 4.47-3.63 8.1-8.1 8.1z" />
        </svg>
      </a>
    </div>
  );
}
