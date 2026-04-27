# BloomKid Agentic Software Team

8 agents · 8 slash commands · Claude Code  
Skills live in `~/.claude/skills/` (global) so they work as slash commands in any session.

---

## The Pipeline

```
/analyst  →  /ba  →  /pm  →  /techlead (ADR review)
                                      ↓
                               /developer (TDD)
                                      ↓
                               /tester (coverage gate)
                           ⛔ HARD BLOCK if < 80%
                                      ↓
                               /doc-sync
                                      ↓
                               /merge-pr → develop
```

Each agent **saves its output to `docs/specs/`** so the next agent can read it as memory.

---

## Memory Files (docs/specs/)

Each agent writes a file when it finishes. The next agent reads it automatically.

```
docs/specs/
├── YYYY-MM-DD-analyst-<feature>.md   ← /analyst output → /ba reads this
├── YYYY-MM-DD-ba-<feature>.md        ← /ba output      → /pm reads this
├── YYYY-MM-DD-pm-<feature>.md        ← /pm output      → /techlead reads this
└── YYYY-MM-DD-techlead-adr-NNN.md    ← saved to docs/decisions/ too
```

Sprint plans also go to `docs/superpowers/plans/YYYY-MM-DD-<feature>.md`.

---

## Agent Reference

| Command | Role | Reads | Writes |
|---|---|---|---|
| `/analyst` | Clarify requirements, spot compliance issues | raw idea | `docs/specs/YYYY-MM-DD-analyst-<feature>.md` |
| `/ba` | User stories with Given/When/Then + MoSCoW | analyst spec file | `docs/specs/YYYY-MM-DD-ba-<feature>.md` |
| `/pm` | Sprint tasks with file targets + estimates | BA spec file | `docs/specs/YYYY-MM-DD-pm-<feature>.md` |
| `/techlead` | ADR decisions (pre-build) or code review (post-build) | PM plan / git diff | `docs/decisions/NNN-<title>.md` |
| `/developer` | TDD implementation, one commit per cycle | PM task | code + tests |
| `/tester` | 80% coverage gate — hard blocks if failing | git diff + coverage | Pass ✅ or Block ⛔ |
| `/doc-sync` | Update all `CLAUDE.md` files and docs | git diff | doc commit |
| `/merge-pr` | Pre-merge checklist + squash merge to develop | CI + coverage + review | merged PR |

---

## Instructions for Use

### Starting a new feature
```
/analyst  <raw feature idea>
```
The analyst produces a spec and saves it to `docs/specs/`.

### Following the chain
```
/analyst   → types the feature idea
/ba        → no args needed (reads latest analyst file automatically)
/pm        → no args needed (reads latest BA file automatically)
/techlead  → no args needed in ADR mode (reads latest PM file)
/developer → paste one task at a time from the PM plan
/tester    → no args needed
/doc-sync  → no args needed
/merge-pr  → no args needed
```

### Passing context manually
If you want to target a specific file:
```
/ba   docs/specs/2026-04-27-analyst-phase1.md
/pm   docs/specs/2026-04-27-ba-flashcards.md
```

---

## Coverage Targets by Area

| Path | Minimum |
|---|---|
| `apps/backend/src/modules/**/*.service.ts` | 80% |
| `apps/mobile/src/screens/**` | 70% |
| `packages/shared/**` | 90% |
| `packages/ai-pipeline/src/**` | 75% |

---

## Compliance Rules Enforced by the Team

- No child PII stored (progress tracked by anonymous session ID)
- Parental gate required before any parent-facing screen
- No 3rd-party SDKs without compliance review (`/techlead` checks)
- Touch targets ≥ 44×44 pt on all child-facing screens
- AI-generated assets served from S3 URLs — never bundled in the app
- No hardcoded secrets in committed files (`/merge-pr` scans for this)

---

## Skill File Locations

```
~/.claude/skills/          ← global skills (user-invokable slash commands)
├── analyst/SKILL.md       → /analyst
├── ba/SKILL.md            → /ba
├── pm/SKILL.md            → /pm
├── techlead/SKILL.md      → /techlead
├── developer/SKILL.md     → /developer
├── tester/SKILL.md        → /tester
├── doc-sync/SKILL.md      → /doc-sync
└── merge-pr/SKILL.md      → /merge-pr

.claude/skills/            ← project skills (Claude reads internally)
├── code-review/SKILL.md
└── generate-content/SKILL.md
```

To edit an agent's behavior, update `~/.claude/skills/<name>/SKILL.md`.
Changes take effect in the next Claude Code session.
