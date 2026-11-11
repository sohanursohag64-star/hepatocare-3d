"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { fill, type Dict } from "@/i18n/dictionaries";
import { LiverIllustration } from "../LiverIllustration";
import { SceneErrorBoundary, use3DCapability } from "./capability";
import type { InteractionState } from "./LiverScene";

/** The 3D scene (three.js + R3F) is code-split and only fetched when it will be used. */
const LiverScene = dynamic(() => import("./LiverScene"), { ssr: false });

/**
 * Hero organ visual. Renders the lightweight SVG illustration immediately,
 * then — on capable devices, once the browser is idle — swaps in an
 * interactive 3D liver. Falls back to the SVG for reduced-motion users,
 * low-end devices, Save-Data, or when WebGL is unavailable.
 */
export function Liver3D({ t, onHotspotChange }: { t: Dict["liver3d"]; onHotspotChange?: (open: boolean) => void }) {
  // Hotspot order must match createHotspots() in LiverScene.
  const HOTSPOTS = t.hotspots;
  const [capability, setCapability] = use3DCapability();
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [openHotspot, setOpenHotspot] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const wrapper = useRef<HTMLDivElement>(null);
  const hotspotEls = useRef<(HTMLElement | null)[]>([]);
  const interaction = useRef<InteractionState>({ yaw: 0, pitch: 0, velocity: 0, dragging: false });
  const pointer = useRef<{ id: number; x: number; y: number; type: string } | null>(null);

  useEffect(() => onHotspotChange?.(openHotspot !== null), [openHotspot, onHotspotChange]);

  // Defer fetching the 3D bundle until the browser is idle, so it never delays first paint.
  useEffect(() => {
    if (capability !== "3d") return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setLoad(true), { timeout: 2000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setLoad(true), 600);
    return () => window.clearTimeout(id);
  }, [capability]);

  // Pause rendering whenever the hero is off-screen.
  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onReady = useCallback(() => setReady(true), []);
  const onSceneError = useCallback(() => {
    setLoad(false);
    setCapability("fallback");
  }, []);

  const show3D = capability === "3d" && load;

  // --- Pointer interaction -------------------------------------------------
  // Touch: horizontal drags rotate; vertical gestures are left to the browser
  // (touch-action: pan-y) so page scrolling is never trapped by the canvas.
  const onPointerDown = (e: React.PointerEvent) => {
    if (!ready || (e.target as HTMLElement).closest("[data-hotspot]")) return;
    pointer.current = { id: e.pointerId, x: e.clientX, y: e.clientY, type: e.pointerType };
    interaction.current.dragging = true;
    interaction.current.velocity = 0;
    if (e.pointerType === "mouse") (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const p = pointer.current;
    if (!p || p.id !== e.pointerId) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    p.x = e.clientX;
    p.y = e.clientY;
    const s = interaction.current;
    s.yaw += dx * 0.009;
    s.velocity = dx * 0.009;
    if (p.type === "mouse") s.pitch = Math.max(-0.5, Math.min(0.5, s.pitch + dy * 0.005));
    if (!hasInteracted && Math.abs(dx) > 2) setHasInteracted(true);
  };

  const endPointer = (e: React.PointerEvent) => {
    if (pointer.current?.id !== e.pointerId) return;
    pointer.current = null;
    interaction.current.dragging = false;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const s = interaction.current;
    if (e.key === "ArrowLeft") s.velocity = -0.06;
    else if (e.key === "ArrowRight") s.velocity = 0.06;
    else if (e.key === "ArrowUp") s.pitch = Math.max(-0.5, s.pitch - 0.12);
    else if (e.key === "ArrowDown") s.pitch = Math.min(0.5, s.pitch + 0.12);
    else return;
    e.preventDefault();
    setHasInteracted(true);
  };

  return (
    <div ref={wrapper} className={`absolute inset-0 ${openHotspot ? "z-20" : ""}`}>
      {/* SVG illustration: instant first paint, loading placeholder and fallback. */}
      <AnimatePresence>
        {!ready && (
          <motion.div
            key="svg"
            className="absolute inset-[6%] flex items-center justify-center"
            initial={false}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.6 } }}
          >
            <motion.div
              className="w-full"
              animate={{ y: [0, -14, 0], rotate: [0, 1.2, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <LiverIllustration className="h-auto w-full drop-shadow-[0_30px_40px_rgba(13,24,56,0.25)]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {show3D && (
        <motion.div
          className={`absolute -inset-[4%] rounded-full outline-none select-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent ${
            ready ? "cursor-grab active:cursor-grabbing" : ""
          }`}
          style={{ touchAction: "pan-y" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          tabIndex={ready ? 0 : -1}
          role="group"
          aria-roledescription="3D model"
          aria-label={t.modelLabel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
          onKeyDown={onKeyDown}
        >
          <SceneErrorBoundary onError={onSceneError}>
            <LiverScene
              interaction={interaction}
              hotspotEls={hotspotEls}
              active={inView}
              onReady={onReady}
            />
          </SceneErrorBoundary>

          {/* Educational hotspots, positioned every frame by the scene. */}
          {ready &&
            HOTSPOTS.map((h, i) => {
              const open = openHotspot === h.id;
              return (
                <div
                  key={h.id}
                  ref={(el) => {
                    hotspotEls.current[i] = el;
                  }}
                  data-hotspot
                  data-visible="false"
                  className="group/hs pointer-events-none absolute top-0 left-0 opacity-0 transition-opacity duration-300 data-[visible=true]:pointer-events-auto data-[visible=true]:opacity-100"
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-label={fill(t.showDescription, { label: h.label })}
                    onClick={() => setOpenHotspot(open ? null : h.id)}
                    onBlur={() => setOpenHotspot((cur) => (cur === h.id ? null : cur))}
                    className="relative -mt-3.5 -ml-3.5 flex h-7 w-7 items-center justify-center rounded-full"
                  >
                    <span className="absolute inset-0 animate-ping rounded-full bg-white/60 [animation-duration:2.2s]" />
                    <span className="relative h-3.5 w-3.5 rounded-full border-2 border-white bg-teal-500 shadow-glow" />
                  </button>
                  <div
                    role="tooltip"
                    className={`absolute top-1 left-5 w-48 rounded-2xl border border-white bg-white/95 p-3 text-left shadow-lift backdrop-blur transition-all duration-200 ${
                      open ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0"
                    }`}
                  >
                    <p className="text-xs font-bold text-navy-900">{h.label}</p>
                    <p className="mt-1 text-[0.7rem] leading-snug text-navy-600">{h.description}</p>
                  </div>
                </div>
              );
            })}
        </motion.div>
      )}

      {/* Interaction hint */}
      <AnimatePresence>
        {ready && !hasInteracted && (
          <motion.p
            key="hint"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.2 }}
            className="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-navy-900/80 px-3.5 py-1.5 text-[0.7rem] font-medium whitespace-nowrap text-white backdrop-blur"
          >
            {t.hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
