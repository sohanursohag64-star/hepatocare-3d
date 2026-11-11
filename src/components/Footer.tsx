import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { chamber, doctor, navLinks, site } from "@/lib/site";
import { Logo } from "./Logo";

/** Minimal inline brand glyphs (lucide-react no longer ships brand icons). */
const socials = [
  {
    label: "Facebook",
    path: "M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v1.9H8v3.2h2.6V21H14v-9.3h2.6l.4-3.2H14Z",
  },
  {
    label: "LinkedIn",
    path: "M6.9 8.8H3.6V20h3.3V8.8ZM5.2 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM20.4 13.6c0-3-1.6-4.9-4.2-4.9-1.5 0-2.5.8-2.9 1.6V8.8H10V20h3.3v-5.6c0-1.5.3-2.9 2.1-2.9 1.8 0 1.8 1.7 1.8 3V20h3.3l-.1-6.4Z",
  },
  {
    label: "YouTube",
    path: "M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z",
  },
  {
    label: "Instagram",
    path: "M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm4.8-8.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2ZM12 3.6c2.7 0 3 0 4.1.1 2.7.1 4 1.4 4.1 4.1.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c-.1 2.7-1.4 4-4.1 4.1-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-2.7-.1-4-1.4-4.1-4.1C3.7 15 3.6 14.7 3.6 12s0-3 .1-4.1c.1-2.7 1.4-4 4.1-4.1 1.1-.1 1.4-.2 4.2-.2Z",
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="contact" aria-labelledby="footer-title" className="relative bg-navy-950 text-navy-200">
      <h2 id="footer-title" className="sr-only">
        Contact and site information
      </h2>
      <div className="h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" aria-hidden />

      <div className="container-page grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr] lg:gap-16">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo tone="light" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-navy-300">
            {site.description}
          </p>
          <p className="mt-4 text-sm text-navy-300">
            <span className="font-semibold text-white">{doctor.name}</span>
            <br />
            {doctor.designation}
          </p>
          <ul className="mt-6 flex gap-2.5" aria-label="Social media">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href="#"
                  aria-label={`${s.label} (link coming soon)`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-navy-200 transition hover:-translate-y-0.5 hover:border-teal-400/50 hover:bg-teal-500 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">Quick Links</h3>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-1">
            {[...navLinks, { label: "Book Appointment", href: "#appointment" }].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-teal-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">Contact</h3>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" aria-hidden />
              <address className="not-italic">
                {chamber.name}
                <br />
                {chamber.addressLines.join(", ")}
              </address>
            </li>
            <li>
              <a href={chamber.phoneHref} className="flex gap-3 transition-colors hover:text-teal-300">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" aria-hidden />
                {chamber.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${chamber.email}`} className="flex gap-3 break-all transition-colors hover:text-teal-300">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" aria-hidden />
                {chamber.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 text-xs text-navy-400 sm:flex-row">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="text-center">Information on this website is general and does not replace a medical consultation.</p>
          <Link
            href="#home"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 transition hover:border-teal-400/50 hover:text-teal-300"
          >
            <ArrowUp className="h-3.5 w-3.5" aria-hidden />
            Back to top
          </Link>
        </div>
      </div>
    </footer>
  );
}
