---
type: spec
id: 24
title: Rangar Skills Package
status: shipped
phase: 1
updated: 2026-06-02
---

# Spec 24 — Rangar Skills Package

> [!abstract] Goal
> Build and install the 13 Claude Code skills that make the Rangar vault standard self-sustaining — from session start through spec shipping and vault health review.

**References:** [[rangar-standard-design]] · [[23-rangar-vault-migration]]

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Architecture:** Each skill is a markdown file with YAML frontmatter (`name`, `description`) and natural-language instructions for the AI agent. Skills are organized into a `rangar-skills/` package at the project root with a `package.json` for installation. After installation via `npx skills install`, skills are invocable via the `Skill` tool using the `rangar:skill-name` prefix.

**Tech Stack:** Claude Code skills system (`npx skills`), Markdown, YAML

---

## Scope

- 13 skills only — no Obsidian plugin code, no app code
- Skills read from and write to `context/` — they do not touch application source files
- `rangar:init` creates a vault from scratch in a NEW project — it is not run against ghost_ai (use spec 23 for that)
- Skills are tested against the migrated ghost_ai vault (spec 23 must be complete first)

## Implementation

### Task 1: Set up the skills package

**Files:**
- Create: `rangar-skills/` (directory at project root)
- Create: `rangar-skills/package.json`
- Create: `rangar-skills/skills/` (directory)

- [x] #spec **Task 1: Set up the skills package**

- [x] **Step 1: Create package structure**

```bash
mkdir -p "d:/Web Dev/2026/ghost_ai/rangar-skills/skills"
```

- [x] **Step 2: Create package.json**

Create `rangar-skills/package.json`:

```json
{
  "name": "rangar",
  "version": "1.0.0",
  "description": "Rangar vault steward — portable Obsidian vault standard for software development projects",
  "skills": "./skills"
}
```

- [x] **Step 3: Commit**

```bash
git add rangar-skills/
git commit -m "chore: scaffold rangar-skills package"
```

---

### Task 2: rangar:session-start

**Files:**
- Create: `rangar-skills/skills/session-start.md`

- [x] #spec **Task 2: Write rangar:session-start skill**

- [x] **Step 1: Create the skill file**

Create `rangar-skills/skills/session-start.md`:

```markdown
---
name: rangar:session-start
description: Read context/rangar.md and surface current project context — no writes. Run this first at the start of every session.
---

# Rangar: Session Start

Read `context/rangar.md`.

Display the following sections in order, verbatim:
1. **Current State**
2. **Active**
3. **Next** (first 3 items only if longer)
4. **Open Questions** (skip entirely if empty)

Then count lines in `context/active-issues.md` where the row contains `open` or `in-progress` status. Report the count.

End with a one-sentence summary:
> "Rangar ready. N open issues. Active: [comma-separated spec titles from Active section]. Next up: [first item from Next section]."

Do not write to any files.
```

- [x] **Step 2: Commit**

```bash
git add rangar-skills/skills/session-start.md
git commit -m "feat: add rangar:session-start skill"
```

- [x] **Step 3: Install and test**

```bash
npx skills install ./rangar-skills
```

Then in a Claude Code session, invoke: `rangar:session-start`

Expected: the Current State, Active, and Next sections from `context/rangar.md` appear in the response, followed by the open issue count and the one-sentence summary.

---

### Task 3: rangar:new-spec

**Files:**
- Create: `rangar-skills/skills/new-spec.md`

- [x] #spec **Task 3: Write rangar:new-spec skill**

- [x] **Step 1: Create the skill file**

Create `rangar-skills/skills/new-spec.md`:

```markdown
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
   - "Node Shape" → `node-shape`
5. Create `context/specs/NN-slug.md` (using the actual ID and slug):

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

Where `NN` is the zero-padded ID, `TITLE` is the title as entered, and `YYYY-MM-DD` is today's date.

6. Report: "Created `context/specs/NN-slug.md`"
```

- [x] **Step 2: Commit**

```bash
git add rangar-skills/skills/new-spec.md
git commit -m "feat: add rangar:new-spec skill"
```

- [x] **Step 3: Install and test**

```bash
npx skills install ./rangar-skills
```

Invoke `rangar:new-spec`. Enter title "Test Spec" when prompted.

Verify:
- A new file `context/specs/25-test-spec.md` was created (or 24 if that's the next number)
- The file has correct frontmatter with `id`, `title`, `status: planned`, `phase: 1`
- The `#spec` task line is present

Delete the test spec: `git checkout -- context/specs/ && git clean -f context/specs/`

---

### Task 4: rangar:new-issue

**Files:**
- Create: `rangar-skills/skills/new-issue.md`

- [x] #spec **Task 4: Write rangar:new-issue skill**

- [x] **Step 1: Create the skill file**

Create `rangar-skills/skills/new-issue.md`:

```markdown
---
name: rangar:new-issue
description: Create a new issue file and add it to the active-issues log. Prompts for spec reference.
---

# Rangar: New Issue

1. Ask: "Issue title?"
2. Ask: "Spec reference? Enter the spec slug (e.g. `22-edge-enhancements`) or leave blank for an orphan issue."
3. Convert the title to a file slug: lowercase, spaces to hyphens, remove special characters
4. Determine the spec_ref value:
   - If a slug was given: `"[[specs/NN-slug]]"`
   - If blank: omit `spec_ref` and set `orphan: true` in frontmatter
5. Get today's date as YYYY-MM-DD
6. Create `context/issues/SLUG.md`:

```yaml
---
type: issue
title: TITLE
status: open
spec_ref: "[[specs/NN-slug]]"
updated: YYYY-MM-DD
---
```

```markdown
# TITLE

## Description

_Describe the issue_

## Root Cause

_Under investigation_

## Fix

_Not yet identified_

---

_Part of [[README|Ghost AI Vault]]_
```

7. Append to `context/active-issues.md` under the appropriate section (after the governance callout, before any existing entries):

```
| [[issues/SLUG\|TITLE]] | open | [[specs/NN-slug]] | YYYY-MM-DD |
```

If no table exists yet in `active-issues.md`, create one with headers:
```markdown
| Issue | Status | Spec | Updated |
|---|---|---|---|
```

8. Report: "Created `context/issues/SLUG.md` and logged in `active-issues.md`"
```

- [x] **Step 2: Commit**

```bash
git add rangar-skills/skills/new-issue.md
git commit -m "feat: add rangar:new-issue skill"
```

- [x] **Step 3: Install and test**

```bash
npx skills install ./rangar-skills
```

Invoke `rangar:new-issue`. Enter title "Test Issue" and spec reference `22-edge-enhancements`.

Verify:
- `context/issues/test-issue.md` was created with `type: issue`, `status: open`, `spec_ref: "[[specs/22-edge-enhancements]]"`
- `context/active-issues.md` has a new row for the test issue

Clean up: `git checkout -- context/issues/ context/active-issues.md && git clean -f context/issues/`

---

### Task 5: rangar:close-spec

**Files:**
- Create: `rangar-skills/skills/close-spec.md`

- [x] #spec **Task 5: Write rangar:close-spec skill**

- [x] **Step 1: Create the skill file**

Create `rangar-skills/skills/close-spec.md`:

```markdown
---
name: rangar:close-spec
description: Mark a spec as shipped — sets status, writes a completion summary, updates linked issues to fix-implemented.
---

# Rangar: Close Spec

1. Ask: "Which spec? Enter the file slug (e.g. `22-edge-enhancements`)"
2. Read `context/specs/NN-slug.md`
3. Check the current `status` field:
   - If `status: shipped`: report "Spec NN is already shipped." and stop.
   - If `status: planned` or `status: active`: continue.
4. Ask: "One-paragraph completion summary for the spec record?"
5. Update `context/specs/NN-slug.md`:
   - Set `status: shipped`
   - Set `updated` to today's date (YYYY-MM-DD)
   - Append a `## Shipped` section before the footer line (`_Tracked in [[progress]]_`):

```markdown
## Shipped

YYYY-MM-DD — SUMMARY_TEXT
```

6. Scan `context/active-issues.md` for rows whose spec column contains `[[specs/NN-slug]]`.
   For each row with status `open` or `in-progress`:
   - Update the status column to `fix-implemented`
   - Update the `updated` field in the corresponding issue file in `context/issues/`
7. Report: "Closed spec NN — TITLE. Updated N linked issues to fix-implemented."
```

- [x] **Step 2: Commit**

```bash
git add rangar-skills/skills/close-spec.md
git commit -m "feat: add rangar:close-spec skill"
```

- [x] **Step 3: Test with a dry run**

Invoke `rangar:close-spec`. Enter `22-edge-enhancements` when prompted.

Verify the skill correctly reads the spec and reports current status without corrupting the file. (Do not confirm shipping for a real active spec in testing — just verify the skill reads correctly and prompts for a summary.)

---

### Task 6: rangar:ship

**Files:**
- Create: `rangar-skills/skills/ship.md`

- [x] #spec **Task 6: Write rangar:ship skill**

- [x] **Step 1: Create the skill file**

Create `rangar-skills/skills/ship.md`:

```markdown
---
name: rangar:ship
description: Full ship workflow — close spec, resolve linked issues, append session log to rangar.md, commit vault. This is the only Rangar skill that runs git.
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

Also update `rangar.md` frontmatter: set `updated` to today's date.

Update `## Current State` to reflect the ship (remove the spec from Active, note it shipped).
Update `## Last Battles` to list what was shipped.

## Step 4 — Commit vault

Stage all vault files and commit:

```bash
git add context/
git commit -m "vault: ship spec NN — TITLE"
```

Report: "Shipped spec NN — TITLE. Vault committed."
```

- [x] **Step 2: Commit**

```bash
git add rangar-skills/skills/ship.md
git commit -m "feat: add rangar:ship skill"
```

---

### Task 7: rangar:review:specs

**Files:**
- Create: `rangar-skills/skills/review-specs.md`

- [x] #spec **Task 7: Write rangar:review:specs skill**

- [x] **Step 1: Create the skill file**

Create `rangar-skills/skills/review-specs.md`:

```markdown
---
name: rangar:review:specs
description: Check all specs for status drift, naming violations, and missing frontmatter fields.
---

# Rangar: Review — Specs

Read all files in `context/specs/` matching `*.md`. For each file, run these four checks:

**Check 1 — Status vocabulary**
`status` must be exactly one of: `planned`, `active`, `shipped`
Flag any other value (e.g. `completed`, `done`, `finished`).

**Check 2 — Required frontmatter fields**
Every spec must have all of: `type`, `id`, `title`, `status`, `phase`, `updated`
Flag any file missing one or more of these fields.

**Check 3 — Naming convention**
Filename must match the pattern `[0-9][0-9]-[a-z0-9-]+\.md` (no uppercase, no spaces, no double extension).
The numeric prefix in the filename must match the `id` field.
Flag: double extension (`.md.md`), uppercase letters, mismatched id vs filename prefix.

**Check 4 — Active spec with no tasks**
If `status: active` and no line matching `- \[ \] #spec` exists in the file body, flag as "active spec with no tasks".

Report:
```
SPECS REVIEW
============
Checked: N specs

[FILENAME] — [FINDING]
...

✓ No issues found
```

(Print "✓ No issues found" only if all checks pass for all files.)
```

- [x] **Step 2: Commit**

```bash
git add rangar-skills/skills/review-specs.md
git commit -m "feat: add rangar:review:specs skill"
```

- [x] **Step 3: Test**

Invoke `rangar:review:specs`.

Expected after migration (spec 23 complete): all 22 specs pass. If spec 23 is not yet run, expect findings for the pre-migration issues.

---

### Task 8: rangar:review:issues

**Files:**
- Create: `rangar-skills/skills/review-issues.md`

- [x] #spec **Task 8: Write rangar:review:issues skill**

- [x] **Step 1: Create the skill file**

Create `rangar-skills/skills/review-issues.md`:

```markdown
---
name: rangar:review:issues
description: Check active-issues.md for verification lag, missing spec references, and resolved issues not yet archived.
---

# Rangar: Review — Issues

Read `context/rangar.md` frontmatter. Extract threshold values:
- `thresholds.fix_implemented_lag_days` (fall back to `7` if missing)

Read `context/active-issues.md`. For each issue row in the table, run these checks:

**Check 1 — Missing spec_ref**
If the spec column is empty AND the corresponding issue file does not have `orphan: true` in frontmatter, flag: "Missing spec_ref — add spec_ref or set orphan: true"

**Check 2 — Fix-implemented lag**
If status is `fix-implemented` and the `updated` date in the issue file is more than `fix_implemented_lag_days` days before today, flag: "Fix implemented N days ago — verify or escalate"

**Check 3 — Resolved not archived**
If status is `resolved` and the issue is still in `active-issues.md`, flag: "Resolved issue in active log — move to issues/ and remove from active-issues.md"

Report:
```
ISSUES REVIEW
=============
Checked: N issues

[ISSUE] — [FINDING]
...

✓ No issues found
```
```

- [x] **Step 2: Commit**

```bash
git add rangar-skills/skills/review-issues.md
git commit -m "feat: add rangar:review:issues skill"
```

---

### Task 9: rangar:review:links

**Files:**
- Create: `rangar-skills/skills/review-links.md`

- [x] #spec **Task 9: Write rangar:review:links skill**

- [x] **Step 1: Create the skill file**

Create `rangar-skills/skills/review-links.md`:

```markdown
---
name: rangar:review:links
description: Check for broken wikilinks, missing spec_ref fields on issues, and active specs with no linked issues.
---

# Rangar: Review — Links

Run three checks across the vault:

**Check 1 — Broken wikilinks**
Scan all `.md` files in `context/specs/` and `context/issues/` for `[[...]]` wikilinks.
For each link, determine the target file path:
- `[[specs/22-edge-enhancements]]` → `context/specs/22-edge-enhancements.md`
- `[[issues/slug]]` → `context/issues/slug.md`
- `[[rangar]]` → `context/rangar.md`
Check if the target file exists. If not, flag: "[FILE] — broken link: [[TARGET]]"

**Check 2 — Missing spec_ref on issues**
Read all files in `context/issues/` with `type: issue`.
For each file missing a `spec_ref` field AND without `orphan: true`, flag: "[ISSUE FILE] — no spec_ref"

**Check 3 — Active specs with no linked issues**
Read all specs in `context/specs/` with `status: active`.
For each active spec, check whether any file in `context/issues/` has a `spec_ref` pointing to it.
If no issues reference an active spec, flag: "[SPEC] — active with no linked issues"

Report:
```
LINKS REVIEW
============
Checked: N links, M issue files, P active specs

[FILE or SPEC] — [FINDING]
...

✓ No issues found
```
```

- [x] **Step 2: Commit**

```bash
git add rangar-skills/skills/review-links.md
git commit -m "feat: add rangar:review:links skill"
```

---

### Task 10: rangar:review:sync

**Files:**
- Create: `rangar-skills/skills/review-sync.md`

- [x] #spec **Task 10: Write rangar:review:sync skill**

- [x] **Step 1: Create the skill file**

Create `rangar-skills/skills/review-sync.md`:

```markdown
---
name: rangar:review:sync
description: Compare spec statuses in frontmatter against task completion state in progress.md — flags inconsistencies.
---

# Rangar: Review — Sync

For each spec in `context/specs/`:
1. Read the `status` field from frontmatter
2. Count open tasks (`- [ ] #spec`) and closed tasks (`- [x] #spec`) in the file body

Run these checks:

**Check 1 — Shipped spec with open tasks**
If `status: shipped` AND any `- [ ] #spec` lines remain in the file body, flag: "Shipped spec has N open tasks — tasks may need closing"

**Check 2 — Planned spec with closed tasks**
If `status: planned` AND any `- [x] #spec` lines exist, flag: "Planned spec has N closed tasks — status may need updating to active"

**Check 3 — Active spec with all tasks closed**
If `status: active` AND all `#spec` tasks are `- [x]` (none open), flag: "All tasks closed — may be ready to ship (run rangar:close-spec)"

**Check 4 — Active spec with no tasks**
If `status: active` AND no `#spec` task lines exist at all, flag: "Active spec with no tasks — add tasks or check status"

Report:
```
SYNC REVIEW
===========
Checked: N specs

[SPEC FILE] — [FINDING]
...

✓ No issues found
```
```

- [x] **Step 2: Commit**

```bash
git add rangar-skills/skills/review-sync.md
git commit -m "feat: add rangar:review:sync skill"
```

---

### Task 11: rangar:review:drift

**Files:**
- Create: `rangar-skills/skills/review-drift.md`

- [x] #spec **Task 11: Write rangar:review:drift skill**

- [x] **Step 1: Create the skill file**

Create `rangar-skills/skills/review-drift.md`:

```markdown
---
name: rangar:review:drift
description: Check file paths listed in spec File Maps against the actual filesystem — run after refactors to catch stale paths.
---

# Rangar: Review — Drift

For each spec in `context/specs/`:

1. Find the `## File Map` section in the file body
2. Extract all file paths from the table. File paths are in the first column, wrapped in backticks. Example row:
   ```
   | `components/editor/canvas.tsx` | Modify |
   ```
   Extracted path: `components/editor/canvas.tsx`
3. Skip rows where the first column is empty or contains only `—` or `N/A`
4. For each extracted path, check if the file exists relative to the project root (`d:/Web Dev/2026/ghost_ai/` or equivalent)
5. If the file does not exist: flag "[SPEC] — [PATH] not found"

Skip specs where `## File Map` section is absent or the table has no data rows.

Report:
```
DRIFT REVIEW
============
Checked: N paths across M specs

[SPEC] — [PATH] not found
...

✓ No drift detected
```
```

- [x] **Step 2: Commit**

```bash
git add rangar-skills/skills/review-drift.md
git commit -m "feat: add rangar:review:drift skill"
```

---

### Task 12: rangar:review:debt

**Files:**
- Create: `rangar-skills/skills/review-debt.md`

- [x] #spec **Task 12: Write rangar:review:debt skill**

- [x] **Step 1: Create the skill file**

Create `rangar-skills/skills/review-debt.md`:

```markdown
---
name: rangar:review:debt
description: Surface accumulated vault maintenance debt — stale issues, inactive specs, and orphan issues.
---

# Rangar: Review — Debt

Read threshold values from `context/rangar.md` frontmatter:
- `thresholds.fix_implemented_lag_days` (default: `7` if missing)
- `thresholds.stale_active_days` (default: `14` if missing)

Get today's date. Run three checks:

**Check 1 — Fix-implemented lag**
Read `context/active-issues.md`. For each issue with `status: fix-implemented`:
- Read the issue file's `updated` date
- Calculate days since `updated`
- If days > `fix_implemented_lag_days`: flag "[ISSUE] — fix implemented N days ago, no verification"

**Check 2 — Stale active specs**
Read all specs in `context/specs/` with `status: active`:
- Calculate days since the `updated` date
- If days > `stale_active_days`: flag "[SPEC] — no activity in N days"

**Check 3 — Orphan issues**
Read all files in `context/issues/` with `type: issue`:
- If no `spec_ref` field AND no `orphan: true`: flag "[ISSUE] — no spec_ref, not marked orphan"

Report:
```
DEBT REVIEW
===========
Fix-implemented lag (threshold: N days): X issues
Stale active specs (threshold: N days): Y specs
Orphan issues: Z issues

[CATEGORY] [ITEM] — [FINDING]
...

✓ No debt found
```
```

- [x] **Step 2: Commit**

```bash
git add rangar-skills/skills/review-debt.md
git commit -m "feat: add rangar:review:debt skill"
```

---

### Task 13: rangar:review (parent)

**Files:**
- Create: `rangar-skills/skills/review.md`

- [x] #spec **Task 13: Write rangar:review parent skill**

- [x] **Step 1: Create the skill file**

Create `rangar-skills/skills/review.md`:

```markdown
---
name: rangar:review
description: Full vault health check — runs all six review sub-skills and presents a single consolidated report. Run before planning sessions.
---

# Rangar: Review

Run the full vault health check. Invoke each sub-skill in order and collect their output.

Run in this order:
1. `rangar:review:specs`
2. `rangar:review:issues`
3. `rangar:review:links`
4. `rangar:review:sync`
5. `rangar:review:drift`
6. `rangar:review:debt`

After all six complete, present the consolidated report:

```
RANGAR VAULT REVIEW
===================
Date: YYYY-MM-DD
Vault: context/

── SPECS ──────────────────────────────
[paste rangar:review:specs output]

── ISSUES ─────────────────────────────
[paste rangar:review:issues output]

── LINKS ──────────────────────────────
[paste rangar:review:links output]

── SYNC ───────────────────────────────
[paste rangar:review:sync output]

── DRIFT ──────────────────────────────
[paste rangar:review:drift output]

── DEBT ───────────────────────────────
[paste rangar:review:debt output]

═══════════════════════════════════════
SUMMARY
Total findings: N
Clean categories: [list categories with ✓]
Needs attention: [list categories with findings]
```

Do not fix anything. Present findings only. The human decides what to act on.
```

- [x] **Step 2: Commit**

```bash
git add rangar-skills/skills/review.md
git commit -m "feat: add rangar:review parent skill"
```

---

### Task 14: rangar:init

**Files:**
- Create: `rangar-skills/skills/init.md`

- [x] #spec **Task 14: Write rangar:init skill**

- [x] **Step 1: Create the skill file**

Create `rangar-skills/skills/init.md`:

```markdown
---
name: rangar:init
description: Initialize a new Rangar vault in a project — globs the project first, then interviews, then generates the full vault structure. Do NOT run this against ghost_ai (use spec 23 instead).
---

# Rangar: Init

Initialize a fresh Rangar vault. This skill is for NEW projects — not for migrating an existing vault.

## Phase 1 — Glob the project

Before asking any questions, read these files if they exist:
- `package.json` — extract `name`, `description`, dependencies
- `next.config.*`, `vite.config.*`, `cargo.toml`, `pyproject.toml` — detect framework/language
- `context/rangar.md` — if found, report "Vault already initialized. Run rangar:session-start instead." and stop
- `.git/config` — extract remote URL

From this, determine: project name, tech stack summary, whether a remote exists.

## Phase 2 — Interview

Ask only questions that cannot be answered from the project files.

1. **Project name**: If found in `package.json`, confirm: "Project name: [NAME] — correct? (y/n)". If not found: ask "Project name?"

2. **Description**: Ask "One-line project description?"

3. **Init profile**: Ask "Init profile — (1) minimal: core plugins only, or (2) full: all plugins? [default: 1]"
   - `1` or blank → `minimal`
   - `2` → `full`

4. **Git remote**: If remote found: "GitHub remote detected: [URL]. Configure Obsidian Git with this remote? [y/n]"
   If not found: "No remote detected. Skip Obsidian Git remote config? [y/n]"

5. **Phases**: Ask "Phase names? Comma-separated, or leave blank for no phases. [e.g. Alpha, Beta, Release]"

6. **Thresholds**: Ask "Fix-implemented lag threshold in days? [default: 7]" (blank → 7)
   Ask "Stale active spec threshold in days? [default: 14]" (blank → 14)

## Phase 3 — Generate vault structure

Create these directories if they do not exist:
```
context/
context/specs/
context/issues/
context/assets/
context/templates/
```

If profile is `full`, also create:
```
context/decisions/
context/research/
```

## Phase 4 — Copy .obsidian-template

If `context/.obsidian-template/` exists in the project: copy it to `context/.obsidian/`
```bash
cp -r context/.obsidian-template context/.obsidian
```

If it does not exist: note "No .obsidian-template found — Obsidian config not copied. Install plugins manually."

## Phase 5 — Create vault files

Create `context/rangar.md` with this structure (fill in project name, today's date, thresholds from interview):

```yaml
---
type: rangar
project: PROJECT_NAME
created: YYYY-MM-DD
updated: YYYY-MM-DD
thresholds:
  fix_implemented_lag_days: N
  stale_active_days: N
---
```

```markdown
# Rangar

> *"I am no builder. So take your time. We will wait."*

## Current State

PROJECT_NAME initialized with Rangar v1.0 on YYYY-MM-DD. Vault is empty — ready for first spec.

## Last Battles

- Initialized Rangar vault

## Active

_None yet_

## Next

1. Create the first spec with `rangar:new-spec`

## Open Questions

_None_

## Session Log

---

### YYYY-MM-DD

**Focus:** Vault initialization

**Done:**
- Initialized Rangar v1.0 vault

**Opened:**
- _None_

**Closed:**
- _None_

**Notes:**
Tech stack: TECH_STACK_SUMMARY
```

Create `context/README.md`:

```markdown
---
type: hub
updated: YYYY-MM-DD
---

# PROJECT_NAME Vault

> *"I am no builder. So take your time. We will wait."*

Welcome to the Rangar vault for PROJECT_NAME. Start with [[rangar]] for current context.

---

## Active Specs

\```dataview
TABLE title, status, phase, updated
FROM "specs"
WHERE type = "spec" AND status = "active"
SORT updated DESC
\```

## Open Issues

\```dataview
TABLE title, status, spec_ref, updated
FROM "issues"
WHERE type = "issue" AND (status = "open" OR status = "in-progress" OR status = "fix-implemented")
SORT updated DESC
\```

---

## Quick Links

- [[rangar]] — living log
- [[progress]] — tasks dashboard
- [[active-issues]] — open issues
```

(Remove the backslashes before the triple backticks in the actual file.)

Create `context/progress.md`:

```markdown
---
type: progress
updated: YYYY-MM-DD
---

# Progress

\```tasks
tags include #spec
not done
\```
```

Create `context/active-issues.md`:

```markdown
---
type: issue-log
updated: YYYY-MM-DD
---

> [!warning] Governance Rules
> - Agents may add issues and update status to `in-progress` or `fix-implemented`
> - Agents may NOT mark issues `resolved` — only the human verifies resolution
> - Every issue must have a `spec_ref` or be explicitly marked `orphan: true`

| Issue | Status | Spec | Updated |
|---|---|---|---|
```

Create `context/templates/tpl-spec.md`, `context/templates/tpl-issue.md`, `context/templates/tpl-context.md` — use the same content as in spec 23, Task 7.

## Phase 6 — Generate AGENTS.md

Create (or overwrite) `AGENTS.md` at the project root using the template from Section 8 of `rangar-standard-design.md`. Fill in project name and today's date.

## Phase 7 — Update .gitignore

Ensure `context/.obsidian/` appears in `.gitignore`. If a `.gitignore` exists, append the line if missing. If no `.gitignore` exists, create one with this content:

```
# Obsidian vault config — local only, use context/.obsidian-template/ for portability
context/.obsidian/
```

## Phase 8 — Report

Report:
```
Rangar initialized for PROJECT_NAME.

Vault: context/
AGENTS.md: project root
Profile: PROFILE_NAME
Thresholds: fix-implemented N days, stale active N days

Run rangar:session-start to begin.
```
```

- [x] **Step 2: Commit**

```bash
git add rangar-skills/skills/init.md
git commit -m "feat: add rangar:init skill"
```

---

### Task 15: Install and run full validation

**Files:**
- No new files — installation and testing only

- [x] #spec **Task 15: Install skills and validate end-to-end**

- [x] **Step 1: Install the skills package**

```bash
cd "d:/Web Dev/2026/ghost_ai"
npx skills install ./rangar-skills
```

Expected: skills install without errors. All 13 skills (`rangar:session-start`, `rangar:new-spec`, `rangar:new-issue`, `rangar:close-spec`, `rangar:ship`, `rangar:review`, `rangar:review:specs`, `rangar:review:issues`, `rangar:review:links`, `rangar:review:sync`, `rangar:review:drift`, `rangar:review:debt`, `rangar:init`) appear in the skills list.

- [x] **Step 2: Test rangar:session-start**

Invoke `rangar:session-start`.

Expected: Current State and Active sections from `context/rangar.md` are displayed. Open issue count is reported. One-sentence summary at the end.

- [x] **Step 3: Test rangar:new-spec (and clean up)**

Invoke `rangar:new-spec`. Enter "Validation Test Spec" when prompted.

Verify: `context/specs/25-validation-test-spec.md` (or next available number) was created with correct frontmatter.

Clean up:
```bash
rm "context/specs/25-validation-test-spec.md"
```

- [x] **Step 4: Run rangar:review**

Invoke `rangar:review`.

Expected: consolidated report from all 6 sub-skills. With spec 23 complete, findings should be minimal. Review any findings and note whether they are expected or actual issues.

- [x] **Step 5: Commit skills-lock.json if generated**

```bash
git status
```

If `skills-lock.json` was updated by the install: `git add skills-lock.json && git commit -m "chore: update skills-lock after rangar skills install"`

---

## Check When Done

- [x] `rangar-skills/skills/` contains exactly 13 skill files: `session-start.md`, `new-spec.md`, `new-issue.md`, `close-spec.md`, `ship.md`, `review.md`, `review-specs.md`, `review-issues.md`, `review-links.md`, `review-sync.md`, `review-drift.md`, `review-debt.md`, `init.md`
- [x] All 13 skills are installed and visible in the skills list
- [x] `rangar:session-start` reads `rangar.md` and reports correctly
- [x] `rangar:new-spec` creates a correctly numbered, correctly formatted spec file
- [x] `rangar:new-issue` creates an issue file and adds a row to `active-issues.md`
- [x] `rangar:review` runs all 6 sub-skills and produces a consolidated report
- [x] `rangar:review:drift` correctly flags `components/editor/user-settings-modal.tsx` in spec 22 if it wasn't fixed by spec 23 (it should be clean after spec 23)
- [x] `rangar:init` skill file exists and its Phase 1 glob logic is correct (review the file manually)

---

## Shipped

2026-06-02 — All 13 Rangar skills created and installed: session-start, new-spec, new-issue, close-spec, ship, review (parent), review:specs, review:issues, review:links, review:sync, review:drift, review:debt, and init. Skills reorganized into SKILL.md subdirectory structure per skills CLI convention and installed via the superpowers plugin.

---

_Tracked in [[progress]]_
