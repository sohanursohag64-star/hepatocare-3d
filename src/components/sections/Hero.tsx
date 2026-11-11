"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, CalendarCheck, HeartPulse, ShieldCheck, Stethoscope } from "lucide-react";
import type { Dict } from "@/i18n/dictionaries";
import { Liver3D } from "../three/Liver3D";
import { ButtonLink } from "../ui/Button";
import { Magnetic } from "../ui/Magnetic";
import { WordReveal } from "../ui/WordReveal";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1 + i * 0.1, ease } }),
};

export function Hero({ t }: { t: Dict }) {
  const { hero, doctor } = t;
  // Hide the floating chips while a 3D hotspot description is open, so they never cover it.
  const [hotspotOpen, setHotspotOpen] = useState(false);
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-gradient-to-b from-sky-soft via-mist to-white pt-28 pb-20 sm:pt-32 lg:pt-36 lg:pb-28"
    >
      {/* Background atmosphere */}
      <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" aria-hidden />
      <div className="animate-aura absolute -top-40 -right-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-teal-200/45 blur-3xl" aria-hidden />
      <div className="animate-aura-slow absolute top-1/3 -left-48 -z-10 h-[28rem] w-[28rem] rounded-full bg-navy-200/45 blur-3xl" aria-hidden />
      <div className="animate-aura absolute bottom-0 left-1/3 -z-10 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl [animation-delay:-6s]" aria-hidden />

      <div className="container-page grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        {/* Copy */}
        <div className="relative z-10 min-w-0 text-center lg:text-left">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-teal-700 shadow-soft backdrop-blur"
          >
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
            </span>
            {hero.badge}
          </motion.p>

          <h1
            id="hero-title"
            className="mt-6 font-display text-[2.6rem] leading-[1.05] font-medium tracking-tight text-balance text-navy-900 sm:text-6xl lg:text-[4.25rem]"
          >
            <WordReveal text={hero.title1} delay={0.15} />{" "}
            <span className="relative whitespace-nowrap">
              <WordReveal
                text={hero.title2}
                delay={0.45}
                wordClassName="bg-gradient-to-r from-teal-500 to-teal-700 bg-clip-text pr-[0.06em] italic text-transparent"
              />
              <svg
                viewBox="0 0 300 18"
                className="absolute -bottom-2 left-0 h-3 w-full text-teal-300"
                preserveAspectRatio="none"
                aria-hidden
              >
                <motion.path
                  d="M2 14 C 80 2, 220 2, 298 12"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
            </span>
          </h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-navy-600 sm:text-lg lg:mx-0"
          >
            {hero.intro}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mx-auto mt-8 flex max-w-md items-center gap-4 rounded-2xl border border-white bg-white/70 p-3 pr-5 text-left shadow-soft backdrop-blur lg:mx-0"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-teal-300">
              <Stethoscope className="h-6 w-6" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-lg font-semibold text-navy-900">{doctor.name}</span>
              <span className="block text-sm font-medium text-teal-700">{doctor.designation}</span>
              <span className="block truncate text-xs text-navy-500">{doctor.credentials}</span>
            </span>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Magnetic>
              <ButtonLink href="#appointment" variant="primary" className="shine w-full !px-7 !py-4">
                <CalendarCheck className="h-4 w-4" aria-hidden />
                {hero.ctaPrimary}
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href="#liver-story" variant="secondary" className="w-full !px-7 !py-4">
                {hero.ctaSecondary}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </ButtonLink>
            </Magnetic>
          </motion.div>
        </div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.2, ease }}
          className="relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-md lg:max-w-none"
        >
          {/* Decorative rings */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white via-sky-soft to-teal-100/70 shadow-lift" aria-hidden />
          <div className="absolute inset-[7%] rounded-full border border-white/80 bg-gradient-to-br from-white/70 to-transparent" aria-hidden />
          <div className="absolute -inset-[5%] animate-spin-slow rounded-full border border-dashed border-teal-300/60" aria-hidden>
            <span className="absolute top-1/2 -left-1.5 h-3 w-3 rounded-full bg-teal-400 shadow-glow" />
          </div>
          <div className="absolute -inset-[12%] hidden animate-spin-slower rounded-full border border-navy-200/50 sm:block" aria-hidden>
            <span className="absolute -top-1 left-1/2 h-2 w-2 rounded-full bg-navy-400" />
          </div>
          <div className="absolute inset-[18%] rounded-full bg-teal-300/25 blur-2xl" aria-hidden />

          {/* Organ: SVG first, upgraded to interactive 3D on capable devices */}
          <Liver3D t={t.liver3d} onHotspotChange={setHotspotOpen} />

          {/* Floating info chips */}
          <motion.div
            className={`absolute top-[8%] -left-2 z-10 transition-opacity duration-300 ${hotspotOpen ? "pointer-events-none opacity-0" : ""} flex items-center gap-2.5 rounded-2xl border border-white bg-white/90 px-3.5 py-2.5 shadow-lift backdrop-blur sm:-left-6`}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-left leading-tight">
              <span className="block text-xs font-bold text-navy-900">{hero.chip1Title}</span>
              <span className="block text-[0.7rem] text-navy-500">{hero.chip1Text}</span>
            </span>
          </motion.div>

          <motion.div
            className={`absolute -right-2 bottom-[10%] z-10 transition-opacity duration-300 ${hotspotOpen ? "pointer-events-none opacity-0" : ""} flex items-center gap-2.5 rounded-2xl border border-white bg-white/90 px-3.5 py-2.5 shadow-lift backdrop-blur sm:-right-4`}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900 text-teal-300">
              <HeartPulse className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-left leading-tight">
              <span className="block text-xs font-bold text-navy-900">{hero.chip2Title}</span>
              <span className="block text-[0.7rem] text-navy-500">{hero.chip2Text}</span>
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
