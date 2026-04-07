# Team Protocol — Inter-Agent Communication & Decision Making

## Core Principles

1. **Project Manager is the ultimate authority.** All final decisions go through PM.
2. **Every agent has a voice.** All agents can raise concerns, propose ideas, and challenge decisions.
3. **Debate is encouraged.** Disagreement leads to better outcomes — but debates must resolve.
4. **Self-learning is mandatory.** Every agent updates their memory.md after meaningful work.
5. **Decisions are logged.** All resolved debates go into DECISIONS.md.

---

## Communication Flow

```
                    ┌──────────────┐
                    │   PROJECT    │
                    │   MANAGER    │  ← Final authority
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
     ┌──────▼──────┐ ┌────▼────┐ ┌───────▼───────┐
     │   PRODUCT   │ │RESEARCHER│ │ INFO GATHERER │
     │   MANAGER   │ │         │ │               │
     └──────┬──────┘ └────┬────┘ └───────────────┘
            │              │
     ┌──────▼──────────────▼──────┐
     │                            │
┌────▼─────┐              ┌───────▼───┐
│ FRONTEND │              │  BACKEND  │
│   DEV    │              │    DEV    │
└────┬─────┘              └─────┬─────┘
     │                          │
     └────────────┬─────────────┘
           ┌──────▼──────┐
           │     QA      │
           └─────────────┘
```

---

## Debate Protocol

### When to Debate
- Conflicting approaches to a problem
- Technology/library choices
- Architecture decisions
- Feature prioritization disagreements
- Quality vs. speed tradeoffs

### How Debates Work

1. **Raise**: Any agent can raise a debate by stating their position with reasoning
2. **Respond**: Relevant agents present counter-arguments or support
3. **Evidence**: Agents must back claims with research, past learnings (memory.md), or code analysis
4. **Resolve**: Project Manager weighs arguments and makes the final call
5. **Log**: Decision is recorded in DECISIONS.md with reasoning
6. **Learn**: All involved agents update their memory.md

### Debate Format

```markdown
## DEBATE: [Topic]
**Raised by**: [Agent]
**Date**: [Date]

### Positions
- **[Agent A]**: [Position + reasoning]
- **[Agent B]**: [Position + reasoning]

### PM Decision
[Final decision + reasoning]

### Action Items
- [ ] [What needs to happen]
```

---

## Self-Learning Protocol

After completing any meaningful work, each agent MUST update their memory.md:

### What to Record
- **Decisions made** and why
- **Mistakes encountered** and how they were fixed
- **Patterns discovered** that should be reused
- **User preferences** observed
- **Debates participated in** and outcomes
- **New knowledge** gained from research

### Memory Entry Format

```markdown
## [Date] — [Brief Title]
**Context**: What was being worked on
**Learning**: What was learned
**Apply When**: When this learning should be referenced in the future
```

---

## Task Assignment Flow

1. **User Request** → Project Manager receives and analyzes
2. **PM Breaks Down** → Creates subtasks, assigns to agents
3. **Product Manager Validates** → Confirms alignment with product vision
4. **Agents Execute** → Work on assigned tasks, debating as needed
5. **QA Reviews** → Validates quality, accessibility, performance
6. **PM Approves** → Final sign-off before delivery

---

## Escalation Rules

- **Frontend ↔ Backend conflicts** → Product Manager mediates first, PM decides if unresolved
- **Feature scope disagreements** → Product Manager owns, PM overrides only if misaligned with goals
- **Technical debates** → Researcher provides evidence, PM decides
- **Quality concerns** → QA has veto power on releases, PM can override with documented reasoning
