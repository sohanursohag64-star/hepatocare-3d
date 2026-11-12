"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { CalendarCheck, Info, Pause, Play } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { Dict } from "@/i18n/dictionaries";
import { easeInOut, lerp, seg, window4 } from "../journey/parts";
import { ButtonLink } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

/** Seconds per examination; the two scenes alternate. */
const SCENE = 12;
const LOOP = SCENE * 2;
const STILL = 8; // representative frame within a scene (scope fully advanced)

/** Scope routes (SVG units, viewBox 0 0 400 460). Each begins outside the body. */
const ROUTE = [
  // Upper endoscopy: mouth → esophagus → stomach → duodenum
  "M62 8 C 100 14, 170 26, 200 60 C 200 110, 203 150, 205 196 C 214 216, 246 236, 241 262 C 235 290, 202 297, 181 285 C 166 277, 152 281, 147 304",
  // Colonoscopy: rectum → sigmoid → descending → transverse → ascending → cecum
  "M200 458 L200 415 C 200 385, 230 380, 250 365 C 275 348, 285 330, 285 300 L285 235 C 285 205, 255 205, 240 215 C 215 232, 185 232, 160 215 C 145 205, 115 205, 115 235 L115 335 C 115 350, 122 356, 131 356",
];
const COLON = ROUTE[1].replace("M200 458 L200 415", "M200 418");

const PINK = "#f3b3a8";
const PINK_DARK = "#d98a80";
const LUMEN = "#fbdcd5";

/** 0 → 1 while advancing, hold, then back to 0 while withdrawing. */
function progressAt(s: number) {
  if (s < 7) return easeInOut(seg(s, 1, 7));
  if (s < 9.5) return 1;
  return 1 - easeInOut(seg(s, 9.5, 11.5));
}
const phaseAt = (s: number) => (s < 7 ? 0 : s < 9.5 ? 1 : 2);

/** The scope: a tube revealed along its route, with a glowing camera tip. */
function Scope({ d, progress }: { d: string; progress: MotionValue<number> }) {
  const measure = useRef<SVGPathElement>(null);
  const tip = useRef<SVGGElement>(null);
  const place = (p: number) => {
    const el = measure.current;
    if (!el || !tip.current) return;
    const pt = el.getPointAtLength(el.getTotalLength() * Math.min(1, Math.max(0, p)));
    tip.current.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
  };
  useLayoutEffect(() => place(progress.get()));
  useMotionValueEvent(progress, "change", place);
  // Hidden until it starts moving (a zero-length round-capped dash would draw stray dots).
  const visible = useTransform(progress, (p) => (p > 0.002 ? 1 : 0));
  return (
    <motion.g style={{ opacity: visible }}>
      <path ref={measure} d={d} fill="none" stroke="none" />
      <motion.path d={d} fill="none" stroke="#0d1838" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: progress }} />
      <motion.path d={d} fill="none" stroke="#3d5590" strokeWidth="2" strokeLinecap="round" style={{ pathLength: progress }} />
      <g ref={tip}>
        <circle r="15" fill="#2fbaad" opacity="0.22" />
        <circle r="9" fill="#9de8df" opacity="0.5" />
        <circle r="4.5" fill="#ffffff" stroke="#0c8079" strokeWidth="2" />
      </g>
    </motion.g>
  );
}

/** Stylised "camera view": rings of a soft tunnel that move as the scope travels. */
function CameraView({ clk, travel, label }: { clk: MotionValue<number>; travel: MotionValue<number>; label: string }) {
  const uid = useId();
  const rings = useRef<(SVGCircleElement | null)[]>([]);
  const N = 7;
  const draw = () => {
    const c = clk.get();
    const phase = travel.get();
    for (let i = 0; i < N; i++) {
      const el = rings.current[i];
      if (!el) continue;
      const f = (((i / N + phase) % 1) + 1) % 1; // 0 far … 1 near
      const depth = f * f;
      el.setAttribute("r", (10 + depth * 150).toFixed(1));
      el.setAttribute("cx", (100 + Math.sin(c * 0.7 + i) * 5 * (1 - f)).toFixed(1));
      el.setAttribute("cy", (100 + Math.cos(c * 0.55 + i * 1.7) * 4 * (1 - f)).toFixed(1));
      el.setAttribute("stroke-width", (2 + depth * 16).toFixed(1));
      el.setAttribute("opacity", Math.min(1, 0.25 + f * 1.2).toFixed(2));
    }
  };
  useLayoutEffect(draw);
  useMotionValueEvent(clk, "change", draw);
  return (
    <figure className="pointer-events-none absolute top-3 right-3 w-[36%] max-w-[13rem] sm:top-5 sm:right-5">
      <svg viewBox="0 0 200 200" className="block h-auto w-full drop-shadow-[0_10px_24px_rgba(13,24,56,0.35)]" aria-hidden>
        <defs>
          <radialGradient id={`${uid}-bg`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#5a1f2a" />
            <stop offset="0.35" stopColor="#b85a5e" />
            <stop offset="1" stopColor="#f0a39b" />
          </radialGradient>
          <radialGradient id={`${uid}-vig`} cx="50%" cy="50%" r="50%">
            <stop offset="0.6" stopColor="#000000" stopOpacity="0" />
            <stop offset="1" stopColor="#000000" stopOpacity="0.45" />
          </radialGradient>
          <clipPath id={`${uid}-clip`}>
            <circle cx="100" cy="100" r="90" />
          </clipPath>
        </defs>
        <circle cx="100" cy="100" r="98" fill="#0d1838" />
        <g clipPath={`url(#${uid}-clip)`}>
          <rect width="200" height="200" fill={`url(#${uid}-bg)`} />
          {Array.from({ length: N }).map((_, i) => (
            <circle
              key={i}
              ref={(el) => {
                rings.current[i] = el;
              }}
              cx="100"
              cy="100"
              r="20"
              fill="none"
              stroke="#ffd2c9"
            />
          ))}
          <ellipse cx="62" cy="54" rx="26" ry="10" fill="#ffffff" opacity="0.18" transform="rotate(-28 62 54)" />
          <rect width="200" height="200" fill={`url(#${uid}-vig)`} />
        </g>
        <circle cx="100" cy="100" r="90" fill="none" stroke="#2fbaad" strokeWidth="2.5" />
      </svg>
      <figcaption className="mt-1.5 text-center text-[0.62rem] leading-tight font-semibold text-navy-500 sm:text-xs">{label}</figcaption>
    </figure>
  );
}

/** Organ label that lights up once the scope has reached it. */
function OrganLabel({ x, y, text, at, progress, anchor = "start" }: { x: number; y: number; text: string; at: number; progress: MotionValue<number>; anchor?: "start" | "end" }) {
  const opacity = useTransform(progress, (p) => 0.35 + 0.65 * seg(p, at - 0.06, at + 0.04));
  return (
    <motion.text x={x} y={y} textAnchor={anchor} fontSize="13" fontWeight="700" fill="#1e305d" style={{ opacity }}>
      {text}
    </motion.text>
  );
}

function Body() {
  return (
    <g>
      <circle cx="200" cy="42" r="30" fill="#dbe5f3" />
      <rect x="184" y="66" width="32" height="34" rx="10" fill="#dbe5f3" />
      <path d="M108 112 Q200 84 292 112 C 322 122, 328 162, 322 222 L316 438 Q200 456 84 438 L78 222 C 72 162, 78 122, 108 112 Z" fill="#e7eef8" />
    </g>
  );
}

export function ScopeProcedures({ t }: { t: Dict["scope"] }) {
  const prefersReduced = useReducedMotion();
  const [reduce, setReduce] = useState(false);
  useEffect(() => setReduce(!!prefersReduced), [prefersReduced]);

  const clk = useMotionValue(0);
  const [scene, setScene] = useState(0);
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const running = playing && inView && !reduce;

  useEffect(() => {
    if (reduce) {
      setPlaying(false);
      clk.set(STILL);
    }
  }, [reduce, clk]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (!running) return;
    clk.set((clk.get() + Math.min(delta, 100) / 1000) % LOOP);
  });

  useMotionValueEvent(clk, "change", (c) => {
    const i = c >= SCENE ? 1 : 0;
    const ph = phaseAt(c - i * SCENE);
    setScene((prev) => (prev === i ? prev : i));
    setPhase((prev) => (prev === ph ? prev : ph));
  });

  const goTo = (i: number) => {
    clk.set(i * SCENE + (playing && !reduce ? 0 : STILL));
    setScene(i);
  };

  // Per-scene local time, scope progress and scene opacity.
  const s0 = useTransform(clk, (c) => c);
  const s1 = useTransform(clk, (c) => c - SCENE);
  const p0 = useTransform(s0, (s) => (s >= 0 && s < SCENE ? progressAt(s) : 0));
  const p1 = useTransform(s1, (s) => (s >= 0 && s < SCENE ? progressAt(s) : 0));
  const o0 = useTransform(s0, (s) => window4(s, -1, -0.5, SCENE - 0.5, SCENE) + window4(s, LOOP - 0.5, LOOP, LOOP + 1, LOOP + 2));
  const o1 = useTransform(s1, (s) => window4(s, -0.01, 0.5, SCENE - 0.5, SCENE));
  // Distance travelled drives the tunnel in the camera view.
  const travel = useTransform([p0, p1, clk] as MotionValue<number>[], ([a, b, c]: number[]) => lerp(0, 5, a + b) + c * 0.02);

  const sceneCopy = t.scenes[scene];
  const caption = sceneCopy.phases[phase];

  return (
    <section id="procedures" aria-labelledby="scope-title" className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div>
          <SectionHeading align="left" id="scope-title" eyebrow={t.eyebrow} title={t.title} description={t.description} />

          <Reveal delay={0.1}>
            <div role="tablist" aria-label={t.eyebrow} className="mt-8 inline-flex rounded-full border border-navy-100 bg-mist p-1">
              {t.tabs.map((tab, i) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={scene === i}
                  onClick={() => goTo(i)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    scene === i ? "bg-navy-900 text-white shadow-soft" : "text-navy-600 hover:text-teal-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-6 min-h-[7.5rem] rounded-2xl border border-navy-100 bg-mist/60 p-5">
              <p className="font-display text-lg font-semibold text-navy-900 sm:text-xl">{caption.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-navy-600 sm:text-base">{caption.text}</p>
            </div>

            <p className="mt-5 flex gap-2 text-xs leading-relaxed text-navy-500">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" aria-hidden />
              {t.note}
            </p>

            <ButtonLink href="#appointment" variant="primary" className="mt-7">
              <CalendarCheck className="h-4 w-4" aria-hidden />
              {t.cta}
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div ref={stage} className="relative mx-auto max-w-lg overflow-hidden rounded-[2rem] border border-navy-100 bg-gradient-to-b from-sky-soft to-white shadow-lift">
            <svg viewBox="0 0 400 460" className="block h-auto w-full" role="img" aria-label={t.sceneLabel}>
              <Body />

              {/* Upper endoscopy */}
              <motion.g style={{ opacity: o0 }}>
                <path d="M200 62 C 200 110, 203 150, 204 198" fill="none" stroke={PINK_DARK} strokeWidth="19" strokeLinecap="round" />
                <path d="M176 281 C 158 277, 146 287, 146 312" fill="none" stroke={PINK_DARK} strokeWidth="19" strokeLinecap="round" />
                <path
                  d="M196 190 C 235 180, 284 210, 278 262 C 272 312, 210 324, 178 303 C 160 292, 160 274, 172 268 C 190 262, 200 250, 198 228 Z"
                  fill={PINK}
                  stroke={PINK_DARK}
                  strokeWidth="2.5"
                />
                <path d="M200 62 C 200 110, 203 150, 204 198" fill="none" stroke={PINK} strokeWidth="15" strokeLinecap="round" />
                <path d="M200 66 C 200 110, 203 150, 204 196" fill="none" stroke={LUMEN} strokeWidth="7" strokeLinecap="round" />
                <path d="M176 281 C 158 277, 146 287, 146 312" fill="none" stroke={PINK} strokeWidth="15" strokeLinecap="round" />
                <path d="M212 214 C 246 222, 262 246, 250 276 C 242 294, 212 300, 192 290" fill="none" stroke={LUMEN} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
                <Scope d={ROUTE[0]} progress={p0} />
                <OrganLabel x={184} y={150} anchor="end" text={sceneLabel(t, 0, 0)} at={0.38} progress={p0} />
                <OrganLabel x={290} y={262} text={sceneLabel(t, 0, 1)} at={0.7} progress={p0} />
                <OrganLabel x={132} y={318} anchor="end" text={sceneLabel(t, 0, 2)} at={0.97} progress={p0} />
              </motion.g>

              {/* Colonoscopy */}
              <motion.g style={{ opacity: o1 }}>
                <path d={COLON} fill="none" stroke={PINK_DARK} strokeWidth="35" strokeLinecap="round" strokeLinejoin="round" />
                <path d={COLON} fill="none" stroke={PINK} strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
                <path d={COLON} fill="none" stroke={LUMEN} strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
                <path d={COLON} fill="none" stroke={PINK_DARK} strokeWidth="30" strokeDasharray="1.5 20" opacity="0.35" />
                <Scope d={ROUTE[1]} progress={p1} />
                <OrganLabel x={222} y={430} text={sceneLabel(t, 1, 0)} at={0.12} progress={p1} />
                <OrganLabel x={200} y={262} anchor="end" text={sceneLabel(t, 1, 1)} at={0.55} progress={p1} />
                <OrganLabel x={150} y={384} text={sceneLabel(t, 1, 2)} at={0.97} progress={p1} />
              </motion.g>
            </svg>

            <CameraView clk={clk} travel={travel} label={t.cameraView} />

            {!reduce && (
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-pressed={!playing}
                aria-label={playing ? t.pause : t.play}
                className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-navy-800 shadow-soft transition hover:text-teal-600 sm:bottom-4 sm:left-4"
              >
                {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function sceneLabel(t: Dict["scope"], scene: number, i: number) {
  return t.scenes[scene].labels[i];
}
