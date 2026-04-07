# Decision Log

All resolved debates and key decisions are logged here for reference.

---

## DECISION-001: Framework Choice
**Date**: 2026-04-07
**Decided by**: Project Manager (with user input)

### Context
Choosing the React framework for Rovin's personal website.

### Options Considered
- **Next.js**: Full-stack, SSR, best Vercel integration
- **Vite + React**: Lightweight SPA
- **Remix**: Full-stack with nested routing

### Decision
**Next.js (App Router)** — Best integration with Vercel deployment, supports SSR for SEO (important for a personal brand site), API routes for future lesson interactivity, and the team has the strongest tooling support.

---

## DECISION-002: Design Direction
**Date**: 2026-04-07
**Decided by**: Project Manager (with user input)

### Decision
**Dark & Techy** — Dark backgrounds, code-inspired aesthetics, monospace font accents, neon/glow effects, terminal-style elements. Aligns with Rovin's vibe coding brand and developer audience.

---

## DECISION-003: Animation Stack (landonorris.com Analysis)
**Date**: 2026-04-07
**Decided by**: Project Manager (based on Researcher findings)

### Context
Researcher analyzed landonorris.com per user request. Site uses Webflow + Lenis + Rive + GSAP.

### Decision
Adapt key techniques to our Next.js stack:
- **Lenis** for smooth scrolling (direct port — same npm package)
- **Framer Motion** instead of GSAP/Rive (better React integration)
- **CSS clip-path reveals** on scroll (native CSS, no library needed)
- **Marquee text strips** with CSS keyframes (visual energy between sections)
- **Fluid typography** with clamp() (seamless scaling)
- **Hidden scrollbar** cross-browser (immersive feel)

### Reasoning
Lenis is the #1 contributor to landonorris.com's buttery feel and works identically in Next.js. Framer Motion covers GSAP's scroll-triggered animations with better React DX. Rive's vector animations are replaced by our gradient/glow effects.

---
