"use client";

import { useEffect, useState } from "react";

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

const SCROLL_END = 0.55;

function ease(min: number, max: number, value: number) {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return t * t * (3 - 2 * t);
}

// Spacer
export function ScrollSpacer({ height = "100vh" }: { height?: string }) {
  return <div style={{ height }} />;
}

// my-story.md — Mac-style window, fixed center, fades in/out
export function MonitorContent() {
  const progress = useScrollProgress();

  // Camera parks at monitor: sp 0.18-0.30 = raw 0.10-0.165
  // Fade out when camera zooms out: sp 0.30+ = raw 0.165+
  let opacity = 0;
  if (progress > 0.12 && progress < 0.18) {
    if (progress < 0.14) opacity = (progress - 0.12) / 0.02;
    else if (progress > 0.145) opacity = 1 - (progress - 0.145) / 0.035;
    else opacity = 1;
  }

  const scale = 0.92 + Math.min(1, opacity) * 0.08;

  return (
    <div className="min-h-[150vh]">
      <div
        className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center px-4"
        style={{
          opacity: Math.max(0, Math.min(1, opacity)),
          pointerEvents: opacity > 0 ? "auto" : "none",
        }}
      >
        <div className="mx-auto w-full max-w-5xl">
          <div className="overflow-hidden rounded-xl border border-border/50 bg-surface/95 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2 border-b border-white/5 bg-surface-light/80 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <div className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-4 font-mono text-xs text-text-muted/50">
                ~/my-story.md
              </span>
            </div>
            <div className="p-8 sm:p-12">
              <div className="space-y-5 text-sm leading-relaxed sm:text-base">
                <p className="text-foreground">
                  Two years ago, I was a product manager doing everything
                  manually — writing specs, coordinating teams, chasing
                  deadlines. Then I discovered{" "}
                  <span className="font-semibold text-accent-cyan">
                    AI could do most of the heavy lifting for me
                  </span>
                  .
                </p>
                <p className="text-foreground">
                  It started small. Automating reports. Drafting documents.
                  But the more I used it, the more I realized —{" "}
                  <span className="font-semibold text-accent-purple">
                    AI wasn&apos;t just a tool, it was an entire team
                  </span>
                  .
                </p>
                <p className="text-foreground">
                  Then I{" "}
                  <span className="font-semibold text-accent-cyan">
                    vibe coded a game from scratch
                  </span>
                  . No game dev background — just sleepless nights and a
                  lot of prompts with AI. Now the game I vibe coded —{" "}
                  <span className="font-semibold text-accent-green">
                    King&apos;s Gambit
                  </span>{" "}
                  — is live on the App Store and Google Play.
                </p>
                <p className="text-foreground">
                  So I went all in. I{" "}
                  <span className="font-semibold text-accent-green">
                    built a team of AI agents
                  </span>{" "}
                  that handle different parts of my workflow — from coding
                  to content creation to data analysis.
                </p>
                <p className="text-foreground">
                  Today, I run what I call a{" "}
                  <span className="font-semibold text-accent-purple">
                    one-man company
                  </span>
                  . I ship products, build apps, create content, and manage
                  projects — all powered by AI agents.
                </p>
                <p className="italic text-text-muted">
                  The future isn&apos;t about replacing people with AI.{" "}
                  <span className="font-semibold not-italic text-foreground">
                    It&apos;s about one person doing the work of many.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Content 1: "I help people supercharge their workflow with AI"
export function ContentSupercharge() {
  const progress = useScrollProgress();
  const sp = Math.min(1, progress / SCROLL_END);

  // raw 0.22 = sp 0.40, so start after my-story fades
  let opacity = 0;
  if (sp > 0.40 && sp < 0.54) {
    if (sp < 0.44) opacity = ease(0.40, 0.44, sp);
    else if (sp > 0.50) opacity = 1 - ease(0.50, 0.54, sp);
    else opacity = 1;
  }

  return (
    <div className="min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center px-6"
        style={{ opacity: Math.max(0, Math.min(1, opacity)) }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 font-mono text-sm tracking-wider text-accent-cyan">
            // what I do now
          </p>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-6xl">
            I help people{" "}
            <span className="bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
              supercharge their workflow
            </span>{" "}
            with AI
          </h2>
        </div>
      </div>
    </div>
  );
}

// Content 2: "From one agent to multiple agents"
export function ContentCloneAgents() {
  const progress = useScrollProgress();
  const sp = Math.min(1, progress / SCROLL_END);

  // Content 2: after content 1 fades
  let opacity = 0;
  if (sp > 0.54 && sp < 0.70) {
    if (sp < 0.58) opacity = ease(0.54, 0.58, sp);
    else if (sp > 0.66) opacity = 1 - ease(0.66, 0.70, sp);
    else opacity = 1;
  }

  return (
    <div className="min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center px-6"
        style={{ opacity: Math.max(0, Math.min(1, opacity)) }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 font-mono text-sm tracking-wider text-accent-purple">
            // scale yourself
          </p>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-6xl">
            From{" "}
            <span className="text-accent-cyan">one agent</span>
            {" "}to{" "}
            <span className="bg-gradient-to-r from-accent-purple to-accent-green bg-clip-text text-transparent">
              multiple agents
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-text-muted">
            One AI agent is powerful. A team of them is unstoppable.
          </p>
        </div>
      </div>
    </div>
  );
}

// Content 3: "Build a team of AI agent employees"
export function ContentAITeam() {
  const progress = useScrollProgress();
  const sp = Math.min(1, progress / SCROLL_END);

  // Content 3: after content 2 fades
  let opacity = 0;
  if (sp > 0.70 && sp < 0.88) {
    if (sp < 0.74) opacity = ease(0.70, 0.74, sp);
    else if (sp > 0.84) opacity = 1 - ease(0.84, 0.88, sp);
    else opacity = 1;
  }

  return (
    <div className="min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center px-6"
        style={{ opacity: Math.max(0, Math.min(1, opacity)) }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-6 font-mono text-sm tracking-wider text-accent-green">
            // the future of work
          </p>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-6xl">
            Build a team of{" "}
            <span className="bg-gradient-to-r from-accent-green via-accent-cyan to-accent-purple bg-clip-text text-transparent">
              AI agent employees
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-text-muted">
            Each agent handles a different role — developer, researcher,
            designer, writer. You&apos;re the CEO. They&apos;re your team.
          </p>
        </div>
      </div>
    </div>
  );
}

// Content 4: "Wanna learn more about me?"
export function NarrativeCTA() {
  const progress = useScrollProgress();
  const sp = Math.min(1, progress / SCROLL_END);

  // Content 4: only after content 3 fully fades (0.88)
  let opacity = 0;
  if (sp > 0.89 && sp < 1.0) {
    if (sp < 0.93) opacity = ease(0.89, 0.93, sp);
    else if (sp > 0.96) opacity = 1 - ease(0.96, 1.0, sp);
    else opacity = 1;
  }

  return (
    <div className="min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center px-6"
        style={{ opacity: Math.max(0, Math.min(1, opacity)) }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold leading-tight sm:text-5xl md:text-7xl">
            Wanna learn more{" "}
            <span className="shimmer-text bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-green bg-clip-text text-transparent">
              about me?
            </span>
          </h2>
          <p className="mt-8 font-mono text-sm text-text-muted">
            ↓ keep scrolling
          </p>
        </div>
      </div>
    </div>
  );
}
