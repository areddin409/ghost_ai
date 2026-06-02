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

6. Report: "Created `context/specs/NN-slug.md`"
