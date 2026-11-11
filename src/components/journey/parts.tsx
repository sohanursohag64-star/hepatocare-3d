"use client";

import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import type { ComponentType, SVGProps } from "react";

/* -------------------------------------------------------------------------- */
/* Timing helpers                                                             */
/* -------------------------------------------------------------------------- */

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Progress of t through [t0, t1], clamped to 0…1. */
export const seg = (t: number, t0: number, t1: number) => clamp01((t - t0) / (t1 - t0));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
export const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
export const easeIn = (p: number) => p * p * p;
/** 0 → 1 over [a, b], holds, then 1 → 0 over [c, d]. */
export const window4 = (t: number, a: number, b: number, c: number, d: number) =>
  Math.min(seg(t, a, b), 1 - seg(t, c, d));

/** A motion value that never changes (handy default for optional props). */
export function useConst(v: number) {
  return useMotionValue(v);
}

/* -------------------------------------------------------------------------- */
/* Palette                                                                    */
/* -------------------------------------------------------------------------- */

export const C = {
  navy: "#0d1838",
  navyMid: "#1e305d",
  teal: "#2fbaad",
  tealDark: "#0c8079",
  tealLight: "#cdf4ef",
  sky: "#e7f1fa",
  white: "#ffffff",
  line: "#c3d0e8",
  skinA: "#f1c7a3",
  skinB: "#d9a07a",
  skinC: "#c98d68",
};

/* -------------------------------------------------------------------------- */
/* Person                                                                     */
/* -------------------------------------------------------------------------- */

type Variant = "patient" | "doctor" | "receptionist";

const LOOK: Record<Variant, { skin: string; shirt: string; pants: string; hair: string; shoes: string }> = {
  patient: { skin: C.skinA, shirt: "#e98a5b", pants: "#2a3f74", hair: "#3b2a24", shoes: "#1e305d" },
  doctor: { skin: C.skinB, shirt: C.teal, pants: C.navyMid, hair: "#55555f", shoes: C.navy },
  receptionist: { skin: C.skinC, shirt: C.teal, pants: C.navyMid, hair: "#1f1f2e", shoes: C.navy },
};

export type PersonProps = {
  variant: Variant;
  /** Global clock — drives walk cycles and blinking. */
  clk: MotionValue<number>;
  x: MotionValue<number>;
  y?: MotionValue<number>;
  opacity?: MotionValue<number>;
  /** Walk-cycle amplitude 0…1. */
  walk?: MotionValue<number>;
  /** 0 worried … 1 happy. */
  mood?: MotionValue<number>;
  /** Seated pose 0…1: legs swing forward and the hips lower. */
  seat?: MotionValue<number>;
  /** Raise the front arm 0…1 (wave / point / hand over). */
  arm?: MotionValue<number>;
  /** Mouth talking amount 0…1. */
  talk?: MotionValue<number>;
  /** Something held in the front hand. */
  holding?: "folder" | "paper";
  holdingOpacity?: MotionValue<number>;
  flip?: boolean;
  scale?: number;
};

export function Person({
  variant,
  clk,
  x,
  y,
  opacity,
  walk,
  mood,
  arm,
  seat,
  talk,
  holding,
  holdingOpacity,
  flip = false,
  scale = 1,
}: PersonProps) {
  const L = LOOK[variant];
  const zero = useConst(0);
  const one = useConst(1);
  const happyDefault = useConst(variant === "patient" ? 0.4 : 1);
  const w = walk ?? zero;
  const m = mood ?? happyDefault;
  const a = arm ?? zero;
  const tk = talk ?? zero;
  const st = seat ?? zero;

  const swing = useTransform([clk, w] as MotionValue<number>[], ([c, k]: number[]) => Math.sin(c * 9) * 24 * k);
  const legA = useTransform([swing, st] as MotionValue<number>[], ([v, s]: number[]) => v * (1 - s) - 82 * s);
  const legB = useTransform([swing, st] as MotionValue<number>[], ([v, s]: number[]) => -v * (1 - s) - 78 * s);
  const seatDrop = useTransform(st, (s) => 30 * s);
  const shadowOpacity = useTransform(st, (s) => 0.12 * (1 - s));
  const bob = useTransform([clk, w] as MotionValue<number>[], ([c, k]: number[]) => -Math.abs(Math.sin(c * 9)) * 3 * k);
  const backArm = useTransform(swing, (v) => v * 0.7);
  const frontArm = useTransform([swing, a, clk] as MotionValue<number>[], ([s, r, c]: number[]) => {
    const wave = r > 0.95 ? Math.sin(c * 10) * 14 : 0;
    return -s * 0.7 * (1 - r) - 125 * r + wave;
  });
  const blink = useTransform(clk, (c) => ((c + (variant === "doctor" ? 1.3 : 0)) % 3.7 < 0.12 ? 0.12 : 1));
  const worried = useTransform(m, (v) => 1 - v);
  const mouthOpen = useTransform([tk, clk] as MotionValue<number>[], ([k, c]: number[]) =>
    k > 0 ? 0.3 + Math.abs(Math.sin(c * 12)) * 0.7 * k : 0,
  );
  const mouthClosed = useTransform(mouthOpen, (v) => (v > 0 ? 0 : 1));
  const mouthVisible = useTransform(mouthOpen, (v) => (v > 0 ? 1 : 0));
  const s = scale * (flip ? -1 : 1);

  return (
    <motion.g style={{ x, y: y ?? zero, opacity: opacity ?? one }}>
      <g transform={`scale(${s} ${scale})`}>
        {/* ground shadow (stays on the floor when seated) */}
        <motion.ellipse cx="0" cy="2" rx="30" ry="5" fill={C.navy} style={{ opacity: shadowOpacity }} />
        <motion.g style={{ y: seatDrop }}>
        <motion.g style={{ y: bob }}>
          {/* back arm */}
          <motion.g style={{ rotate: backArm, originX: "50%", originY: "0%" }}>
            <rect x="-31" y="-106" width="12" height="48" rx="6" fill={variant === "doctor" ? "#eef3fa" : L.shirt} />
            <circle cx="-25" cy="-58" r="6.5" fill={L.skin} />
          </motion.g>

          {/* legs */}
          <motion.g style={{ rotate: legB, originX: "50%", originY: "0%" }}>
            <rect x="-14" y="-54" width="13" height="52" rx="6" fill={L.pants} />
            <ellipse cx="-5" cy="-2" rx="10" ry="5" fill={L.shoes} />
          </motion.g>
          <motion.g style={{ rotate: legA, originX: "50%", originY: "0%" }}>
            <rect x="1" y="-54" width="13" height="52" rx="6" fill={L.pants} />
            <ellipse cx="10" cy="-2" rx="10" ry="5" fill={L.shoes} />
          </motion.g>

          {/* body */}
          {variant === "doctor" ? (
            <>
              <rect x="-25" y="-114" width="50" height="80" rx="15" fill="#ffffff" stroke="#d7e3f1" strokeWidth="2" />
              <path d="M-9 -114 L0 -96 L9 -114 Z" fill={L.shirt} />
              <path d="M0 -96 V-40" stroke="#d7e3f1" strokeWidth="2" />
              {/* stethoscope */}
              <path d="M-11 -112 C -16 -90, -10 -78, 0 -78 C 10 -78, 16 -90, 11 -112" fill="none" stroke={C.tealDark} strokeWidth="2.6" />
              <circle cx="0" cy="-76" r="4.5" fill={C.tealDark} />
              <rect x="10" y="-82" width="10" height="12" rx="2" fill={C.teal} opacity="0.8" />
            </>
          ) : (
            <>
              <rect x="-24" y="-114" width="48" height="66" rx="16" fill={L.shirt} />
              <path d="M-8 -114 Q0 -104 8 -114" fill="none" stroke="#ffffff" strokeWidth="2.4" opacity="0.7" />
            </>
          )}

          {/* neck + head */}
          <rect x="-5" y="-122" width="10" height="10" rx="3" fill={L.skin} />
          <circle cx="0" cy="-141" r="22" fill={L.skin} />
          {/* hair */}
          {variant === "patient" && (
            <path d="M-22 -145 C -22 -168, 22 -170, 22 -146 C 14 -156, 0 -158, -10 -152 C -14 -150, -19 -148, -22 -145 Z" fill={L.hair} />
          )}
          {variant === "doctor" && (
            <>
              <path d="M-22 -146 C -20 -166, 20 -168, 22 -146 C 16 -154, -14 -156, -22 -146 Z" fill={L.hair} />
              <g fill="none" stroke={C.navy} strokeWidth="1.8">
                <circle cx="-8" cy="-142" r="6" />
                <circle cx="8" cy="-142" r="6" />
                <path d="M-2 -142 H2" />
              </g>
            </>
          )}
          {variant === "receptionist" && (
            <>
              <path d="M-22 -140 C -24 -168, 24 -168, 22 -140 C 16 -152, -16 -152, -22 -140 Z" fill={L.hair} />
              <circle cx="0" cy="-166" r="9" fill={L.hair} />
            </>
          )}
          {/* face */}
          <motion.g style={{ scaleY: blink, originX: "50%", originY: "50%" }}>
            <circle cx="-8" cy="-142" r="2.6" fill={C.navy} />
            <circle cx="8" cy="-142" r="2.6" fill={C.navy} />
          </motion.g>
          <circle cx="-13" cy="-133" r="3.5" fill="#f39b8f" opacity="0.35" />
          <circle cx="13" cy="-133" r="3.5" fill="#f39b8f" opacity="0.35" />
          {/* worried brows */}
          <motion.g style={{ opacity: worried }}>
            <path d="M-12 -151 L-4 -149" stroke={C.navy} strokeWidth="1.8" strokeLinecap="round" />
            <path d="M12 -151 L4 -149" stroke={C.navy} strokeWidth="1.8" strokeLinecap="round" />
          </motion.g>
          {/* mouths */}
          <motion.g style={{ opacity: mouthClosed }}>
            <motion.path
              d="M -7 -131 Q 0 -124 7 -131"
              fill="none"
              stroke={C.navy}
              strokeWidth="2"
              strokeLinecap="round"
              style={{ opacity: m }}
            />
            <motion.path
              d="M -6 -127 Q 0 -132 6 -127"
              fill="none"
              stroke={C.navy}
              strokeWidth="2"
              strokeLinecap="round"
              style={{ opacity: worried }}
            />
          </motion.g>
          <motion.ellipse cx="0" cy="-128" rx="4" ry="3.5" fill={C.navy} style={{ scaleY: mouthOpen, opacity: mouthVisible }} />

          {/* front arm (+ held item) */}
          <motion.g style={{ rotate: frontArm, originX: "50%", originY: "0%" }}>
            <rect x="19" y="-106" width="12" height="48" rx="6" fill={variant === "doctor" ? "#ffffff" : L.shirt} stroke={variant === "doctor" ? "#d7e3f1" : "none"} />
            <circle cx="25" cy="-58" r="6.5" fill={L.skin} />
            {holding === "folder" && (
              <motion.g style={{ opacity: holdingOpacity ?? one }}>
                <rect x="20" y="-66" width="26" height="20" rx="3" fill={C.teal} />
                <rect x="20" y="-66" width="26" height="5" rx="2" fill={C.tealDark} />
              </motion.g>
            )}
            {holding === "paper" && (
              <motion.g style={{ opacity: holdingOpacity ?? one }}>
                <rect x="22" y="-72" width="20" height="26" rx="2" fill="#ffffff" stroke={C.line} />
                <path d="M26 -65 H38 M26 -60 H38 M26 -55 H34" stroke={C.teal} strokeWidth="1.6" />
              </motion.g>
            )}
          </motion.g>
        </motion.g>
        </motion.g>
      </g>
    </motion.g>
  );
}

/* -------------------------------------------------------------------------- */
/* Car                                                                        */
/* -------------------------------------------------------------------------- */

export function Car({ x, opacity }: { x: MotionValue<number>; opacity?: MotionValue<number> }) {
  const wheel = useTransform(x, (v) => (v / (2 * Math.PI * 22)) * 360);
  const one = useConst(1);
  return (
    <motion.g style={{ x, opacity: opacity ?? one }}>
      <ellipse cx="115" cy="2" rx="120" ry="7" fill={C.navy} opacity="0.15" />
      <path d="M44 -78 L74 -114 Q 80 -120 90 -120 H158 Q 168 -120 174 -112 L200 -78 Z" fill="#5b7cff" />
      <path d="M84 -80 L100 -110 H130 V-80 Z" fill="#dff1ff" />
      <path d="M137 -80 V-110 H160 L182 -80 Z" fill="#dff1ff" />
      <rect x="0" y="-82" width="232" height="54" rx="20" fill="#5b7cff" />
      <rect x="0" y="-60" width="232" height="6" fill="#4a68e0" />
      <path d="M134 -78 V-34" stroke="#4a68e0" strokeWidth="2" />
      <rect x="120" y="-66" width="12" height="4" rx="2" fill="#dff1ff" />
      <circle cx="224" cy="-62" r="6" fill="#ffe08a" />
      <rect x="2" y="-66" width="8" height="10" rx="3" fill="#ff8a7a" />
      {[56, 176].map((cx) => (
        <g key={cx} transform={`translate(${cx} -26)`}>
          <circle r="23" fill={C.navy} />
          <motion.g style={{ rotate: wheel }}>
            <circle r="11" fill="#c3d0e8" />
            <path d="M-11 0 H11 M0 -11 V11" stroke={C.navyMid} strokeWidth="3" />
          </motion.g>
        </g>
      ))}
    </motion.g>
  );
}

/* -------------------------------------------------------------------------- */
/* Speech bubble with an icon                                                 */
/* -------------------------------------------------------------------------- */

type IconType = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;

export function Bubble({
  x,
  y,
  show,
  icon: Icon,
  tail = "left",
  tone = "light",
}: {
  x: number;
  y: number;
  show: MotionValue<number>;
  icon: IconType;
  tail?: "left" | "right";
  tone?: "light" | "teal";
}) {
  const scale = useTransform(show, (v) => 0.6 + 0.4 * easeOut(v));
  const bg = tone === "teal" ? C.teal : "#ffffff";
  const fg = tone === "teal" ? "#ffffff" : C.tealDark;
  return (
    <motion.g style={{ opacity: show, scale, originX: tail === "left" ? "0%" : "100%", originY: "100%" }}>
      <g transform={`translate(${x} ${y})`}>
        <rect x="0" y="0" width="64" height="48" rx="16" fill={bg} stroke={tone === "teal" ? "none" : C.line} />
        <path d={tail === "left" ? "M14 46 L8 60 L28 47 Z" : "M50 46 L56 60 L36 47 Z"} fill={bg} />
        <Icon x={18} y={10} width={28} height={28} color={fg} strokeWidth={2.2} />
      </g>
    </motion.g>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared outdoor backdrop with the chamber building                          */
/* -------------------------------------------------------------------------- */

export function Exterior({ clk, door, doorSign }: { clk: MotionValue<number>; door: MotionValue<number>; doorSign: string }) {
  const cloudA = useTransform(clk, (c) => ((c * 10) % 1000) - 150);
  const cloudB = useTransform(clk, (c) => ((c * 6 + 500) % 1000) - 150);
  const doorL = useTransform(door, (v) => -30 * v);
  const doorR = useTransform(door, (v) => 30 * v);
  return (
    <g>
      <rect width="800" height="450" fill="url(#pj-sky)" />
      <circle cx="120" cy="80" r="34" fill="#fff4c9" />
      <motion.g style={{ x: cloudA }}>
        <g fill="#ffffff" opacity="0.9">
          <ellipse cx="0" cy="70" rx="46" ry="16" />
          <ellipse cx="26" cy="58" rx="28" ry="18" />
        </g>
      </motion.g>
      <motion.g style={{ x: cloudB }}>
        <g fill="#ffffff" opacity="0.75">
          <ellipse cx="0" cy="120" rx="36" ry="12" />
          <ellipse cx="20" cy="110" rx="22" ry="14" />
        </g>
      </motion.g>
      {/* distant skyline */}
      <g fill="#d2e2f2">
        <rect x="20" y="230" width="60" height="150" rx="4" />
        <rect x="90" y="200" width="44" height="180" rx="4" />
        <rect x="350" y="250" width="70" height="130" rx="4" />
        <rect x="430" y="215" width="50" height="165" rx="4" />
      </g>
      {/* trees */}
      {[300, 500].map((tx) => (
        <g key={tx}>
          <rect x={tx - 4} y="320" width="8" height="60" fill="#8a6a52" />
          <circle cx={tx} cy="312" r="26" fill="#7fcfa4" />
          <circle cx={tx - 14} cy="326" r="16" fill="#6cc095" />
        </g>
      ))}
      {/* chamber building */}
      <g>
        <rect x="530" y="150" width="250" height="230" rx="6" fill="#ffffff" stroke={C.line} />
        <rect x="520" y="138" width="270" height="22" rx="6" fill={C.navy} />
        <rect x="560" y="172" width="190" height="34" rx="10" fill={C.navy} />
        <g transform="translate(574 180)">
          <rect width="18" height="18" rx="5" fill={C.teal} />
          <path d="M7 4h4v5h5v4h-5v5H7v-5H2V9h5z" fill="#ffffff" transform="scale(0.8) translate(2 1)" />
        </g>
        <text x="600" y="195" fill="#ffffff" fontSize="16" fontWeight="600" style={{ fontFamily: "var(--font-fraunces), serif" }}>
          HepatoCare
        </text>
        {[555, 715].map((wx) => (
          <rect key={wx} x={wx} y="226" width="44" height="50" rx="6" fill="#dff1ff" stroke={C.line} />
        ))}
        {/* sliding door */}
        <rect x="620" y="284" width="70" height="96" fill={C.navyMid} />
        <motion.rect x="620" y="284" width="35" height="96" fill="#bfe8f2" stroke="#ffffff" strokeWidth="2" style={{ x: doorL }} />
        <motion.rect x="655" y="284" width="35" height="96" fill="#bfe8f2" stroke="#ffffff" strokeWidth="2" style={{ x: doorR }} />
        <rect x="612" y="276" width="86" height="10" rx="3" fill={C.teal} />
        <text x="655" y="272" textAnchor="middle" fill={C.navyMid} fontSize="11" fontWeight="600">
          {doorSign}
        </text>
      </g>
      {/* road */}
      <rect x="0" y="380" width="800" height="70" fill="#5b6478" />
      <rect x="0" y="376" width="800" height="8" fill="#d9e2ef" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={i * 100 + 20} y="414" width="50" height="5" rx="2" fill="#ffffff" opacity="0.7" />
      ))}
    </g>
  );
}
