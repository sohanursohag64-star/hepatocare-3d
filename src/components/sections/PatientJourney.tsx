"use client";

import { motion, useAnimationFrame, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fill, type Dict } from "@/i18n/dictionaries";
import { clamp01 } from "../journey/parts";
import { JourneyScenes, LOOP_LENGTH, SCENE_LENGTH, SCENE_START, SCENE_STILL } from "../journey/scenes";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

function sceneAt(t: number) {
  let i = 0;
  for (let k = 0; k < SCENE_START.length; k++) if (t >= SCENE_START[k]) i = k;
  return i;
}

/** Step pill with a progress bar that fills while its scene plays. */
function StepProgress({ clk, index }: { clk: MotionValue<number>; index: number }) {
  const width = useTransform(clk, (c) => {
    const p = clamp01((c - SCENE_START[index]) / SCENE_LENGTH[index]);
    return `${p * 100}%`;
  });
  return (
    <span className="absolute inset-x-0 bottom-0 h-1 overflow-hidden rounded-full bg-navy-100" aria-hidden>
      <motion.span className="block h-full bg-teal-500" style={{ width }} />
    </span>
  );
}

/**
 * "Your visit" — an animated, cartoon-style story of a patient's visit, drawn
 * in SVG and driven by one clock so play/pause freezes every part at once.
 * Reduced-motion users get still frames they can step through.
 */
export function PatientJourney({ t, numberLocale }: { t: Dict["journey"]; numberLocale: string }) {
  // Read the preference after mount, so the server and first client render match.
  const prefersReduced = useReducedMotion();
  const [reduce, setReduce] = useState(false);
  useEffect(() => setReduce(!!prefersReduced), [prefersReduced]);
  const clk = useMotionValue(0);
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const running = playing && inView && !reduce;

  // Reduced motion: start paused on a still frame.
  useEffect(() => {
    if (reduce) {
      setPlaying(false);
      clk.set(SCENE_STILL[0]);
    }
  }, [reduce, clk]);

  // Only animate while the stage is on screen.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (!running) return;
    clk.set((clk.get() + Math.min(delta, 100) / 1000) % LOOP_LENGTH);
  });

  useMotionValueEvent(clk, "change", (c) => {
    const i = sceneAt(c);
    setScene((prev) => (prev === i ? prev : i));
  });

  const goTo = (i: number) => {
    clk.set(playing && !reduce ? SCENE_START[i] : SCENE_STILL[i]);
    setScene(i);
  };

  const step = t.steps[scene];

  return (
    <section id="journey" aria-labelledby="journey-title" className="relative overflow-hidden bg-mist py-20 sm:py-28">
      <div className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_60%)]" aria-hidden />
      <div className="container-page relative">
        <SectionHeading id="journey-title" eyebrow={t.eyebrow} title={t.title} description={t.description} />

        <Reveal className="mx-auto mt-12 max-w-5xl">
          <div ref={stage} className="relative overflow-hidden rounded-[2rem] border border-white bg-white shadow-lift">
            <svg viewBox="0 0 800 450" className="block h-auto w-full" role="img" aria-label={t.sceneLabel}>
              <defs>
                <linearGradient id="pj-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#d9ecfb" />
                  <stop offset="1" stopColor="#f3f8fc" />
                </linearGradient>
              </defs>
              <JourneyScenes clk={clk} labels={{ clinicDoor: t.clinicDoor, doctorDoor: t.doctorDoor, reception: t.reception }} />
            </svg>

            {!reduce && (
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-pressed={!playing}
                aria-label={playing ? t.pause : t.play}
                className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-navy-800 shadow-soft backdrop-blur transition hover:text-teal-600 sm:top-4 sm:right-4"
              >
                {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
              </button>
            )}
          </div>

          {/* Caption for the current scene */}
          <div className="mt-6 min-h-[5.5rem] text-center" aria-live="off">
            <p className="font-display text-xl font-semibold text-navy-900 sm:text-2xl">{step.title}</p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-navy-600 sm:text-base">{step.text}</p>
          </div>

          {/* Steps */}
          <ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {t.steps.map((s, i) => (
              <li key={s.title}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={scene === i ? "step" : undefined}
                  aria-label={fill(t.goToStep, { n: (i + 1).toLocaleString(numberLocale), title: s.title })}
                  className={`relative w-full overflow-hidden rounded-2xl border px-3 pt-3 pb-4 text-left transition ${
                    scene === i ? "border-teal-200 bg-white shadow-soft" : "border-transparent bg-white/50 hover:bg-white"
                  }`}
                >
                  <span className={`block text-xs font-bold ${scene === i ? "text-teal-600" : "text-navy-400"}`}>
                    {(i + 1).toLocaleString(numberLocale, { minimumIntegerDigits: 2 })}
                  </span>
                  <span className="mt-0.5 block text-sm leading-snug font-semibold text-navy-800">{s.title}</span>
                  {!reduce && <StepProgress clk={clk} index={i} />}
                </button>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
