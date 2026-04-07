"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: RevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const directionMap = {
    up: { hidden: { y: 60 }, visible: { y: 0 } },
    left: { hidden: { x: -60 }, visible: { x: 0 } },
    right: { hidden: { x: 60 }, visible: { x: 0 } },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directionMap[direction].hidden }}
      animate={
        isInView
          ? { opacity: 1, ...directionMap[direction].visible }
          : { opacity: 0, ...directionMap[direction].hidden }
      }
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ClipReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: "ellipse(0% 0% at 50% 50%)" }}
      animate={
        isInView
          ? { clipPath: "ellipse(75% 75% at 50% 50%)" }
          : { clipPath: "ellipse(0% 0% at 50% 50%)" }
      }
      transition={{ duration: 1.2, delay, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
