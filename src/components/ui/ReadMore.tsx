"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { buttonClasses } from "./Button";

/** Accessible disclosure: reveals additional content below a "Read More" button. */
export function ReadMore({
  children,
  labels = { more: "Read More", less: "Show Less" },
}: {
  children: React.ReactNode;
  labels?: { more: string; less: string };
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={buttonClasses("secondary")}
      >
        {open ? labels.less : labels.more}
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
    </div>
  );
}
