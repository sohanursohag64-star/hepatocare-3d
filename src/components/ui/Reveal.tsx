"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

type RevealOptions = { delay?: number; y?: number };

function revealProps({ delay = 0, y = 24 }: RevealOptions) {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "0px 0px -80px 0px" },
    transition: { duration: 0.7, delay, ease },
  } as const;
}

/** Fades and lifts its children into view once, when scrolled into the viewport. */
export function Reveal({ delay, y, ...rest }: HTMLMotionProps<"div"> & RevealOptions) {
  return <motion.div {...revealProps({ delay, y })} {...rest} />;
}

/** List-item variant of {@link Reveal}, for use directly inside <ul>/<ol>. */
export function RevealItem({ delay, y, ...rest }: HTMLMotionProps<"li"> & RevealOptions) {
  return <motion.li {...revealProps({ delay, y })} {...rest} />;
}
