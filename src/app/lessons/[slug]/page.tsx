import type { Metadata } from "next";
import Link from "next/link";

const lessonsData: Record<
  string,
  { title: string; number: string; content: string }
> = {
  "what-is-vibe-coding": {
    title: "What is Vibe Coding?",
    number: "01",
    content: `Vibe coding is more than a methodology — it's a mindset. It's about entering a flow state where creativity and technical skill merge seamlessly.

When you vibe code, you're not just writing logic. You're crafting experiences. Every animation, every color choice, every interaction is intentional and feels right.

## The Core Principles

**1. Flow Over Force** — Don't fight the code. Let it guide you. When something feels forced, step back and find the natural path.

**2. Aesthetics Matter** — Beautiful code creates beautiful experiences. Take time to make things look and feel right.

**3. Creative Energy** — Code when you're inspired. Your best work comes from genuine excitement about what you're building.

**4. Iterative Refinement** — Start with the vibe, then refine. Don't try to perfect everything on the first pass.

## Why Vibe Coding?

Traditional coding education focuses on algorithms and data structures — the "what." Vibe coding focuses on the "how" — how it feels to build, how the result feels to use.

The best developers aren't just technically skilled. They have taste. Vibe coding helps you develop that taste.`,
  },
  "creative-environment": {
    title: "Setting Up Your Creative Environment",
    number: "02",
    content: `Your environment shapes your output. A cluttered, slow setup kills creative flow. Let's build a workspace that inspires.

## Editor Setup

Your editor is your instrument. Configure it to feel like an extension of your mind.

**Theme**: Dark themes reduce eye strain and set the mood. Try themes with subtle syntax highlighting that uses color purposefully.

**Font**: Use a monospace font with ligatures — JetBrains Mono or Fira Code. They make your code feel crafted.

**Minimal UI**: Hide everything you don't need. Sidebars, status bars, minimap — remove the noise.

## Terminal

Your terminal should feel powerful and fast. A good prompt shows you what you need and nothing more.

## Music & Ambiance

Sound shapes focus. Find what works for you — lo-fi beats, ambient soundscapes, or complete silence.

The key is consistency. Your environment should trigger flow state automatically.`,
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = lessonsData[slug];
  return {
    title: lesson
      ? `${lesson.title} — Vibe Coding Lessons`
      : "Lesson Not Found",
    description: lesson
      ? `Lesson ${lesson.number}: ${lesson.title}`
      : undefined,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = lessonsData[slug];

  if (!lesson) {
    return (
      <section className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <span className="mb-6 inline-block font-mono text-sm tracking-wider text-accent-purple">
            // coming soon
          </span>
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
            This lesson is{" "}
            <span className="bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
              coming soon
            </span>
          </h1>
          <p className="mb-8 text-lg text-text-muted">
            I&apos;m still writing this one. Check back tomorrow.
          </p>
          <Link
            href="/lessons"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent-cyan/10 px-6 font-mono text-sm text-accent-cyan transition-all hover:bg-accent-cyan hover:text-background"
          >
            ← Back to lessons
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="relative min-h-screen pt-32 pb-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-accent-cyan/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6">
        <Link
          href="/lessons"
          className="mb-8 inline-flex items-center gap-2 font-mono text-sm text-text-muted transition-colors hover:text-accent-cyan"
        >
          <span>←</span> Back to lessons
        </Link>

        <div className="mb-2">
          <span className="font-mono text-sm text-accent-cyan">
            Lesson {lesson.number}
          </span>
        </div>
        <h1 className="mb-12 text-4xl font-bold tracking-tight sm:text-5xl">
          {lesson.title}
        </h1>

        <div className="prose-dark space-y-6">
          {lesson.content.split("\n\n").map((paragraph, i) => {
            if (paragraph.startsWith("## ")) {
              return (
                <h2
                  key={i}
                  className="mt-12 mb-4 text-2xl font-bold text-foreground"
                >
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }
            if (paragraph.startsWith("**") && paragraph.includes("**")) {
              return (
                <p
                  key={i}
                  className="text-base leading-relaxed text-text-muted"
                  dangerouslySetInnerHTML={{
                    __html: paragraph
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>'),
                  }}
                />
              );
            }
            return (
              <p
                key={i}
                className="text-base leading-relaxed text-text-muted"
                dangerouslySetInnerHTML={{
                  __html: paragraph
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>'),
                }}
              />
            );
          })}
        </div>
      </div>
    </article>
  );
}
