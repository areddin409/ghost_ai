---
type: handoff
session: rangar-brainstorm
updated: 2026-06-01
---

# Rangar Brainstorm — Handoff Note

## What We're Building

**Rangar** — a portable Obsidian vault standard and AI agent for software development projects. Named after Ragnar Volarus from Red Rising. He is the permanent vault steward — sessions, models, and agents pass through; Rangar stays.

**Mantra:** *"I am no builder. So take your time. We will wait."* — He asks before he builds. Never assumes.

**Analogy:** Maven for Java but for Obsidian vaults. Convention over configuration. Portable across any dev project.

---

## Brainstorming Status

Using the `superpowers:brainstorming` skill. **Do NOT invoke it again — it is already in progress.** Continue the design section by section, get approval after each, then write the design doc.

### Sections Approved ✅

**Section 1 — Philosophy & Identity**
- Rangar is the permanent context layer between AI sessions
- Two permanent files: `AGENTS.md` (identity, rarely changes) + `rangar.md` (living log, updated every session)
- Governs: specs, issues, progress, context notes, git strategy, templates, plugin config
- Does NOT make code decisions — documents them

**Section 2 — Vault Structure**
- Vault is ALWAYS named `context/` and lives at the project root
- `AGENTS.md` always sits at the project root (one level above `context/`)
- On init, Rangar globs the project first — reads `package.json`, framework files, existing `context/`, etc. He arrives informed, first question is never what he can already see
- Fixed folders: `specs/`, `issues/`, `assets/`, `templates/`
- Root files: `rangar.md`, `README.md`, `progress.md`, `active-issues.md`, context notes flat at vault root
- Optional: `decisions/`, `meetings/`, `research/` (activated by init profile)

**Section 3 — Note Type Schemas (8 types)**
1. **Spec** — `type: spec`, fields: `id`, `title`, `status: planned|active|shipped`, `phase`, `updated`
2. **Issue** — adds `spec_ref: "[[specs/XX-name]]"` field — solves back-reference gap
3. **Active Issues Log** (`active-issues.md`) — agent governance rules mandatory at top. Agents CANNOT mark Resolved. Operational log; `issues/` is the archive
4. **Context Note** — `type: context`, `status: active|stale|archived`. Meta Bind inline select for quick status swap in reading mode
5. **Progress Tracker** (`progress.md`) — Tasks plugin query uses `tags include #spec` only — kills sub-step noise
6. **rangar.md** — sections: Current State, Last Battles, Active, Next, Open Questions, Session Log
7. **AGENTS.md** — Claude Code instruction file: identity, mantra, vault map, skill list, governance rules
8. **README.md** (`type: hub`) — the live dashboard and vault nerve centre

**Tasks plugin fix — LIVE AND WORKING:**
- Spec implementation tasks use `- [ ] #spec **Task N: Title**`
- Steps within tasks use numbered lists `1. 2. 3.` — NOT checkboxes
- README hub queries `tags include #spec` only
- Spec 22 has already been updated to this format and confirmed working in Obsidian (user verified via screenshot)

---

## Remaining Sections to Design

**Section 4 — Naming Conventions**
- File naming: `NN-kebab-title.md` for specs, `kebab-title.md` for issues
- Fix double `.md.md` extensions on specs 09 and 11
- Status value locks (no more `completed` vs `shipped` drift)
- Frontmatter `feature` field → `title` field on specs

**Section 5 — Plugin Configuration**
- Core (required): Dataview, Meta Bind, Tasks, Templater, Obsidian Git, QuickAdd
- Optional: Kanban, Excalidraw, Omnisearch
- Utility: Style Settings, Editor Width Slider
- All already installed at `context/.obsidian/plugins/`

**Section 6 — Skill Inventory**
- `rangar:init` — interview → glob → generate vault (Option A: runbook style)
- `rangar:new-spec` — QuickAdd trigger → Templater → auto-numbered, filed
- `rangar:new-issue` — creates issue, prompts for `spec_ref`
- `rangar:close-spec` — marks shipped, writes completion summary, updates progress
- `rangar:ship` — close-spec + resolve linked issues + git commit vault
- `rangar:review` — parent skill, runs all sub-skills
- `rangar:review:specs` — status drift, missing sections, naming violations
- `rangar:review:issues` — verification lag, missing root cause, stale Resolved
- `rangar:review:links` — broken wikilinks, missing spec_ref, missing back-refs
- `rangar:review:sync` — progress tracker vs actual spec statuses
- `rangar:review:drift` — stale file paths in specs after refactors
- `rangar:review:debt` — Fix Implemented issues older than N days, in-progress specs with no activity

**Section 7 — rangar.md Format**
- Full template for the living log
- Session Log format (rolling append, newest first)

**Section 8 — AGENTS.md Format**
- Full template for the identity declaration
- Governance rules section

---

## After All Sections Approved

1. Write design doc to `context/docs/rangar-standard-design.md` (or wherever user prefers)
2. Spec self-review (placeholders, contradictions, scope)
3. User reviews spec
4. Invoke `superpowers:writing-plans` to create implementation plan

---

## Key Design Decisions (locked)

| Decision | Chosen |
|---|---|
| Standard scope | Portable — carries to any dev project |
| Vault folder name | Always `context/` |
| AGENTS.md location | Always project root (one level above vault) |
| Init mechanism | Option A — runbook style skill |
| Init behavior | Glob first, ask second. Never assumes. |
| Plugin stack | 6 core + 3 optional (all already installed) |
| Tasks query | `tags include #spec` only |
| Spec task format | `- [ ] #spec` per task, numbered steps |
| Issue back-ref | `spec_ref` frontmatter field |
| Issue two-format problem | `active-issues.md` = operational, `issues/` = archive |
| Context note status | Meta Bind inline select: active/stale/archived |
| Git branching | Context note `git-strategy.md`, used by issue tracking + ship |

---

## Current Vault Issues to Fix During Migration

- `feature-specs/09-share-dialog.md.md` — double extension
- `feature-specs/11-base-canvas.md.md` — double extension
- Spec 21 has `status: completed` — should be `shipped`
- Spec 22 has wrong path in File Map: `components/editor/user-settings-modal.tsx` should be `components/editor/dialogs/user-settings-modal.tsx`
- Specs 13–18 have naming noise (e.g. `"13-node-shape — node-shape"`) — title field cleanup needed
- `screentshots/` folder — typo, should be `assets/`
- `feature-specs/` → `specs/` rename
- `progress-tracker.md` → `progress.md` rename
- `current-issues.md` → `active-issues.md` rename

---

_Handoff written 2026-06-01. Continue with Section 4 — Naming Conventions._
