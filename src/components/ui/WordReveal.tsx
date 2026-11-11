"use client";

import { motion } from "framer-motion";
import { Fragment } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Reveals text word by word, rising from a soft mask. Words stay real text
 * (with their spaces), so screen readers and search engines read it normally.
 */
export function WordReveal({
  text,
  delay = 0,
  className = "",
  wordClassName = "",
}: {
  text: string;
  delay?: number;
  className?: string;
  /** Applied to each word (e.g. gradient text, which must sit on the moving element). */
  wordClassName?: string;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className="word-mask inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className={`inline-block ${wordClassName}`}
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.9, delay: delay + i * 0.08, ease }}
            >
              {w}
            </motion.span>
          </span>
          {/* Space lives outside the inline-block so it never collapses. */}
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </span>
  );
}
