---
name: rangar:new-spec
description: Create a new feature spec with auto-assigned ID. Always use this instead of creating spec files manually — it ensures sequential numbering.
---

# Rangar: New Spec

1. List all files in `context/specs/` matching `[0-9][0-9]-*.md`
2. Extract the numeric prefix from each filename. Find the highest value. Increment by 1. Zero-pad to 2 digits.
   - If no files exist: start at `01`
   - Example: highest filename is `22-edge-enhancements.md` → new ID is `23`, padded prefix is `23`
3. Ask the user: "Spec title?"
4. Convert the title to a file slug: lowercase, spaces to hyphens, remove special characters
   - "Edge Enhancements" → `edge-enhancements`
5. Create `context/specs/NN-slug.md` with this content (fill in NN, TITLE, SLUG, and today's date):

```yaml
---
type: spec
id: NN
title: TITLE
status: planned
phase: 1
updated: YYYY-MM-DD
---
```

```markdown
# Spec NN — TITLE

> [!abstract] Goal
> One sentence describing what this builds.

## File Map

| File | Change |
|---|---|
| `` | Create |

## Tasks

- [ ] #spec **Task 1: **
  1. 

## Open Questions

_None_

---

_Tracked in [[progress]]_
```

6. Create a feature branch for this spec:
   ```bash
   git checkout -b spec/NN-slug
   ```
   Branch naming: `spec/` prefix + the same slug used for the filename.

7. Report:
   ```text
   Created context/specs/NN-slug.md
   Branch: spec/NN-slug
   ```

---

## Development Standards

Once a spec branch exists, follow these rules for the entire development session:

**Git workflow**
- All implementation work happens on `spec/NN-slug` — never commit spec work directly to `main`
- No intermediate commits during active development — commit only at meaningful, working checkpoints (or at completion)
- No code review until implementation is complete and the branch is ready to merge

**Skill sequence for implementation**
Use the following superpowers skills in order as work progresses:

| When | Skill |
|---|---|
| Before planning implementation | `superpowers:writing-plans` |
| Before any creative/feature design work | `superpowers:brainstorming` |
| While executing an existing plan | `superpowers:subagent-driven-development` or `superpowers:executing-plans` |
| When hitting a bug or unexpected behavior | `superpowers:systematic-debugging` |
| Before marking any task done | `superpowers:verification-before-completion` |
| When implementation is complete | `superpowers:finishing-a-development-branch` |
| After finishing-a-development-branch | `superpowers:requesting-code-review` |
| When review feedback arrives | `superpowers:receiving-code-review` |

**Other available skills (invoke when relevant)**
- `superpowers:test-driven-development` — when writing tests
- `superpowers:dispatching-parallel-agents` — when multiple independent tasks can run in parallel
- `superpowers:using-git-worktrees` — when isolating parallel work in separate worktrees
