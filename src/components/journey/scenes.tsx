"use client";

import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { ClipboardCheck, FileText, HeartPulse, Smile } from "lucide-react";
import { Bubble, C, Car, CAR_DOOR_X, easeIn, easeInOut, easeOut, Exterior, lerp, Person, seg, window4 } from "./parts";

/** Scene lengths in seconds. Scene i starts at SCENE_START[i]. */
export const SCENE_LENGTH = [7, 5.6, 8.4, 6.6];
export const SCENE_START = SCENE_LENGTH.map((_, i) => SCENE_LENGTH.slice(0, i).reduce((a, b) => a + b, 0));
export const LOOP_LENGTH = SCENE_LENGTH.reduce((a, b) => a + b, 0);
/** A representative still frame for each scene (used when motion is reduced). */
export const SCENE_STILL = [5.0, 2.8, 6.9, 2.0].map((t, i) => SCENE_START[i] + t);

const ROAD_Y = 436;
const WALK_Y = 380;
/** Where the parked car stops, and the spot just in front of its open door. */
const PARK_X = 60;
const DOOR_X = PARK_X + CAR_DOOR_X;
const KERB_Y = 402;

type SceneProps = { clk: MotionValue<number>; lt: MotionValue<number>; labels: SceneLabels };
export type SceneLabels = { clinicDoor: string; doctorDoor: string; reception: string };

/** Local time within a scene. */
function useLocal(clk: MotionValue<number>, index: number) {
  return useTransform(clk, (c) => c - SCENE_START[index]);
}

/* 1 · Arrival --------------------------------------------------------------- */
function Arrival({ clk, lt, labels }: SceneProps) {
  const carX = useTransform(lt, (s) => lerp(-400, PARK_X, easeOut(seg(s, 0, 2.3))));
  // Door opens, the patient steps out of the open door (the seated figure swaps out
  // in a blink, hidden by the door), the door closes, then the walk to the chamber.
  const carDoor = useTransform(lt, (s) => window4(s, 2.4, 2.8, 3.5, 3.9));
  const occupant = useTransform(lt, (s) => 1 - seg(s, 2.82, 2.92));
  const pOpacity = useTransform(lt, (s) => window4(s, 2.82, 2.92, 6.0, 6.4));
  const pX = useTransform(lt, (s) =>
    s < 3.3 ? lerp(DOOR_X - 8, DOOR_X + 22, easeOut(seg(s, 2.85, 3.25))) : lerp(DOOR_X + 22, 655, easeInOut(seg(s, 3.4, 5.8))),
  );
  const pY = useTransform(lt, (s) => (s < 3.3 ? lerp(KERB_Y - 10, KERB_Y, easeOut(seg(s, 2.85, 3.25))) : lerp(KERB_Y, WALK_Y, seg(s, 3.4, 4.4))));
  const pWalk = useTransform(lt, (s) => window4(s, 3.3, 3.6, 5.6, 5.9));
  const door = useTransform(lt, (s) => window4(s, 5.1, 5.6, 6.4, 6.9));
  const mood = useMotionValue(0.15);
  return (
    <>
      <Exterior clk={clk} door={door} doorSign={labels.clinicDoor} />
      <g transform={`translate(0 ${ROAD_Y})`}>
        <Car x={carX} occupant={occupant} door={carDoor} />
      </g>
      <Person variant="patient" clk={clk} x={pX} y={pY} opacity={pOpacity} walk={pWalk} mood={mood} holding="folder" scale={1} />
    </>
  );
}

/* 2 · Reception ------------------------------------------------------------- */
function Reception({ clk, lt, labels }: SceneProps) {
  const pX = useTransform(lt, (s) => (s < 3.5 ? lerp(-60, 245, easeInOut(seg(s, 0, 2.1))) : lerp(245, 700, easeInOut(seg(s, 3.5, 5.1)))));
  const pWalk = useTransform(lt, (s) => Math.max(window4(s, 0, 0.2, 1.9, 2.1), window4(s, 3.4, 3.6, 4.9, 5.1)));
  const pOpacity = useTransform(lt, (s) => 1 - seg(s, 5.1, 5.5));
  const wave = useTransform(lt, (s) => window4(s, 0.6, 0.9, 2.0, 2.3));
  const talk = useTransform(lt, (s) => window4(s, 2.2, 2.3, 3.2, 3.3));
  const check = useTransform(lt, (s) => window4(s, 2.3, 2.6, 3.6, 3.9));
  const door = useTransform(lt, (s) => seg(s, 4.5, 4.9));
  const doorX = useTransform(door, (v) => -56 * v);
  const mood = useMotionValue(0.35);
  const rMood = useMotionValue(1);
  const pY = useMotionValue(WALK_Y);
  const rX = useMotionValue(395);
  const rY = useMotionValue(348);
  return (
    <>
      <rect width="800" height="450" fill="#f3f8fc" />
      <rect y="380" width="800" height="70" fill="#dce7f3" />
      {/* wall details */}
      <rect x="60" y="80" width="150" height="90" rx="10" fill={C.navy} />
      <text x="135" y="132" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="600" style={{ fontFamily: "var(--font-fraunces), serif" }}>
        HepatoCare
      </text>
      <circle cx="330" cy="105" r="22" fill="#ffffff" stroke={C.line} strokeWidth="3" />
      <path d="M330 105 V92 M330 105 L340 110" stroke={C.navy} strokeWidth="2.4" strokeLinecap="round" />
      {/* waiting chairs */}
      {[60, 120].map((cx) => (
        <g key={cx}>
          <rect x={cx} y="318" width="48" height="40" rx="10" fill={C.tealLight} />
          <rect x={cx} y="350" width="48" height="12" rx="4" fill={C.teal} />
          <rect x={cx + 6} y="362" width="5" height="18" fill={C.navyMid} />
          <rect x={cx + 37} y="362" width="5" height="18" fill={C.navyMid} />
        </g>
      ))}
      {/* plant */}
      <rect x="500" y="330" width="34" height="50" rx="6" fill="#e98a5b" />
      <ellipse cx="517" cy="318" rx="24" ry="30" fill="#7fcfa4" />
      {/* doctor's door */}
      <rect x="650" y="190" width="110" height="190" rx="4" fill="#ffffff" stroke={C.line} />
      <rect x="660" y="200" width="90" height="180" fill={C.navyMid} />
      <motion.rect x="660" y="200" width="90" height="180" fill="#8fd9cf" style={{ x: doorX }} />
      <rect x="664" y="164" width="82" height="22" rx="6" fill={C.teal} />
      <text x="705" y="179" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="600">
        {labels.doctorDoor}
      </text>
      {/* receptionist behind the desk */}
      <Person variant="receptionist" clk={clk} x={rX} y={rY} mood={rMood} arm={wave} talk={talk} flip scale={0.95} />
      <rect x="320" y="300" width="160" height="80" rx="10" fill="#ffffff" stroke={C.line} />
      <rect x="320" y="292" width="160" height="14" rx="6" fill={C.teal} />
      <text x="400" y="345" textAnchor="middle" fill={C.navyMid} fontSize="12" fontWeight="600">
        {labels.reception}
      </text>
      <Bubble x={410} y={150} show={check} icon={ClipboardCheck} tail="left" tone="teal" />
      <Person variant="patient" clk={clk} x={pX} y={pY} opacity={pOpacity} walk={pWalk} mood={mood} holding="folder" scale={1} />
    </>
  );
}

/* 3 · Consultation ---------------------------------------------------------- */
function Consultation({ clk, lt }: SceneProps) {
  const door = useTransform(lt, (s) => window4(s, 0, 0.5, 2.4, 2.9));
  const doorX = useTransform(door, (v) => 56 * v);
  const pX = useTransform(lt, (s) => lerp(80, 300, easeInOut(seg(s, 0.4, 2.2))));
  const pWalk = useTransform(lt, (s) => window4(s, 0.4, 0.6, 2.0, 2.2));
  const pY = useMotionValue(WALK_Y);
  const pSeat = useTransform(lt, (s) => easeInOut(seg(s, 2.2, 2.7)));
  // Swap to an identical seated figure holding the plan once it is handed over.
  const pOpacity = useTransform(lt, (s) => seg(s, 0.2, 0.6) * (1 - seg(s, 7.4, 7.6)));
  const mood = useTransform(lt, (s) => lerp(0.15, 1, easeInOut(seg(s, 5.0, 6.4))));
  const docTalk = useTransform(lt, (s) => Math.max(window4(s, 2.9, 3.0, 4.4, 4.5), window4(s, 4.8, 4.9, 6.1, 6.2)));
  const docArm = useTransform(lt, (s) => 0.55 * Math.max(window4(s, 3.0, 3.4, 4.2, 4.6), window4(s, 6.4, 6.8, 7.6, 8.0)));
  const b1 = useTransform(lt, (s) => window4(s, 2.9, 3.2, 4.3, 4.6));
  const b2 = useTransform(lt, (s) => window4(s, 4.7, 5.0, 6.0, 6.3));
  const b3 = useTransform(lt, (s) => window4(s, 6.3, 6.6, 7.8, 8.2));
  const paperT = useTransform(lt, (s) => easeInOut(seg(s, 6.6, 7.4)));
  const paperX = useTransform(paperT, (p) => lerp(500, 330, p));
  const paperY = useTransform(paperT, (p) => lerp(290, 300, p) - Math.sin(p * Math.PI) * 30);
  const paperOpacity = useTransform(lt, (s) => window4(s, 6.5, 6.7, 7.4, 7.6));
  const pPaper = useTransform(lt, (s) => seg(s, 7.4, 7.6));
  const seatedX = useMotionValue(300);
  const seatedY = useMotionValue(WALK_Y);
  const seated = useMotionValue(1);
  const dX = useMotionValue(560);
  const dY = useMotionValue(355);
  const dMood = useMotionValue(1);
  return (
    <>
      <rect width="800" height="450" fill="#eef5fb" />
      <rect y="380" width="800" height="70" fill="#d5e2f0" />
      {/* window */}
      <rect x="560" y="60" width="180" height="120" rx="10" fill="#dff1ff" stroke="#ffffff" strokeWidth="6" />
      <path d="M650 60 V180 M560 120 H740" stroke="#ffffff" strokeWidth="4" />
      {/* liver poster */}
      <rect x="250" y="70" width="140" height="110" rx="10" fill="#ffffff" stroke={C.line} />
      <path
        d="M270 128 C 272 104, 300 92, 330 92 C 356 92, 372 100, 378 110 C 360 114, 345 124, 333 136 C 318 150, 296 156, 282 150 C 272 146, 268 138, 270 128 Z"
        fill="#b2443b"
      />
      <path d="M340 96 C 336 110, 334 122, 328 138" stroke="#f6c2b6" strokeWidth="1.5" fill="none" />
      <rect x="270" y="160" width="60" height="5" rx="2" fill={C.line} />
      {/* door (left) */}
      <rect x="30" y="190" width="110" height="190" rx="4" fill="#ffffff" stroke={C.line} />
      <rect x="40" y="200" width="90" height="180" fill={C.navyMid} />
      <motion.rect x="40" y="200" width="90" height="180" fill="#8fd9cf" style={{ x: doorX }} />
      {/* doctor (seated behind the desk) */}
      <Person variant="doctor" clk={clk} x={dX} y={dY} mood={dMood} talk={docTalk} arm={docArm} flip scale={1} />
      {/* desk */}
      <rect x="430" y="300" width="250" height="80" rx="10" fill="#ffffff" stroke={C.line} />
      <rect x="430" y="292" width="250" height="14" rx="6" fill={C.navyMid} />
      <rect x="600" y="240" width="64" height="46" rx="6" fill={C.navy} />
      <rect x="626" y="286" width="12" height="8" fill={C.navy} />
      <path d="M612 268 C 614 256, 628 252, 640 252 C 650 252, 655 256, 657 260 C 649 262, 643 266, 638 272 C 632 278, 622 280, 616 277 C 613 275, 612 272, 612 268 Z" fill={C.teal} />
      {/* patient chair: back + seat (thighs rest on the seat, shins reach the floor) */}
      <rect x="262" y="282" width="12" height="74" rx="6" fill={C.tealDark} />
      <rect x="262" y="350" width="62" height="10" rx="5" fill={C.teal} />
      <rect x="268" y="360" width="5" height="20" fill={C.navyMid} />
      <rect x="314" y="360" width="5" height="20" fill={C.navyMid} />
      <Person
        variant="patient"
        clk={clk}
        x={pX}
        y={pY}
        opacity={pOpacity}
        walk={pWalk}
        mood={mood}
        seat={pSeat}
        holding="folder"
        scale={1}
      />
      <Person variant="patient" clk={clk} x={seatedX} y={seatedY} opacity={pPaper} mood={mood} seat={seated} holding="paper" scale={1} />
      {/* plan handed over */}
      <motion.g style={{ x: paperX, y: paperY, opacity: paperOpacity }}>
        <rect x="-10" y="-13" width="20" height="26" rx="2" fill="#ffffff" stroke={C.line} />
        <path d="M-6 -6 H6 M-6 -1 H6 M-6 4 H2" stroke={C.teal} strokeWidth="1.6" />
      </motion.g>
      <Bubble x={440} y={120} show={b1} icon={FileText} tail="right" />
      <Bubble x={440} y={120} show={b2} icon={HeartPulse} tail="right" tone="teal" />
      <Bubble x={300} y={130} show={b3} icon={Smile} tail="left" />
    </>
  );
}

/* 4 · Leaving --------------------------------------------------------------- */
function Leaving({ clk, lt, labels }: SceneProps) {
  const door = useTransform(lt, (s) => window4(s, 0, 0.5, 1.5, 2.0));
  const pOpacity = useTransform(lt, (s) => window4(s, 0.2, 0.6, 3.82, 3.92));
  const pX = useTransform(lt, (s) =>
    s < 3.4 ? lerp(655, DOOR_X + 22, easeInOut(seg(s, 0.8, 3.2))) : lerp(DOOR_X + 22, DOOR_X - 8, easeIn(seg(s, 3.5, 3.88))),
  );
  const pY = useTransform(lt, (s) => (s < 3.4 ? lerp(WALK_Y, KERB_Y, seg(s, 2.2, 3.2)) : lerp(KERB_Y, KERB_Y - 10, easeIn(seg(s, 3.5, 3.88)))));
  const pWalk = useTransform(lt, (s) => window4(s, 0.7, 1.0, 3.0, 3.3));
  const carDoor = useTransform(lt, (s) => window4(s, 3.1, 3.5, 4.0, 4.4));
  const occupant = useTransform(lt, (s) => seg(s, 3.82, 3.92));
  const carX = useTransform(lt, (s) => lerp(PARK_X, 960, easeIn(seg(s, 4.5, 6.4))));
  const sparkle = useTransform(lt, (s) => window4(s, 1.0, 1.4, 3.0, 3.4));
  const sparkleY = useTransform(lt, (s) => -((s * 18) % 40));
  const mood = useMotionValue(1);
  const heartsX = useTransform(pX, (v) => v - 10);
  return (
    <>
      <Exterior clk={clk} door={door} doorSign={labels.clinicDoor} />
      <g transform={`translate(0 ${ROAD_Y})`}>
        <Car x={carX} occupant={occupant} door={carDoor} />
      </g>
      <Person variant="patient" clk={clk} x={pX} y={pY} opacity={pOpacity} walk={pWalk} mood={mood} holding="paper" flip scale={1} />
      <motion.g style={{ x: heartsX, opacity: sparkle }}>
        <motion.g style={{ y: sparkleY }}>
          {[
            [-18, 236],
            [12, 222],
            [32, 244],
          ].map(([hx, hy], i) => (
            <path
              key={i}
              transform={`translate(${hx} ${hy}) scale(${0.7 + i * 0.15})`}
              d="M0 4 C -8 -4, -14 4, 0 14 C 14 4, 8 -4, 0 4 Z"
              fill={i === 1 ? C.teal : "#ff8a9a"}
            />
          ))}
        </motion.g>
      </motion.g>
    </>
  );
}

const SCENES = [Arrival, Reception, Consultation, Leaving];

/** All four scenes stacked; each fades in only during its own time slot. */
export function JourneyScenes({ clk, labels }: { clk: MotionValue<number>; labels: SceneLabels }) {
  const l0 = useLocal(clk, 0);
  const l1 = useLocal(clk, 1);
  const l2 = useLocal(clk, 2);
  const l3 = useLocal(clk, 3);
  const locals = [l0, l1, l2, l3];
  // Scene 1 is fully visible from t = 0 (no fade-in), so the loop restarts cleanly.
  const o0 = useTransform(l0, (s) => 1 - seg(s, SCENE_LENGTH[0] - 0.3, SCENE_LENGTH[0]));
  const o1 = useTransform(l1, (s) => window4(s, 0, 0.3, SCENE_LENGTH[1] - 0.3, SCENE_LENGTH[1]));
  const o2 = useTransform(l2, (s) => window4(s, 0, 0.3, SCENE_LENGTH[2] - 0.3, SCENE_LENGTH[2]));
  const o3 = useTransform(l3, (s) => window4(s, 0, 0.3, SCENE_LENGTH[3] - 0.3, SCENE_LENGTH[3]));
  const opacities = [o0, o1, o2, o3];
  return (
    <>
      {SCENES.map((Scene, i) => (
        <motion.g key={i} style={{ opacity: opacities[i] }}>
          <Scene clk={clk} lt={locals[i]} labels={labels} />
        </motion.g>
      ))}
    </>
  );
}
