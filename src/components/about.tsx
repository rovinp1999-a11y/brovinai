"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { GitHubGraph } from "@/components/github-graph";

const techStack = {
  Frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  Tools: ["Cursor", "Claude", "Framer Motion"],
  Platforms: ["iOS", "Android", "Vercel", "Web3"],
};

const whatIDo = [
  {
    icon: "🚀",
    title: "Ship Products",
    desc: "Product Owner at Anichess / Animoca Brands",
  },
  {
    icon: "🎮",
    title: "Build Games",
    desc: "Vibe coded King's Gambit — on App Store & Play Store",
  },
  {
    icon: "👨‍🏫",
    title: "Teach Kids",
    desc: "Vibe coding instructor in Singapore",
  },
];

function Tile({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={`glass-card rounded-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-sm text-accent-cyan">
              {"// about"}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            About{" "}
            <span className="bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent shimmer-text">
              Me
            </span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {/* Bio — spans 4 cols */}
          <Tile className="p-6 sm:p-8 sm:col-span-2 lg:col-span-4" delay={0}>
            <div className="mb-6 flex items-center gap-2 font-mono text-sm text-text-muted">
              <span className="inline-block h-3 w-3 rounded-full bg-red-500/60" />
              <span className="inline-block h-3 w-3 rounded-full bg-yellow-500/60" />
              <span className="inline-block h-3 w-3 rounded-full bg-green-500/60" />
              <span className="ml-2">about.tsx</span>
            </div>

            <div className="space-y-4 font-mono text-sm leading-relaxed">
              <p>
                <span className="text-accent-cyan">{">"}</span>{" "}
                <span className="text-foreground">
                  I&apos;m Rovin &quot;Brovin&quot; Phan — Product Owner of{" "}
                  <span className="text-accent-cyan">King&apos;s Gambit</span>{" "}
                  at Anichess (Animoca Brands). I work at the intersection of
                  chess, gaming, and web3.
                </span>
              </p>
              <p>
                <span className="text-accent-cyan">{">"}</span>{" "}
                <span className="text-foreground">
                  By day I ship products that bring chess to millions of players.
                  By night I teach kids in Singapore how to{" "}
                  <span className="text-accent-purple">vibe code</span> —
                  turning creative energy into real apps using AI tools.
                </span>
              </p>
              <p>
                <span className="text-accent-cyan">{">"}</span>{" "}
                <span className="text-foreground">
                  I vibe coded King&apos;s Gambit — a chess-themed survival game
                  that debuted at the Chess.com Speed Chess Championship and is
                  now live on iOS &amp; Android.
                </span>
              </p>
            </div>
          </Tile>

          {/* Photo — spans 2 cols */}
          <Tile className="relative min-h-[200px] overflow-hidden sm:col-span-2 lg:col-span-2" delay={0.1}>
            <Image
              src="/images/magnus.jpg"
              alt="With Magnus Carlsen"
              width={400}
              height={500}
              className="h-full w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <span className="font-mono text-xs text-white/80">
                With World Chess Champion Magnus Carlsen
              </span>
            </div>
          </Tile>

          {/* Tech Stack — spans 2 cols */}
          <Tile className="p-6 lg:col-span-2" delay={0.15}>
            <h3 className="mb-4 font-mono text-sm text-accent-cyan">
              {">"} tech.stack
            </h3>
            <div className="space-y-4">
              {Object.entries(techStack).map(([category, items]) => (
                <div key={category}>
                  <span className="mb-2 block font-mono text-xs text-text-muted">
                    {category}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-border bg-background/50 px-3 py-1 font-mono text-xs text-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Tile>

          {/* What I Do — spans 2 cols */}
          <Tile className="p-6 lg:col-span-2" delay={0.2}>
            <h3 className="mb-4 font-mono text-sm text-accent-purple">
              {">"} what.i.do
            </h3>
            <div className="space-y-4">
              {whatIDo.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="mt-0.5 text-lg">{item.icon}</span>
                  <div>
                    <span className="block text-sm font-semibold text-foreground">
                      {item.title}
                    </span>
                    <span className="text-xs text-text-muted">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </Tile>

          {/* Fun Fact — spans 2 cols */}
          <Tile
            className="flex items-center p-6 lg:col-span-2"
            delay={0.25}
          >
            <div>
              <span className="mb-2 block font-mono text-xs text-accent-green">
                fun_fact.md
              </span>
              <p className="text-sm leading-relaxed text-foreground">
                Met <span className="text-accent-cyan">Magnus Carlsen</span>{" "}
                (5x World Chess Champion) and work alongside his team building
                Anichess — a game with{" "}
                <span className="text-accent-purple">1M+ registered players</span>.
              </p>
            </div>
          </Tile>

          {/* GitHub Contribution Graph — full width */}
          <div className="lg:col-span-6">
            <GitHubGraph />
          </div>
        </div>
      </div>
    </section>
  );
}
