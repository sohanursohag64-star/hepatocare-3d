import { Award, BadgeCheck, GraduationCap, Quote, UserRound } from "lucide-react";
import Image from "next/image";
import { fill, type Dict } from "@/i18n/dictionaries";
import { media } from "@/lib/site";
import { ReadMore } from "../ui/ReadMore";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function About({ t }: { t: Dict }) {
  const { about, doctor } = t;
  const highlights = about.highlights.map((h) => ({ ...h, value: fill(h.value, { years: doctor.experienceYears }) }));
  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-x-clip bg-white py-20 sm:py-28">
      <div className="container-page grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* Portrait placeholder */}
        <Reveal className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="absolute -top-5 -left-5 h-32 w-32 rounded-3xl bg-teal-100" aria-hidden />
          <div className="absolute -right-5 -bottom-5 h-40 w-40 rounded-3xl border-2 border-dashed border-navy-200" aria-hidden />
          <figure className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 shadow-lift">
            <div className="bg-grid absolute inset-0 opacity-40 invert" aria-hidden />
            <div className="absolute top-1/4 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-teal-400/25 blur-3xl" aria-hidden />
            {media.doctorPhoto ? (
              <div className="relative aspect-[4/5]">
                <Image
                  src={media.doctorPhoto}
                  alt={fill(about.portraitAlt, { name: doctor.name })}
                  fill
                  sizes="(min-width: 1024px) 40vw, (min-width: 640px) 28rem, 100vw"
                  className="object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-950/80 to-transparent" aria-hidden />
              </div>
            ) : (
            <div className="relative flex aspect-[4/5] flex-col items-center justify-end">
              <svg viewBox="0 0 200 220" className="w-3/4 text-navy-500/70" aria-hidden>
                <circle cx="100" cy="72" r="40" fill="currentColor" />
                <path d="M20 220 C 24 160, 60 128, 100 128 C 140 128, 176 160, 180 220 Z" fill="currentColor" />
                <path d="M86 128 L100 160 L114 128" fill="#ffffff" opacity="0.9" />
                <path d="M70 140 C 64 170, 76 190, 92 196" stroke="#2fbaad" strokeWidth="4" fill="none" strokeLinecap="round" />
                <circle cx="94" cy="198" r="6" fill="#2fbaad" />
              </svg>
            </div>
            )}
            <figcaption className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 text-white backdrop-blur-md">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <UserRound className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display text-base font-semibold">{doctor.name}</span>
                {!media.doctorPhoto && <span className="block text-xs text-navy-200">{about.portraitPlaceholder}</span>}
                {media.doctorPhoto && <span className="block text-xs text-navy-200">{doctor.designation}</span>}
              </span>
            </figcaption>
          </figure>

          <div className="absolute -right-3 top-8 rounded-2xl bg-white p-4 text-center shadow-lift sm:-right-8">
            <span className="block font-display text-3xl font-semibold text-teal-600">{doctor.experienceYears}</span>
            <span className="block text-xs font-medium text-navy-500">
              {about.yearsOf}
              <br />
              {about.experience}
            </span>
          </div>
        </Reveal>

        {/* Content */}
        <div>
          <SectionHeading
            align="left"
            eyebrow={about.eyebrow}
            id="about-title"
            title={
              <>
                {about.titleBefore}
                <span className="italic text-teal-600">{about.titleEm}</span>
                {about.titleAfter}
              </>
            }
          />

          <Reveal delay={0.1}>
            <p className="mt-6 text-base leading-relaxed text-navy-600 sm:text-lg">
              {fill(about.intro, { name: doctor.name })}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {doctor.qualifications.map((q, i) => {
                const Icon = i === 3 ? Award : i === 2 ? BadgeCheck : GraduationCap;
                return (
                  <li
                    key={q.title}
                    className="flex gap-3 rounded-2xl border border-navy-100 bg-mist/60 p-4 transition hover:border-teal-200 hover:bg-white hover:shadow-soft"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-600 shadow-soft">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-navy-900">{q.title}</span>
                      <span className="block text-xs text-navy-500">{q.detail}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            <blockquote className="relative mt-8 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-800 p-6 text-white shadow-lift">
              <Quote className="absolute top-5 right-5 h-8 w-8 text-teal-400/40" aria-hidden />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">{about.philosophyLabel}</p>
              <p className="mt-3 font-display text-lg leading-relaxed text-navy-50 sm:text-xl">
                {about.philosophy}
              </p>
            </blockquote>
          </Reveal>

          <Reveal delay={0.25}>
            <dl className="mt-8 grid grid-cols-3 gap-3">
              {highlights.map((h) => (
                <div key={h.label} className="rounded-2xl border border-navy-100 p-4 text-center">
                  <dt className="sr-only">{h.label}</dt>
                  <dd className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">{h.value}</dd>
                  <dd className="mt-1 text-[0.7rem] leading-snug text-navy-500 sm:text-xs">{h.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.3} className="mt-9">
            <ReadMore labels={{ more: t.common.readMore, less: t.common.showLess }}>
              <div className="space-y-4 text-base leading-relaxed text-navy-600">
                {about.more.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>
            </ReadMore>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
