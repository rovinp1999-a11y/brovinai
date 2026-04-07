"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type Lesson = {
  number: string;
  title: string;
  description: string;
  tags: string[];
  slug: string;
  duration: string;
};

export function LessonsList({ lessons }: { lessons: Lesson[] }) {
  return (
    <div className="space-y-4">
      {lessons.map((lesson, i) => (
        <motion.div
          key={lesson.slug}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
        >
          <Link
            href={`/lessons/${lesson.slug}`}
            className="group flex gap-6 rounded-xl border border-border/50 bg-surface p-6 transition-all hover:border-accent-purple/30 hover:bg-surface-light hover:shadow-[0_0_40px_rgba(139,92,246,0.05)]"
          >
            <div className="flex-shrink-0">
              <span className="font-mono text-4xl font-bold text-accent-purple/20 transition-colors group-hover:text-accent-purple/40">
                {lesson.number}
              </span>
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground transition-colors group-hover:text-accent-purple">
                  {lesson.title}
                </h2>
                <span className="hidden font-mono text-xs text-text-muted sm:inline">
                  {lesson.duration}
                </span>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-text-muted">
                {lesson.description}
              </p>
              <div className="flex gap-2">
                {lesson.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden items-center sm:flex">
              <svg
                className="h-5 w-5 text-text-muted transition-all group-hover:translate-x-1 group-hover:text-accent-purple"
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
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
