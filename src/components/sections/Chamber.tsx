import { Building2, Clock3, MapPin, Navigation, Phone } from "lucide-react";
import type { Dict } from "@/i18n/dictionaries";
import { contact, media } from "@/lib/site";
import { buttonClasses } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function Chamber({ t, newTab }: { t: Dict["chamber"]; newTab: string }) {
  const chamber = t;
  return (
    <section id="chamber" aria-labelledby="chamber-title" className="bg-mist py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          id="chamber-title"
          eyebrow={t.eyebrow}
          title={t.title}
          description={t.description}
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="flex flex-col gap-4">
            <div className="rounded-3xl bg-gradient-to-br from-navy-900 to-navy-800 p-7 text-white shadow-lift">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-300">
                <Building2 className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold">{chamber.name}</h3>
              <address className="mt-3 flex gap-2 not-italic text-navy-200">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" aria-hidden />
                <span>
                  {chamber.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </address>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="rounded-3xl border border-white bg-white p-6 shadow-soft">
                <p className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                  <Clock3 className="h-4 w-4 text-teal-600" aria-hidden />
                  {t.visitingHours}
                </p>
                <dl className="mt-4 space-y-3 text-sm">
                  {chamber.hours.map((h) => (
                    <div key={h.days} className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-navy-100 pb-3 last:border-0 last:pb-0">
                      <dt className="text-navy-500">{h.days}</dt>
                      <dd className="font-semibold text-navy-800">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-3xl border border-white bg-white p-6 shadow-soft">
                <p className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                  <Phone className="h-4 w-4 text-teal-600" aria-hidden />
                  {t.appointments}
                </p>
                <a
                  href={contact.phoneHref}
                  className="mt-4 block font-display text-xl font-semibold text-navy-900 transition-colors hover:text-teal-600"
                >
                  {contact.phone}
                </a>
                <p className="mt-1 text-xs text-navy-500">{t.callDuring}</p>
              </div>
            </div>
          </Reveal>

          {/* Google Maps embed when configured (media.mapEmbedUrl), otherwise an illustrated placeholder. */}
          <Reveal delay={0.1} className="relative min-h-80 overflow-hidden rounded-3xl border border-white bg-sky-soft shadow-soft">
            {media.mapEmbedUrl ? (
              <iframe
                src={media.mapEmbedUrl}
                title={t.mapTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
              />
            ) : (
              <>
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 600 400" aria-hidden>
                <rect width="600" height="400" fill="#e7f1fa" />
                <path d="M0 290 C 120 250, 210 330, 330 280 S 520 220, 600 250 L600 400 L0 400 Z" fill="#cdf4ef" opacity="0.7" />
                <g stroke="#ffffff" strokeLinecap="round">
                  <path d="M-10 120 L 610 170" strokeWidth="18" />
                  <path d="M180 -10 L 260 410" strokeWidth="14" />
                  <path d="M420 -10 C 400 120, 470 260, 440 410" strokeWidth="12" />
                  <path d="M-10 330 L 610 300" strokeWidth="10" />
                </g>
                <g stroke="#c3d0e8" strokeWidth="2" strokeDasharray="6 8">
                  <path d="M-10 120 L 610 170" />
                  <path d="M180 -10 L 260 410" />
                </g>
                <g fill="#c3d0e8" opacity="0.7">
                  <rect x="40" y="20" width="90" height="70" rx="8" />
                  <rect x="290" y="30" width="100" height="90" rx="8" />
                  <rect x="490" y="40" width="80" height="80" rx="8" />
                  <rect x="40" y="180" width="110" height="80" rx="8" />
                  <rect x="300" y="190" width="90" height="70" rx="8" />
                  <rect x="480" y="200" width="90" height="60" rx="8" />
                </g>
              </svg>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                <span className="absolute top-full left-1/2 h-4 w-12 -translate-x-1/2 -translate-y-2 rounded-full bg-navy-900/20 blur-sm" aria-hidden />
                <span className="relative flex h-14 w-14 animate-bounce items-center justify-center rounded-full rounded-br-none bg-teal-500 text-white shadow-glow [animation-duration:2.4s] rotate-45">
                  <MapPin className="h-6 w-6 -rotate-45" aria-hidden />
                </span>
              </div>

              </>
            )}

            <div className="absolute inset-x-4 bottom-4 flex flex-col gap-3 rounded-2xl bg-white/90 p-4 shadow-lift backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-navy-900">{chamber.name}</p>
                {!media.mapEmbedUrl && <p className="text-xs text-navy-500">{t.mapPlaceholder}</p>}
              </div>
              <a
                href={media.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("primary", "!px-5 !py-2.5")}
              >
                <Navigation className="h-4 w-4" aria-hidden />
                {t.openMaps}
                <span className="sr-only">{newTab}</span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
