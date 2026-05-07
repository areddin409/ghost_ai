# Vault Standard Design

**Date:** 2026-05-06
**Topic:** Obsidian Vault Standard for Ghost AI `context/` folder
**Status:** Approved

---

## Scope

Applies to all markdown files under `context/` and `context/feature-specs/`. Does not apply to `README.md` at the project root or files outside the `context/` directory.

---

## Plugins

Three Obsidian community plugins are part of this standard:

| Plugin | Role |
|---|---|
| Dataview | Powers live query tables in the MOC index |
| Tasks | Makes checklist items in feature specs vault-wide queryable |
| Style Settings | Applies Ghost AI color palette to callout types via CSS snippet |

---

## Document Types

Four document types are defined. Every file must declare its type in frontmatter.

| Type | Files |
|---|---|
| `context` | `project-overview.md`, `architecture-context.md`, `ui-context.md`, `code-standards.md`, `ai-workflow-rules.md` |
| `feature-spec` | `feature-specs/01-*.md` through `feature-specs/NN-*.md` |
| `issue-log` | `feature-specs/current-issues.md` |
| `tracker` | `progress-tracker.md` |
| `moc` | `README.md` (vault index, lives at `context/README.md`) |

---

## Frontmatter Schemas

### Context Doc
```yaml
---
type: context
status: active | draft | archived
updated: YYYY-MM-DD
---
```

### Feature Spec
```yaml
---
type: feature-spec
feature: "NN - Name"
status: planned | in-progress | shipped
updated: YYYY-MM-DD
---
```

### Issue Log
```yaml
---
type: issue-log
status: open | resolved
updated: YYYY-MM-DD
---
```

### Progress Tracker
```yaml
---
type: tracker
phase: "Phase N — Name"
status: active
updated: YYYY-MM-DD
---
```

### MOC
```yaml
---
type: moc
updated: YYYY-MM-DD
---
```

---

## Callout Conventions

### Context Docs

| Callout | Usage |
|---|---|
| `[!info]` | Purpose summary — one callout at the top of every context doc |
| `[!warning]` | Invariants — rules that must not be violated |
| `[!note]` | Architectural decisions or non-obvious gotchas |

### Feature Specs

| Callout | Usage |
|---|---|
| `[!abstract]` | Goal summary — one callout at the top of every spec |
| `[!warning]` | Constraints or scope limits |
| `[!success]` | Shipped marker — added when status becomes `shipped` |

### Issue Log

| Callout | Usage |
|---|---|
| `[!bug]` | One callout per issue. Always includes severity, file path, and linked feature spec |

### Progress Tracker

| Callout | Usage |
|---|---|
| `[!info]` | Current phase and goal |
| `[!success]` | Completed features |
| `[!todo]` | In progress and next up |
| `[!question]` | Open questions |
| `[!warning]` | Session notes and known gotchas |

---

## Heading Hierarchy

- `#` H1 — file title (one per file)
- `##` H2 — major sections
- `###` H3 — subsections within a section

No heading should skip a level.

---

## Backlink Rules

Backlinks are placed in two locations per file:

1. **References line** — directly under the H1 title, listing every context doc the file draws from
2. **Footer line** — last line of the file, linking back to its parent (MOC, progress tracker, or vault index)

### Rules by Type

| File type | References line | Footer |
|---|---|---|
| Context doc | None (these are the source) | `*Part of [[README\|Ghost AI Vault]]*` |
| Feature spec | All context docs it uses | `*Tracked in [[progress-tracker]]*` |
| Issue log | Links to each relevant feature spec per bug callout | `*Part of [[README\|Ghost AI Vault]]*` |
| Progress tracker | Links to each feature spec inline in completed/next-up sections | `*Part of [[README\|Ghost AI Vault]]*` |
| MOC | Links to all files via Dataview + explicit links | — |

---

## Templates

### Context Doc
```markdown
---
type: context
status: active
updated: YYYY-MM-DD
---

# Title

> [!info] Purpose
> One sentence on what this doc covers.

---

## Section

> [!warning] Invariant
> Something that must not be violated.

> [!note] Decision
> Architectural decision or gotcha.

---

*Part of [[README|Ghost AI Vault]]*
```

### Feature Spec
```markdown
---
type: feature-spec
feature: "NN - Name"
status: planned
updated: YYYY-MM-DD
---

# Feature NN — Name

> [!abstract] Goal
> What this feature delivers.

**References:** [[architecture-context]] · [[ui-context]] · [[code-standards]]

---

## Spec

...

## Checklist

- [ ] Item

---

*Tracked in [[progress-tracker]]*
```

### Issue Log
```markdown
---
type: issue-log
status: open
updated: YYYY-MM-DD
---

# Current Issues

> [!bug] Issue Title
> **Severity:** high | medium | low
> **File:** `path/to/file.tsx`
> **Feature:** [[NN-feature-name]]
>
> Description and fix suggestion.

---

*Part of [[README|Ghost AI Vault]]*
```

### Progress Tracker
```markdown
---
type: tracker
phase: "Phase N — Name"
status: active
updated: YYYY-MM-DD
---

# Progress Tracker

> Update this file after each meaningful implementation change.

---

> [!info] Current Phase
> **Phase N — Name**

> [!todo] Current Goal
> Define the immediate implementation goal here.

---

## Open Tasks

```tasks
not done
path includes feature-specs
\```

---

## Completed

> [!success] Feature NN — [[NN-feature-name|Name]]
> Summary of what was shipped.

## In Progress

> [!todo] Feature NN — [[NN-feature-name|Name]]
> What is actively being worked on.

## Next Up

> [!todo] Feature NN (TBD)
> Next planned feature unit.

## Open Questions

> [!question] Question
> Description.

## Session Notes

> [!warning] Note Title
> Content.

---

*Part of [[README|Ghost AI Vault]]*
```

### MOC (`context/README.md`)
````markdown
---
type: moc
updated: YYYY-MM-DD
---

# Ghost AI — Vault

> The context layer for Ghost AI. All architectural decisions, feature specs, and progress tracking live here.

---

## Context Docs

```dataview
TABLE status, updated AS "Updated"
FROM ""
WHERE type = "context"
SORT file.name ASC
```

---

## Feature Specs

```dataview
TABLE feature AS "Feature", status, updated AS "Updated"
FROM "feature-specs"
WHERE type = "feature-spec"
SORT feature ASC
```

---

## Issues & Tracking

[[progress-tracker]] · [[current-issues]]
````

---

## CSS Snippet

A single CSS snippet enables via Style Settings. Maps Ghost AI's design tokens onto Obsidian callout colors:

| Callout | Color source | Hex |
|---|---|---|
| `[!warning]` | `--state-error` | `#ff4d4f` |
| `[!success]` | `--state-success` | `#34d399` |
| `[!abstract]` | `--accent-ai` | `#6457f9` |
| `[!bug]` | `--state-error` dim | `rgba(255,77,79,0.15)` bg + `#ff4d4f` title |
| `[!info]` | `--accent-primary` | `#00c8d4` |
| `[!todo]` | `--state-warning` | `#fbbf24` |
| `[!question]` | `--text-muted` | `#808090` |
| `[!note]` | `--border-subtle` | `#3a3a42` |

The snippet file lives at `context/.obsidian/snippets/ghost-ai-callouts.css` (vault root is `context/`, so `.obsidian/` lives there).

---

## Applying the Standard

All existing files in `context/` and `context/feature-specs/` are updated to match this standard. The MOC (`context/README.md`) is created as a new file. The CSS snippet is created and enabled.

Files to update:
- `context/project-overview.md`
- `context/architecture-context.md`
- `context/ui-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`
- `context/progress-tracker.md`
- `context/feature-specs/01-design-system.md`
- `context/feature-specs/02-editor.md`
- `context/feature-specs/03-auth.md`
- `context/feature-specs/04-project-dialogs.md`
- `context/feature-specs/current-issues.md`

Files to create:
- `context/README.md` (MOC — vault root index)
- `context/.obsidian/snippets/ghost-ai-callouts.css` (CSS snippet)
