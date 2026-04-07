import type { Metadata } from "next";
import { LessonsList } from "./lessons-list";

export const metadata: Metadata = {
  title: "Vibe Coding Lessons — Brovin",
  description:
    "Learn vibe coding through structured lessons. From fundamentals to advanced techniques.",
};

const lessons = [
  {
    number: "01",
    title: "What is Vibe Coding?",
    description:
      "Discover the philosophy of coding in flow state. Learn how to merge creativity with technical skill for a more enjoyable development experience.",
    tags: ["Beginner", "Philosophy"],
    slug: "what-is-vibe-coding",
    duration: "15 min read",
  },
  {
    number: "02",
    title: "Setting Up Your Creative Environment",
    description:
      "Configure your tools, editor, and workspace for maximum creative flow and minimal friction. The right setup makes all the difference.",
    tags: ["Setup", "Tools"],
    slug: "creative-environment",
    duration: "20 min read",
  },
  {
    number: "03",
    title: "Building Your First Vibe Project",
    description:
      "Hands-on: build a visually stunning project from scratch using vibe coding principles. Learn to let creativity guide your code.",
    tags: ["Hands-on", "Project"],
    slug: "first-vibe-project",
    duration: "45 min read",
  },
  {
    number: "04",
    title: "Advanced Animation Patterns",
    description:
      "Master scroll-driven animations, page transitions, and micro-interactions that bring user interfaces to life.",
    tags: ["Advanced", "Animation"],
    slug: "advanced-animations",
    duration: "30 min read",
  },
  {
    number: "05",
    title: "The Art of Dark Themes",
    description:
      "Deep dive into creating beautiful dark themes — color theory, contrast ratios, glow effects, and accessibility considerations.",
    tags: ["Design", "CSS"],
    slug: "dark-themes",
    duration: "25 min read",
  },
  {
    number: "06",
    title: "Deploying with Confidence",
    description:
      "Ship your vibe-coded projects to the world. CI/CD, performance optimization, and making your site feel fast everywhere.",
    tags: ["DevOps", "Performance"],
    slug: "deploying-with-confidence",
    duration: "20 min read",
  },
];

export default function LessonsPage() {
  return (
    <section className="relative min-h-screen pt-32 pb-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-20 h-96 w-96 rounded-full bg-accent-purple/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6">
        <div className="mb-4">
          <span className="font-mono text-sm text-accent-purple">
            {"// lessons"}
          </span>
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Vibe Coding{" "}
          <span className="bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent">
            Lessons
          </span>
        </h1>
        <p className="mb-16 max-w-2xl text-lg text-text-muted">
          A structured curriculum to help you master vibe coding — from mindset
          to deployment. Each lesson builds on the last.
        </p>

        <LessonsList lessons={lessons} />
      </div>
    </section>
  );
}
