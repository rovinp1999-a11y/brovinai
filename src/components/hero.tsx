"use client";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-end justify-center overflow-hidden pb-12 sm:pb-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        <motion.h1
          variants={itemVariants}
          className="mb-1 text-[10px] font-medium leading-tight tracking-wide sm:text-xs"
        >
          Hi, my name is{" "}
          <span className="text-foreground">Rovin</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-2xl font-light text-text-muted sm:text-3xl md:text-4xl"
        >
          You can call me{" "}
          <span className="bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-green bg-clip-text font-bold text-transparent shimmer-text">
            Brovin
          </span>
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-12 flex justify-center"
        >
          <svg className="h-8 w-5 animate-bounce text-foreground/30" fill="none" viewBox="0 0 24 40" stroke="currentColor" strokeWidth={2}>
            <rect x="7" y="1" width="10" height="18" rx="5" />
            <line x1="12" y1="6" x2="12" y2="10" />
            <path d="M8 28l4 4 4-4" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
