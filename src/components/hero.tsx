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
    <section className="relative flex min-h-screen items-end justify-center overflow-hidden pb-24 sm:pb-32">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        <motion.h1
          variants={itemVariants}
          className="mb-4 text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
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
          <span className="font-mono text-xs tracking-widest text-text-muted/50">
            scroll down
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
