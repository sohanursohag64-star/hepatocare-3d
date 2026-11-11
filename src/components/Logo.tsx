type LogoProps = { tone?: "dark" | "light"; className?: string };

/** HepatoCare wordmark with a stylised liver-and-cross monogram. */
export function Logo({ tone = "dark", className = "" }: LogoProps) {
  const light = tone === "light";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden>
        <defs>
          <linearGradient id={`logo-g-${tone}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2fbaad" />
            <stop offset="1" stopColor="#0c8079" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="12" fill={light ? "#ffffff" : "#0d1838"} />
        <path
          d="M8.5 19.5c0-5.2 4.6-8.6 11.5-8.6 5.8 0 10.6 1.7 12.8 5 .6.9.1 1.8-.9 1.9-3.6.4-6.9 2.1-9.5 4.8-2.6 2.8-5.7 5.1-8.5 4.6-3.3-.6-5.4-3.9-5.4-7.7Z"
          fill={`url(#logo-g-${tone})`}
        />
        <path d="M17 15.5h2.4v2.4h2.4v2.4h-2.4v2.4H17v-2.4h-2.4v-2.4H17z" fill={light ? "#0d1838" : "#ffffff"} />
      </svg>
      <span className={`font-display text-xl font-semibold tracking-tight ${light ? "text-white" : "text-navy-900"}`}>
        Hepato<span className={light ? "text-teal-300" : "text-teal-600"}>Care</span>
      </span>
    </span>
  );
}
