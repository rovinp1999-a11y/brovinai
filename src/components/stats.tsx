"use client";

import { motion, useInView, useSpring, useMotionValue } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function AnimatedCounter({
  target,
  suffix = "",
  color,
  label,
}: {
  target: number;
  suffix?: string;
  color: string;
  label: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 50, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionVal.set(target);
    }
  }, [isInView, motionVal, target]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      setDisplay(Math.round(v));
    });
    return unsubscribe;
  }, [spring]);

  return (
    <div ref={ref} className="relative text-center">
      <span className={`counter-number block font-mono text-5xl font-bold ${color}`}>
        {display}
        {suffix}
      </span>
      <span className="mt-2 block text-sm text-text-muted">{label}</span>
    </div>
  );
}

export function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-20 grid-bg">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-6 lg:grid-cols-4"
      >
        <AnimatedCounter target={1} suffix="M+" color="text-accent-cyan" label="Anichess Players" />
        <div className="hidden lg:block absolute left-1/4 top-1/4 h-1/2 w-px bg-border" />
        <AnimatedCounter target={2} suffix="" color="text-accent-purple" label="Games Shipped" />
        <div className="hidden lg:block absolute left-1/2 top-1/4 h-1/2 w-px bg-border" />
        <AnimatedCounter target={100} suffix="+" color="text-accent-green" label="Kids Taught" />
        <div className="hidden lg:block absolute left-3/4 top-1/4 h-1/2 w-px bg-border" />
        <AnimatedCounter target={6} suffix="+" color="text-accent-cyan" label="Press Features" />
      </motion.div>
    </section>
  );
}
