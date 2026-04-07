"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const articles = [
  {
    title: "Vibe Coding for Kids: Making Games with AI",
    source: "Startup Kids Club",
    date: "2026",
    description:
      "Hosted a vibe coding session in Singapore, teaching kids how to make games using AI-powered coding tools.",
    link: "https://www.startupkidsclub.co/blog/vibe-coding-kids-making-games",
    tag: "Teaching",
    image: "/images/blog-vibe-coding.png",
  },
  {
    title: "King's Gambit: Chess-Themed Roguelike Now on iOS & Android",
    source: "Pocket Gamer",
    date: "Feb 2026",
    description:
      "King's Gambit puts you in the shoes of a lone King against the horde. Debuted at the Chess.com Speed Chess Championship.",
    link: "https://www.pocketgamer.com/kings-gambit/available-now/",
    tag: "Launch",
    image: "/images/blog-kg-pocketgamer.jpg",
  },
  {
    title: "CoinEx & Anichess Sponsor PH 2025 National Chess Championship",
    source: "Journal Daily News",
    date: "Mar 2025",
    description:
      "Represented Anichess at the National Age Group Chess Championship in Batangas, Philippines. Interviewed by UNTV.",
    link: "https://journaldailynewsonline.com.ph/index.php/2025/03/18/coinex-anichess-sponsor-ph-2025-national-chess-championship/",
    tag: "Event",
    image: "/images/blog-philippines.png",
  },
  {
    title: "Anichess x Chess.com $10,000 Tournament",
    source: "Chess.com",
    date: "Feb 2025",
    description:
      "Anichess partnered with Chess.com to host a $10,000 prize pool tournament with spell-enhanced chess.",
    link: "https://www.chess.com/news/view/announcing-anichess-x-chesscom-tournament",
    tag: "Tournament",
    image: "/images/blog-chess-tournament.png",
  },
  {
    title: "Anichess Partners with Team Secret",
    source: "Animoca Brands",
    date: "May 2024",
    description:
      "Joined forces with global esports org Team Secret, later signing GM Anish Giri for the Esports World Cup.",
    link: "https://www.animocabrands.com/anichess-partners-with-esports-leader-team-secret-ahead-of-pvp-launch",
    tag: "Partnership",
    image: "/images/blog-team-secret.jpg",
  },
  {
    title: "Anichess Launches Public Alpha",
    source: "Esports Insider",
    date: "Oct 2024",
    description:
      "Anichess launched its public alpha with PvP matches and spell-enhanced chess mechanics.",
    link: "https://esportsinsider.com/2024/10/anichess-public-alpha-launch",
    tag: "Launch",
    image: "/images/anichess-real.jpg",
  },
];

const tagColors: Record<string, string> = {
  Teaching: "text-accent-green border-accent-green/30",
  Launch: "text-accent-cyan border-accent-cyan/30",
  Event: "text-accent-purple border-accent-purple/30",
  Tournament: "text-yellow-400 border-yellow-400/30",
  Partnership: "text-pink-400 border-pink-400/30",
};

export function Press() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="press" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
            <span className="font-mono text-sm text-accent-cyan">
              {"// journey"}
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
          </div>

          <h2 className="mb-6 text-center text-4xl font-bold tracking-tight sm:text-5xl">
            My{" "}
            <span className="bg-gradient-to-r from-accent-cyan to-accent-green bg-clip-text text-transparent shimmer-text">
              Journey
            </span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-text-muted">
            From teaching kids vibe coding in Singapore to launching games at
            world chess championships.
          </p>
        </motion.div>
      </div>

      {/* Horizontal scroll timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="pointer-events-none absolute left-0 right-0 top-[11rem] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div
          className="horizontal-scroll-mask overflow-x-auto pb-4"
          data-lenis-prevent
        >
          <div className="flex gap-4 px-6 sm:gap-6 lg:px-[max(1.5rem,calc((100vw-72rem)/2))]">
            {articles.map((article, i) => (
              <motion.a
                key={article.link}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative w-72 flex-shrink-0 sm:w-80 overflow-hidden rounded-xl glass-card transition-all"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="320px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgb(13,13,13)] via-transparent to-transparent" />
                  <div className="absolute left-3 top-3">
                    <span
                      className={`rounded-md border bg-background/80 px-2 py-0.5 font-mono text-xs backdrop-blur-sm ${tagColors[article.tag] || "text-text-muted border-border"}`}
                    >
                      {article.tag}
                    </span>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="absolute left-1/2 top-[11rem] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent-cyan bg-background" />

                <div className="p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-mono text-lg font-bold text-accent-cyan">
                      {article.date}
                    </span>
                  </div>
                  <h3 className="mb-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-accent-cyan">
                    {article.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-text-muted line-clamp-2">
                    {article.description}
                  </p>
                  <span className="mt-3 block font-mono text-xs text-accent-purple">
                    {article.source} ↗
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
