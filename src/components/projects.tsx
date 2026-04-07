"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const projects = [
  {
    title: "King's Gambit: Chess Survival",
    description:
      "A chess-inspired survival mobile game I vibe coded from scratch using AI — no game dev background, no Unity. Built the entire game with AI agents handling code generation, asset creation, and testing. Now live on iOS and Android.",
    tech: ["Vibe Coded", "AI Agents", "Mobile", "iOS", "Android"],
    link: "https://www.kingsgambit.fun/",
    image: "/images/anichess-preview.jpg",
    cta: "Play Now",
    extra: "Available on App Store & Google Play",
  },
  {
    title: "Anichess",
    description:
      "A next-gen chess platform that fuses traditional chess with spell mechanics. I led the product strategy and shipped features using an AI-powered workflow — from spec writing to deployment, all orchestrated through AI agents.",
    tech: ["Product Strategy", "AI Workflow", "Web3", "Gaming"],
    link: "https://anichess.com",
    image: "/images/anichess-real.jpg",
    cta: "Visit Anichess",
    extra: "1M+ registered players",
  },
];

function ProjectRow({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isReversed = index % 2 !== 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 1.0 }}
      className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
    >
      {/* Image */}
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative overflow-hidden rounded-2xl ${isReversed ? "lg:order-last" : ""}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl glass-card">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
        </div>
      </a>

      {/* Text */}
      <div>
        <h3 className="mb-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {project.title}
        </h3>
        <p className="mb-6 text-base leading-relaxed text-text-muted">
          {project.description}
        </p>

        {project.extra && (
          <p className="mb-4 font-mono text-sm text-accent-green">
            {project.extra}
          </p>
        )}

        <div className="mb-6 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-background/50 px-3 py-1 font-mono text-xs text-text-muted"
            >
              {t}
            </span>
          ))}
        </div>

        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex h-10 items-center gap-2 rounded-lg bg-accent-cyan/10 px-6 font-medium text-accent-cyan transition-all hover:bg-accent-cyan hover:text-background hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]"
        >
          {project.cta}
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </a>
      </div>
    </motion.div>
  );
}

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.0 }}
          className="mb-16"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-sm text-accent-green">
              {"// projects"}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Featured{" "}
            <span className="bg-gradient-to-r from-accent-green to-accent-cyan bg-clip-text text-transparent shimmer-text">
              Projects
            </span>
          </h2>
        </motion.div>

        <div className="space-y-24">
          {projects.map((project, i) => (
            <ProjectRow key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
