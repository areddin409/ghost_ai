---
name: rangar:ship
description: Full ship workflow — close spec, confirm issue resolution, append session log to rangar.md, commit vault. The only Rangar skill that runs git.
---

# Rangar: Ship

This skill orchestrates the full ship sequence. Run it when implementation is complete and verified.

## Step 1 — Close the spec

Invoke `rangar:close-spec`. Follow its prompts.

## Step 2 — Confirm issue resolution

After close-spec completes, list all issues it moved to `fix-implemented`.
For each one, ask: "Confirm resolution for [[issues/SLUG]]? (y/n)"
- If yes: update the issue's `status` to `resolved` in both the issue file and in `active-issues.md`
- If no: leave at `fix-implemented` for manual verification later

## Step 3 — Append session log

Ask: "Session summary — what did this session accomplish? (bullet points)"

Append to `context/rangar.md` under `## Session Log`, inserting BEFORE the first existing `---` separator (newest first):

```markdown
---

### YYYY-MM-DD

**Focus:** Shipped spec NN — TITLE

**Done:**
- USER_BULLETS

**Opened:**
- _None_

**Closed:**
- Spec NN — TITLE (shipped)
- [list any resolved issues]

**Notes:**
_None_
```

Also:
- Update `rangar.md` frontmatter: set `updated` to today's date
- Update `## Current State` to reflect the ship
- Update `## Last Battles` to list what shipped

## Step 4 — Commit vault

Stage and commit:

```bash
git add context/
git commit -m "vault: ship spec NN — TITLE"
```

Report: "Shipped spec NN — TITLE. Vault committed."
