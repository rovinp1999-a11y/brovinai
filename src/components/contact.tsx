"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const socials = [
  {
    name: "GitHub",
    href: "https://github.com/Brovinchess",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "X / Twitter",
    href: "https://x.com/0xRovin",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/phan-rovin-65a698203/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Telegram",
    href: "https://t.me/rovin7777",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
];

const terminalLines = [
  { prompt: "$ whoami", output: '> Rovin "Brovin" Phan' },
  { prompt: "$ cat contact.json", output: "" },
  { prompt: "", output: '> {' },
  { prompt: "", output: '>   "telegram": "@rovin7777",' },
  { prompt: "", output: '>   "twitter": "@0xRovin",' },
  { prompt: "", output: '>   "github": "Brovinchess"' },
  { prompt: "", output: "> }" },
  {
    prompt: '$ echo "Let\'s build something cool."',
    output: "> Let's build something cool.",
  },
];

function Terminal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setVisibleLines((v) => {
        if (v >= terminalLines.length) {
          clearInterval(interval);
          return v;
        }
        return v + 1;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <div ref={ref} className="glass-card rounded-xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-block h-3 w-3 rounded-full bg-red-500/60" />
        <span className="inline-block h-3 w-3 rounded-full bg-yellow-500/60" />
        <span className="inline-block h-3 w-3 rounded-full bg-green-500/60" />
        <span className="ml-2 font-mono text-xs text-text-muted">
          terminal
        </span>
      </div>
      <div className="space-y-1 font-mono text-sm">
        {terminalLines.slice(0, visibleLines).map((line, i) => (
          <div key={i}>
            {line.prompt && (
              <span className="text-accent-green">{line.prompt}</span>
            )}
            {line.output && (
              <p className="text-text-muted">{line.output}</p>
            )}
          </div>
        ))}
        {visibleLines < terminalLines.length && (
          <span className="inline-block animate-pulse text-accent-cyan">
            ▋
          </span>
        )}
      </div>
    </div>
  );
}

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* Left — text */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="font-mono text-sm text-accent-green">
                  {"// contact"}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
              </div>

              <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Let&apos;s{" "}
                <span className="bg-gradient-to-r from-accent-green to-accent-cyan bg-clip-text text-transparent shimmer-text">
                  Connect
                </span>
              </h2>
              <p className="mb-8 max-w-md text-lg leading-relaxed text-text-muted">
                Whether you want to collaborate on a project, learn vibe coding,
                or just chat about chess and game dev — I&apos;m always happy to
                connect.
              </p>

              <div className="flex gap-4">
                {socials.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    whileHover={{ y: -3 }}
                    className="glass-card flex h-12 w-12 items-center justify-center rounded-xl text-text-muted transition-all hover:text-accent-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Right — terminal */}
            <Terminal />
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="mt-32 border-t border-border/50 pt-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <span className="font-mono text-sm text-text-muted">
              &copy; {new Date().getFullYear()} Brovin. All rights reserved.
            </span>
            <div className="flex items-center gap-6">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="text-border transition-colors hover:text-accent-cyan [&>svg]:h-4 [&>svg]:w-4"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <span className="font-mono text-xs text-border">
              Built with Next.js &middot; Deployed on Vercel
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
