"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const lessons = [
  {
    number: "01",
    title: "What is Vibe Coding?",
    description:
      "Discover the philosophy of coding in flow state. Learn how to merge creativity with technical skill.",
    tags: ["Beginner", "Philosophy"],
    slug: "what-is-vibe-coding",
  },
  {
    number: "02",
    title: "Setting Up Your Creative Environment",
    description:
      "Configure your tools, editor, and workspace for maximum creative flow and minimal friction.",
    tags: ["Setup", "Tools"],
    slug: "creative-environment",
  },
  {
    number: "03",
    title: "Building Your First Vibe Project",
    description:
      "Hands-on: build a visually stunning project from scratch using vibe coding principles.",
    tags: ["Hands-on", "Project"],
    slug: "first-vibe-project",
  },
  {
    number: "04",
    title: "Advanced Animation Patterns",
    description:
      "Master scroll-driven animations, page transitions, and micro-interactions that bring UIs to life.",
    tags: ["Advanced", "Animation"],
    slug: "advanced-animations",
  },
];

export function LessonsPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const featured = lessons[0];
  const rest = lessons.slice(1);

  return (
    <section id="lessons" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
            <span className="font-mono text-sm text-accent-purple">
              {"// lessons"}
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
          </div>

          <h2 className="mb-6 text-center text-4xl font-bold tracking-tight sm:text-5xl">
            Learn{" "}
            <span className="bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent shimmer-text">
              Vibe Coding
            </span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-text-muted">
            Structured lessons to help you master the art of coding in flow
            state.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Featured lesson */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-2 lg:col-span-2"
          >
            <Link
              href={`/lessons/${featured.slug}`}
              className="group relative block h-full overflow-hidden rounded-xl glass-card-highlight p-8 transition-all"
            >
              <span className="pointer-events-none absolute right-6 top-4 font-mono text-8xl font-bold text-accent-cyan/10">
                {featured.number}
              </span>

              <div className="relative z-10">
                <div className="mb-4 flex gap-2">
                  {featured.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-accent-cyan/20 bg-accent-cyan/5 px-2 py-0.5 font-mono text-xs text-accent-cyan"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="mb-3 text-2xl font-bold text-foreground transition-colors group-hover:text-accent-cyan">
                  {featured.title}
                </h3>
                <p className="mb-6 max-w-lg text-base leading-relaxed text-text-muted">
                  {featured.description}
                </p>

                <span className="inline-flex items-center gap-2 rounded-lg bg-accent-cyan/10 px-6 py-2.5 font-medium text-accent-cyan transition-all group-hover:bg-accent-cyan group-hover:text-background">
                  Start Lesson
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
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Remaining lessons */}
          <div className="space-y-4">
            {rest.map((lesson, i) => (
              <motion.div
                key={lesson.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              >
                <Link
                  href={`/lessons/${lesson.slug}`}
                  className="group flex items-center gap-4 rounded-xl glass-card p-4 transition-all"
                >
                  <span className="font-mono text-2xl font-bold text-accent-cyan/20 transition-colors group-hover:text-accent-cyan/50">
                    {lesson.number}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-accent-cyan">
                      {lesson.title}
                    </h3>
                    <div className="mt-1 flex gap-1">
                      {lesson.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[10px] text-text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <svg
                    className="h-4 w-4 text-text-muted transition-all group-hover:translate-x-1 group-hover:text-accent-cyan"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            href="/lessons"
            className="inline-flex items-center gap-2 font-mono text-sm text-accent-cyan transition-all hover:gap-3"
          >
            View all lessons
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
