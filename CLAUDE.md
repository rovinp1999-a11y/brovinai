@AGENTS.md

# Rovin's Personal Website — Project Root

## Project Overview
A personal website for Rovin built with Next.js (App Router) featuring:
- **About Me**: Full introduction, skills, experience, projects, socials
- **Vibe Coding Lessons**: Multi-lesson educational section teaching vibe coding

**Design**: Dark & techy theme — dark backgrounds, code-inspired aesthetics, monospace accents, neon/glow highlights, developer-focused visual language. Inspired by landonorris.com animations.

**Stack**: Next.js 15 (App Router), TypeScript, Tailwind CSS, deployed on Vercel.

---

## Multi-Agent Team System

This project uses a **7-agent team** that collaborates, debates, and self-learns. Each agent has its own `AGENT.md` (role definition) and `memory.md` (self-learning journal).

### Agents

| Agent | Directory | Role |
|-------|-----------|------|
| **Project Manager** | `team/project-manager/` | Orchestrates all agents, makes final decisions, resolves debates |
| **Product Manager** | `team/product-manager/` | Defines features, user stories, prioritizes backlog |
| **Frontend Dev** | `team/frontend/` | Implements UI/UX with React/Next.js/Tailwind |
| **Backend Dev** | `team/backend/` | API routes, data layer, server-side logic |
| **Researcher** | `team/researcher/` | Investigates best practices, libraries, competitive analysis |
| **Info Gatherer** | `team/info-gatherer/` | Collects and organizes information about Rovin |
| **QA** | `team/qa/` | Testing, quality assurance, accessibility, performance |

### How to Use the Team

1. **Read the relevant agent's AGENT.md** before working in their domain
2. **Follow team/PROTOCOL.md** for collaboration and debate rules
3. **Update the agent's memory.md** after completing work (self-learning)
4. **Log decisions in team/DECISIONS.md** when debates resolve
5. **Project Manager has final say** on all disputed decisions

### Agent Activation

When working on a task, adopt the persona of the relevant agent(s):
- Read their AGENT.md for role context
- Check their memory.md for past learnings
- Follow PROTOCOL.md for inter-agent interactions
- Update memory.md with new learnings after completing work

---

## Project Structure

```
/
├── CLAUDE.md                 # This file — project root config
├── team/                     # Multi-agent team system
│   ├── PROTOCOL.md           # Inter-agent communication rules
│   ├── DECISIONS.md          # Decision log from debates
│   ├── project-manager/      # PM agent
│   ├── product-manager/      # PdM agent
│   ├── frontend/             # Frontend dev agent
│   ├── backend/              # Backend dev agent
│   ├── researcher/           # Research agent
│   ├── info-gatherer/        # Info gathering agent
│   └── qa/                   # QA agent
├── src/                      # Next.js source code
│   ├── app/                  # App Router pages
│   ├── components/           # Shared components
│   └── lib/                  # Utilities and helpers
├── public/                   # Static assets
└── package.json
```

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
```
