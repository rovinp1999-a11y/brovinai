"use client";

import { motion } from "framer-motion";

const items = [
  "AI AGENTS",
  "VIBE CODING",
  "ONE-MAN COMPANY",
  "NEXT.JS",
  "TYPESCRIPT",
  "AUTOMATION",
  "SHIP FAST",
  "AI WORKFLOWS",
  "BUILD WITH AI",
  "CREATIVE DEV",
];

export function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-border/50 bg-surface py-4">
      {/* Gradient masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-surface to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-surface to-transparent" />

      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-8 font-mono text-sm tracking-widest text-text-muted">
            {item}
            <span className="ml-8 text-accent-cyan/30">/</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
