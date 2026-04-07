"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const logos = [
  "Animoca Brands",
  "Chess.com",
  "Anichess",
  "Team Secret",
  "Magnus Carlsen",
  "Startup Kids Club",
  "Pocket Gamer",
];

export function LogoStrip() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="relative border-y border-border/30 py-12">
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="mx-auto max-w-6xl px-6"
      >
        <p className="mb-8 text-center font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
          Trusted by & Featured in
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10 sm:gap-y-4">
          {logos.map((name, i) => (
            <span
              key={name}
              className="flex items-center gap-10"
            >
              <span className="font-mono text-sm font-medium text-text-muted/50 transition-colors hover:text-foreground">
                {name}
              </span>
              {i < logos.length - 1 && (
                <span className="hidden h-4 w-px bg-border/50 lg:block" />
              )}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
