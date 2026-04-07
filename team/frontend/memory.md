# Frontend Developer — Memory & Learnings

## Active Context
- Dark & techy design with neon accents
- landonorris.com is the primary animation/rendering reference
- Next.js App Router with TypeScript and Tailwind CSS
- Implemented: Lenis smooth scroll, Framer Motion animations, clip-path reveals, fluid typography

---

## Learnings

### 2026-04-07 — Design Reference: landonorris.com (Full Analysis)
**Context**: Researcher completed deep analysis of landonorris.com
**Learning**: Key techniques to replicate:
1. **Lenis smooth scroll** — The #1 contributor to the "buttery" feel. Must install.
2. **Clip-path animations** — Use `clip-path: ellipse()` / `polygon()` for scroll-triggered reveals
3. **Marquee text** — CSS keyframe-based auto-scrolling text strips add visual energy
4. **Fluid typography** — `clamp()` for seamless scaling across breakpoints
5. **Hidden scrollbar** — Already in globals.css, but should also add Firefox/IE support
6. **Hover effects** — Scale transforms (1.02-1.05) + accent color shifts + glow shadows
7. **SVG masks** — For creative section transitions (advanced, implement later)
8. **Pointer-events management** — Disable interaction during animations
9. **Sticky sections** — Use position: sticky for immersive scroll experiences
10. **Color transitions** — Smooth transitions between dark sections using gradients

**Quality bar**: landonorris.com feels premium because every interaction has polish. No janky animations. 60fps or don't ship it.
**Apply When**: Implementing any visual effects, animations, or scroll interactions

### 2026-04-07 — Dragonfly.xyz ASCII Shader Implementation Blueprint
**Context**: Researched dragonfly.xyz for recreation on Rovin's site
**Learning**: Complete implementation blueprint for ASCII 3D effect in React/Next.js:

**Architecture Options**:
1. `three` + `@react-three/fiber` + `@react-three/drei` (React-idiomatic)
2. Vanilla Three.js in useEffect (more control, dragonfly.xyz uses this approach)
3. `postprocessing` npm package for EffectComposer pipeline
4. GSAP + ScrollTrigger for scroll-to-animation scrubbing

**The ASCII Shader (core of the effect)**:
- Fragment shader receives 3D render as texture via WebGLRenderTarget
- Pixelates into grid cells based on `uGranularity` uniform
- Grayscale conversion per cell → maps to character index from `" * _<>,  ./O#SF"`
- Character atlas: 1024x1024 canvas, 16x16 grid, `72px monospace`, NearestFilter
- Additional uniforms: uOutProgress (exit anim), uSmear (waterfall), uNoise (flicker)

**Critical Details**:
- Use `MeshNormalMaterial` on 3D model — normals create natural brightness variation
- Render to `WebGLRenderTarget` first, NOT directly to screen
- DPR cap: `Math.min(devicePixelRatio, 2)` desktop, `1` mobile
- WebGL config: `alpha: false, antialias: false, stencil: false, depth: false`
- DOM-GL Sync: CSS `transform: translateY(${scrollY}px)` keeps canvas aligned

**Apply When**: Building the ASCII 3D avatar effect for Rovin's website

### 2026-04-07 — Portfolio Enhancement: Phase 1 Implemented
**Context**: Researched top portfolios (Brittany Chiang, Lee Robinson, Josh Comeau, Awwwards winners) and implemented quick wins
**Implemented**:
1. **Mouse-following spotlight** (`src/components/spotlight.tsx`) — radial gradient follows cursor, inspired by brittanychiang.com
2. **Custom cursor** (`src/components/custom-cursor.tsx`) — dot + trailing ring, morphs on hover over interactive elements
3. **Dark glassmorphism** (`.glass-card` in globals.css) — `backdrop-blur-xl + rgba(255,255,255,0.03) + border-white/0.06`. Applied to all cards site-wide
4. **Animated gradient shimmer** (`.shimmer-text`) — 3s ease-in-out infinite `background-position` animation on gradient text
5. **SVG social icons** — replaced text labels ("gh", "x", "li") with real SVG icons + aria-labels in Contact section
6. **Enhanced noise overlay** — increased from 0.015 to 0.025 opacity
7. **Scanline overlay** — subtle repeating-linear-gradient for extra techy feel
8. **Footer upgrade** — social icons duplicated in footer with nav links

**Still TODO (from research)**:
- View Transitions API (next.config.js `viewTransition: true`)
- Character-by-character text reveal for hero heading
- Magnetic buttons
- Mouse-tracking card spotlight (radial gradient follows cursor within each card)
- Branded preloader animation
- Horizontal scroll gallery
- Command palette (Cmd+K)
- Dark/light mode toggle
- Bento grid About section

**Key Reference Libraries**:
- Aceternity UI (ui.aceternity.com) — spotlight cards, text generate effect
- Magic UI (magicui.design) — number ticker, animated grid, dock nav
- next-view-transitions — page transitions between routes

**Apply When**: Planning next phase of visual enhancements

### 2026-04-07 — Complete Frontend Revamp
**Context**: User wanted entire layout revamped based on portfolio research
**Changes Implemented**:

**New Section Order**: Hero → LogoStrip → About → Stats → Projects → Marquee → Press → Gallery → LessonsPreview → Contact

**Hero** — Split layout: left text (60%) + right profile photo (40%). Photo has decorative offset card behind it + floating "@ Animoca Brands" badge. Tagline is now specific (mentions Product Owner, King's Gambit, Anichess, vibe coding). Social links inline below CTAs. CTAs: "Start Learning" + "View Projects".

**LogoStrip** (NEW) — "Trusted by & Featured in" strip with: Animoca Brands, Chess.com, Anichess, Team Secret, Magnus Carlsen, Startup Kids Club, Pocket Gamer. Text-based logos with dividers.

**About** — Bento grid (6-col). Tiles: Bio terminal (4-col) with prose paragraphs using > prompt, Magnus Carlsen photo (2-col), Tech Stack pills grouped by Frontend/Tools/Platforms (2-col), What I Do with 3 items (2-col), Fun Fact highlight (2-col). Section heading left-aligned.

**Stats** (NEW) — 4 animated counters: 1M+ Anichess Players, 2 Games Shipped, 100+ Kids Taught, 6+ Press Features. Uses useSpring for counting animation.

**Projects** — Full-width alternating rows instead of card grid. Each project: large image on one side, text on the other. Alternates direction. Has prominent CTA buttons + "Available on App Store" / "1M+ players" extras.

**Marquee** — Moved between Projects and Press as a visual breather. Added: KING'S GAMBIT, ANICHESS, CHESS.COM, ANIMOCA BRANDS, PRODUCT OWNER, MOBILE GAMES.

**Press** — Horizontal scroll timeline instead of 3-col grid. Cards are w-80 fixed width, scrollable with gradient fade masks. Timeline line connects all cards. Dates shown prominently.

**Gallery** — Compact auto-scrolling photo strip instead of masonry grid. 5 photos in infinite loop. Minimal heading ("// moments").

**LessonsPreview** — Featured + grid layout. Lesson 01 gets a large 2-col highlighted card with "Start Lesson" CTA. Remaining 3 lessons in compact horizontal cards stacked in right column.

**Contact** — Split layout. Left: heading + description + social SVG icons. Right: animated terminal with typewriter effect showing `$ whoami`, `$ cat contact.json`, commands. Footer has social icons + nav.

**Navbar** — Added "Journey" link, reordered: Home, About, Projects, Journey, Lessons, Contact.

**Apply When**: Understanding current site structure, planning any further changes

### 2026-04-07 — Coding/AI Theme Overhaul
**Context**: User wanted more coding/AI themed design, font change, cursor removal, responsive optimization
**Changes**:
1. **Fonts**: Switched from Geist/Geist Mono → **Space Grotesk + JetBrains Mono**. Space Grotesk has coding DNA (derived from Space Mono). JetBrains Mono has 138 coding ligatures.
2. **Custom cursor removed**: User didn't like it. Reverted to default browser cursor.
3. **Scroll indicator removed**: Removed the scroll hint from hero section.
4. **Profile photo moved**: Removed from hero, added back to gallery strip. Hero is now text-only centered layout.
5. **Hero redesigned**: Terminal-style tag (`$ whoami → developer . creator . instructor`), glitch effect on "Brovin" name, CTA buttons styled as terminal commands (`./start-learning`, `ls ./projects`)
6. **CSS effects added**: Glitch text animation (clip-path + translate), neon border pulse animation
7. **Gallery updated**: Now includes profile.jpg + event-demo.jpg (7 photos total)
8. **Responsive fixes**: Bento grid uses sm:col-span breakpoints, press cards w-72 on mobile, gallery items smaller on mobile, lessons grid md breakpoint, logo strip gap responsive
9. **AI/coding language**: CTAs use terminal syntax, hero uses `$ whoami`, section comments unchanged

**Research findings saved for future use**:
- Magic UI (magicui.design): Terminal, Typing Animation, Particles, Border Beam, Icon Cloud
- Aceternity UI: Encrypted Text, Aurora Background, Flip Words, Tracing Beam
- Libraries NOT to install: tsParticles (SSR issues), react-spring (redundant)

**Apply When**: Making further visual enhancements or considering new libraries

### 2026-04-07 — ASCII 3D Avatar: Full Implementation
**Context**: Built dragonfly.xyz-inspired ASCII shader avatar as fixed full-page background
**Implementation**:

**File structure**: `src/components/ascii-avatar/`
- `charAtlasGenerator.ts` — 1024x1024 canvas, 16x16 grid, charset `" .*_<>, ./0#BRV"` (branded), JetBrains Mono 56px
- `createAvatarScene.ts` — Geometric figure + desk + whiteboard, pose interpolation system
- `asciiRenderPipeline.ts` — GLSL fragment shader with tri-color gradient (cyan→purple→green), CRT scanlines, noise flicker
- `AsciiAvatar.tsx` — Canvas lifecycle, rAF loop, scroll tracking, mouse parallax, mobile skip
- `AsciiBackground.tsx` — Fixed full-page wrapper with dynamic import (ssr: false), opacity-80

**Narrative scroll animation** (pose interpolation system):
- 0.00-0.40: Seated at desk, typing animation (hand oscillation)
- 0.40-0.55: Stand up transition (smoothstep lerp between seated→standing poses)
- 0.55-0.75: Walk to whiteboard (lerp standing→teaching + walk cycle overlay with leg swing, arm counter-swing, bounce)
- 0.75-1.00: Teaching at whiteboard (right arm raised pointing, head nods, gesture animation)

**Camera**: 360° orbit around figure driven by scroll, lookAt target follows figure position, mouse adds parallax offset.

**Shader**: Tri-color gradient (cyan top, purple mid, green bottom), mixed with MeshNormalMaterial colors. Granularity=6, glow on bright chars, CRT scanline darkening, noise flicker.

**Integration**: AsciiBackground fixed at z-0 in page.tsx, all sections in z-10 wrapper. Sections use glass/transparent backgrounds so avatar shows through.

**Apply When**: Modifying the avatar, adjusting animation timing, changing visual effects

---
