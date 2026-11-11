"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Info } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { LiverIllustration } from "../LiverIllustration";
import { SceneErrorBoundary, use3DCapability } from "../three/capability";
import type { Dict } from "@/i18n/dictionaries";
import { ButtonLink } from "../ui/Button";

const ShowcaseScene = dynamic(() => import("../three/ShowcaseScene"), { ssr: false });

/** Visual styling per story step (copy comes from the dictionary, same order). */
const STEP_STYLES = [
  { accent: "text-sky-300", svgFilter: "none" },
  { accent: "text-amber-300", svgFilter: "sepia(0.45) saturate(1.3) brightness(1.08)" },
  { accent: "text-rose-300", svgFilter: "saturate(1.5) hue-rotate(-8deg)" },
  { accent: "text-orange-300", svgFilter: "brightness(0.8) contrast(1.15) sepia(0.25)" },
  { accent: "text-teal-300", svgFilter: "none" },
];

export function LiverStory({ t, numberLocale }: { t: Dict["story"]; numberLocale: string }) {
  const STEPS = t.steps.map((step, i) => ({ ...step, ...STEP_STYLES[i] }));
  const [capability, setCapability] = use3DCapability();
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);

  const section = useRef<HTMLElement>(null);
  const stepEls = useRef<(HTMLElement | null)[]>([]);
  const stage = useRef(0);

  // Load the 3D scene shortly before the section scrolls into view; pause it when away.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setLoad(true), { rootMargin: "800px 0px" });
    const vis = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    near.observe(el);
    vis.observe(el);
    return () => {
      near.disconnect();
      vis.disconnect();
    };
  }, []);

  // Active step = the one whose centre is closest to a reading line
  // (middle of the screen on desktop, lower part on mobile under the sticky stage).
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const lineRatio = window.matchMedia("(min-width: 1024px)").matches ? 0.5 : 0.74;
      const line = window.innerHeight * lineRatio;
      let best = 0;
      let bestDist = Infinity;
      stepEls.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - line);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      stage.current = best;
      setActive(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => setCapability("fallback"), [setCapability]);
  const show3D = capability === "3d" && load;

  return (
    <section
      ref={section}
      id="liver-story"
      aria-labelledby="story-title"
      className="relative isolate bg-navy-950 text-white"
    >
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="bg-grid absolute inset-0 opacity-40 invert" />
        <div className="absolute top-1/4 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[#1b2f7a]/40 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
      </div>

      <div className="container-page pt-20 sm:pt-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-teal-300 uppercase">
            <span className="h-px w-6 bg-teal-300" aria-hidden />
            {t.eyebrow}
          </p>
          <h2
            id="story-title"
            className="mt-4 font-display text-3xl leading-[1.15] font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl"
          >
            {t.titleBefore}
            <span className="text-teal-300 italic">{t.titleEm}</span>
            {t.titleAfter}
          </h2>
          <p className="mt-4 text-base text-navy-200 sm:text-lg">
            {t.intro}
          </p>
        </div>
      </div>

      <div className="container-page relative grid lg:grid-cols-[1fr_1.15fr] lg:gap-12">
        {/* Sticky 3D stage (top on mobile, right column on desktop) */}
        <div className="sticky top-[4.5rem] z-10 -mx-4 self-start h-[50svh] bg-navy-950 sm:-mx-6 lg:order-2 lg:top-0 lg:mx-0 lg:h-screen lg:bg-transparent">
          <div className="relative h-full">
            {/* Fallback / placeholder */}
            <AnimatePresence>
              {!(show3D && ready) && (
                <motion.div
                  key="svg"
                  className="absolute inset-0 flex items-center justify-center p-10"
                  exit={{ opacity: 0, transition: { duration: 0.6 } }}
                >
                  <div className="relative w-full max-w-md">
                    <div className="absolute inset-[10%] rounded-full bg-teal-400/15 blur-3xl" aria-hidden />
                    <div
                      className="relative transition-[filter] duration-700"
                      style={{ filter: STEPS[active].svgFilter }}
                    >
                      <LiverIllustration className="h-auto w-full" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {show3D && (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: ready ? 1 : 0 }}
                transition={{ duration: 1 }}
              >
                <SceneErrorBoundary onError={onError}>
                  <ShowcaseScene stage={stage} active={inView} onReady={onReady} />
                </SceneErrorBoundary>
              </motion.div>
            )}

            {/* Step indicator + disclaimer */}
            <div className="pointer-events-none absolute inset-x-4 bottom-3 flex items-end justify-between gap-3 lg:bottom-10">
              <ol className="flex gap-1.5" aria-hidden>
                {STEPS.map((s, i) => (
                  <li
                    key={s.eyebrow}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === active ? "w-7 bg-teal-300" : "w-1.5 bg-white/25"
                    }`}
                  />
                ))}
              </ol>
              <p className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-[0.65rem] text-navy-300 backdrop-blur">
                <Info className="h-3 w-3" aria-hidden />
                {t.disclaimer}
              </p>
            </div>
          </div>
        </div>

        {/* Story steps */}
        <ol className="relative lg:order-1">
          {STEPS.map((s, i) => (
            <li
              key={s.eyebrow}
              ref={(el) => {
                stepEls.current[i] = el;
              }}
              className="flex min-h-[62svh] items-center py-10 lg:min-h-[88vh]"
            >
              <div
                className={`max-w-md transition-all duration-700 ${
                  i === active ? "opacity-100" : "opacity-30 lg:translate-x-[-8px]"
                }`}
              >
                <p className={`text-xs font-bold tracking-[0.2em] uppercase ${s.accent}`}>
                  {(i + 1).toLocaleString(numberLocale, { minimumIntegerDigits: 2 })} · {s.eyebrow}
                </p>
                <h3 className="mt-3 font-display text-2xl leading-tight font-medium sm:text-3xl lg:text-4xl">{s.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-navy-200 sm:text-lg">{s.body}</p>
                {i === STEPS.length - 1 && (
                  <ButtonLink href="#appointment" variant="primary" className="mt-7">
                    <CalendarCheck className="h-4 w-4" aria-hidden />
                    {t.cta}
                  </ButtonLink>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
