export function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="ig-brand" cx="0.32" cy="1.05" r="1.15">
          <stop offset="0%" stopColor="#FFDC80" />
          <stop offset="20%" stopColor="#FCAF45" />
          <stop offset="42%" stopColor="#F77737" />
          <stop offset="60%" stopColor="#F56040" />
          <stop offset="75%" stopColor="#C13584" />
          <stop offset="90%" stopColor="#833AB4" />
          <stop offset="100%" stopColor="#5851DB" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="7" fill="url(#ig-brand)" />
      <rect x="5.6" y="5.6" width="12.8" height="12.8" rx="4.2" fill="none" stroke="#fff" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.1" fill="none" stroke="#fff" strokeWidth="1.7" />
      <circle cx="16.9" cy="7.1" r="1.15" fill="#fff" />
    </svg>
  );
}
