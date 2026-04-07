"use client";

import { useEffect, useRef, useState } from "react";

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

function useElementScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return visible;
}

// Spacer that just provides scroll height for animation
export function ScrollSpacer({ height = "100vh" }: { height?: string }) {
  return <div style={{ height }} />;
}

// "Inside the monitor" — personal journey story
export function MonitorContent() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress();

  // Fast appearance: fade in at 12-16%, fade out at 34-38%
  let opacity = 0;
  if (progress > 0.12 && progress < 0.40) {
    if (progress < 0.16) {
      opacity = (progress - 0.12) / 0.04;
    } else if (progress > 0.34) {
      opacity = 1 - (progress - 0.34) / 0.06;
    } else {
      opacity = 1;
    }
  }

  return (
    <div
      ref={ref}
      className="flex min-h-[150vh] items-center justify-center px-6 py-24"
      style={{ opacity: Math.max(0, Math.min(1, opacity)) }}
    >
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-border/50 bg-surface/90 p-6 backdrop-blur-xl sm:p-10">
          {/* Window chrome */}
          <div className="mb-6 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500/60" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
            <div className="h-3 w-3 rounded-full bg-green-500/60" />
            <span className="ml-3 font-mono text-xs text-text-muted">
              ~/my-story.md
            </span>
          </div>

          {/* Personal journey — storytelling, not a resume */}
          <div className="space-y-5 text-sm leading-relaxed sm:text-base">
            <p className="text-foreground">
              I started using{" "}
              <span className="text-accent-cyan font-semibold">AI to help me work</span>{" "}
              about two years ago. At first, it was just asking ChatGPT
              simple questions — nothing crazy.
            </p>

            <p className="text-foreground">
              But then something clicked. I realized AI wasn&apos;t just a tool
              for answering questions — it was a{" "}
              <span className="text-accent-purple font-semibold">
                creative partner
              </span>
              . I could describe what I wanted to build, and together we&apos;d
              figure out how to make it real.
            </p>

            <p className="text-foreground">
              So I did something a little crazy — I{" "}
              <span className="text-accent-green font-semibold">
                vibe coded an entire mobile game
              </span>{" "}
              from scratch. No game dev background. No Unity experience.
              Just me, AI, and a lot of late nights. That game became{" "}
              <span className="text-accent-cyan">King&apos;s Gambit</span>,
              and it&apos;s now live on the App Store and Google Play.
            </p>

            <p className="text-foreground">
              That experience changed how I think about building things.
              I went from &quot;I don&apos;t know how to code that&quot; to{" "}
              <span className="text-accent-purple font-semibold">
                &quot;let me figure it out with AI.&quot;
              </span>
            </p>

            <p className="text-foreground">
              Today I work at{" "}
              <span className="text-accent-cyan">Animoca Brands</span> as a
              Product Owner, shipping products in the chess and gaming space.
              But what really gets me excited is sharing what I&apos;ve learned
              along the way.
            </p>

            <p className="text-text-muted italic">
              Because if I could build a game with zero experience,{" "}
              <span className="text-foreground not-italic font-semibold">
                imagine what you could build.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Teaching section — text overlay when avatar is at whiteboard
export function TeachingOverlay() {
  const progress = useScrollProgress();

  // Teaching happens at narrative progress ~0.68-0.85, which is ~0.35-0.45 raw scroll
  // Adjusted to use viewport-based detection instead
  let opacity = 0;
  if (progress > 0.32 && progress < 0.48) {
    if (progress < 0.36) {
      opacity = (progress - 0.32) / 0.04; // fade in
    } else if (progress > 0.44) {
      opacity = 1 - (progress - 0.44) / 0.04; // fade out
    } else {
      opacity = 1;
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-6"
      style={{ opacity: Math.max(0, Math.min(1, opacity)) }}
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-6 font-mono text-sm tracking-wider text-accent-cyan">
          // now I teach what I know
        </p>
        <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-6xl">
          I help people{" "}
          <span className="bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
            supercharge their workflow
          </span>{" "}
          with AI
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-text-muted sm:text-xl">
          Whether you&apos;re a developer, a creator, or someone who&apos;s
          never written a line of code — I believe AI can be your unfair
          advantage. I teach people how to use it to build real things, faster.
        </p>
      </div>
    </div>
  );
}

// Big CTA — "Wanna learn more about me?"
export function NarrativeCTA() {
  const progress = useScrollProgress();

  // CTA appears at ~0.45 raw scroll (after teaching fades), stays visible
  let opacity = 0;
  if (progress > 0.44) {
    opacity = Math.min(1, (progress - 0.44) / 0.04);
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-6"
      style={{ opacity: Math.max(0, Math.min(1, opacity)) }}
    >
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-bold leading-tight sm:text-5xl md:text-7xl">
          Wanna learn more{" "}
          <span className="bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-green bg-clip-text text-transparent shimmer-text">
            about me?
          </span>
        </h2>
        <p className="mt-8 font-mono text-sm text-text-muted">
          ↓ keep scrolling
        </p>
      </div>
    </div>
  );
}
