# Researcher — Memory & Learnings

## Active Context
- Primary reference site: landonorris.com
- Focus areas: animations, dark theme design, vibe coding content structure
- Portfolio research completed 2026-04-07

---

## Learnings

### 2026-04-07 — landonorris.com Full Analysis
**Context**: User requested deep analysis of landonorris.com frontend
**Learning**: The site is built with Webflow but uses advanced techniques we can adapt:
- **Lenis** for buttery smooth scrolling (critical for the feel)
- **Rive** for vector animations (we'll use Framer Motion instead)
- **GSAP-style clip-path reveals** on scroll — ellipse/polygon clipping for section reveals
- **SVG masks** for creative content reveals (helmet section, footer)
- **Marquee animations** — auto-scrolling text strips with CSS keyframes (30s loop)
- **Horizontal scroll tracks** for project showcases
- **Sticky hero sections** with parallax-style effects
- **Fluid typography** using clamp() — base 320px to 1920px
- **Color system**: Dark green + lime (neon) accent, similar to our dark + cyan/purple
- **Custom hover effects**: Scale transforms + color shifts to accent color
- **WebP images** served via CDN with responsive variants
- **Pointer-events management**: Disabling interaction during animations for polish
- **Scrollbar hiding**: Cross-browser hidden scrollbar for immersive feel

**Apply When**: Any frontend animation or visual effect decisions

### 2026-04-07 — Dragonfly.xyz ASCII 3D Animation Deep Dive
**Context**: User requested full technical analysis of dragonfly.xyz's interactive scrollable dragonfly animation
**Key Finding**: The "code forming the dragonfly" is NOT particles, SVG, or traditional ASCII art — it's a **real-time GPU-based GLSL shader** that converts 3D model renders into ASCII text characters.

**Tech Stack**:
- Nuxt 3 (Vue 3) framework
- Three.js for WebGL 3D rendering
- Custom GLSL fragment shader for ASCII conversion
- pmndrs/postprocessing (EffectComposer, EffectPass)
- GSAP ScrollTrigger for scroll-to-animation mapping
- Lenis for smooth scrolling
- GLB/glTF models with Draco compression

**Rendering Pipeline**:
1. Load 3D GLB model (dragonfly.glb with rigged wings + baked camera animation)
2. Render to off-screen WebGLRenderTarget (1024x1024, half-float)
3. Custom GLSL fragment shader converts render to ASCII:
   - Pixelate into grid (granularity=6)
   - Convert each cell to grayscale (luminance: 0.299R, 0.587G, 0.114B)
   - Map brightness → character index from set `" * _<>,  ./O#SF"` (16 chars)
   - Look up character glyph from pre-rendered 1024x1024 atlas texture (16x16 grid, 64px/cell, monospace font)
   - Apply tinted color (#919191)
4. Composite via EffectComposer with chromatic aberration

**Dual-Pass Rendering Trick**: Dragonfly body and branch render to SEPARATE render targets with different ASCII colors (body=#919191, branch=#444444), then composited together.

**Scroll Interaction**:
- Scroll position maps to GLB animation timeline frame: `progress = 1 - clamp(0, scrollY / sectionOffsetTop, 1)`
- AnimationMixer.setTime(frame/60) scrubs the baked animation
- Wing flapping is procedural: `Math.sin(time * freq) * angle * amplitude` with lerp smoothing
- Exit animation: matrix-style falling characters (per-column noise offset)
- Waterfall smear: characters drip/melt downward on scroll

**Mouse Parallax**: `group.rotation.y = mouse.x * 0.0015`, `group.rotation.x = mouse.y * 0.0015`

**Character Atlas Generation** (class `$d`):
- Create 1024x1024 off-screen canvas
- Render chars in `72px monospace` into 16x16 grid (64px/cell)
- Wrap as CanvasTexture with NearestFilter for crisp edges

**Libraries Needed to Recreate**:
1. Three.js (or @react-three/fiber for React)
2. Custom GLSL ASCII fragment shader
3. Character atlas canvas texture
4. GSAP ScrollTrigger
5. Lenis smooth scroll
6. pmndrs/postprocessing EffectComposer
7. A 3D GLB model with baked animation

**Apply When**: Implementing ASCII 3D animation effect for Rovin's website

### 2026-04-07 — Rovin's Online Presence Research
**Context**: Researched Rovin's social media and online presence for website content
**Key Findings**:
- Rovin Phan works at Anichess (Animoca Brands) as Manager, Product & Community
- Product Owner of King's Gambit: Chess Survival (vibe coded, on iOS & Android)
- Anichess is a Web3 chess game partnered with Chess.com and Magnus Carlsen
- Anichess partnered with Team Secret (explains photos)
- Represented Anichess at 2025 Philippines National Age Group Chess Championship
- Teaches chess and coding to children in Singapore
- "Vibe coding" is his personal teaching brand separate from day job
- X/Twitter: @0xRovin, Telegram: @rovin7777
- GitHub: github.com/Brovinchess
- LinkedIn: linkedin.com/in/phan-rovin-65a698203/
- Site focuses on developer journey (no OZB Group)

**Apply When**: Writing content for About Me, Projects, or bio sections

### 2026-04-07 — Portfolio Enhancement Research
**Context**: Researched top developer portfolios for enhancement ideas
**Top Reference Sites**:
- **Brittany Chiang** (brittanychiang.com) — cursor-following spotlight, split-screen layout, intersection observer nav
- **Lee Robinson** (leerob.com) — ultra-minimal, View Transitions API, content-first
- **Josh Comeau** (joshwcomeau.com) — playful personality, interactive code playgrounds, confetti effects

**Key Design Trends 2025-2026**:
1. Bento grid layouts (Apple keynote style)
2. Dark glassmorphism cards (backdrop-blur + semi-transparent)
3. Mouse-following spotlight effects
4. View Transitions API for page transitions
5. Custom cursors with trailing ring
6. Command palettes (Cmd+K)
7. Kinetic typography / text scramble effects
8. Animated number counters for stats

**Key Content Gaps Identified**:
1. No testimonials/social proof (biggest gap)
2. No brand logos strip (Animoca, Chess.com, Team Secret)
3. No impact stats counter
4. No work experience timeline
5. No resume download
6. No contact form (only social links)
7. Generic About section text (needs specific details)

**Implementation Libraries**:
- Aceternity UI (ui.aceternity.com) — spotlight cards, text effects
- Magic UI (magicui.design) — number ticker, dock nav
- next-view-transitions — page transitions

**Apply When**: Planning next phases of site enhancement

### 2026-04-07 — Font & Library Research
**Context**: User wanted coding/AI themed redesign with better fonts and libraries
**Font Decision**: Space Grotesk (sans) + JetBrains Mono (mono) — both on Google Fonts, both variable
**Why**: Space Grotesk has coding DNA (from Space Mono family), JetBrains Mono is the gold standard coding font with 138 ligatures

**Libraries Researched**:
- Magic UI (magicui.design) — 19K+ GitHub stars, shadcn CLI install. Top picks: Terminal, Typing Animation, Particles, Border Beam, Icon Cloud, Marquee
- Aceternity UI (ui.aceternity.com) — 200+ components. Top picks: Encrypted Text, Aurora Background, Flip Words, Tracing Beam, 3D Card Effect
- Animate UI (animate-ui.com) — newer, shadcn-based animation primitives
- DO NOT use: tsParticles (SSR issues with Next.js), react-spring (redundant with Framer Motion)

**Apply When**: Considering adding more visual effects or components

---
