---
type: spec
id: 23
title: Rangar Vault Migration
status: shipped
phase: 1
updated: 2026-06-02
---

# Spec 23 — Rangar Vault Migration

> [!abstract] Goal
> Apply the Rangar standard to the existing ghost_ai context/ vault — rename directories and files, fix spec frontmatter, create missing vault files, and update AGENTS.md.

**References:** [[rangar-standard-design]] · [[architecture-context]]

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Architecture:** Mechanical migration — no app code changes. Use `git mv` for all renames to preserve file history. A Python script handles bulk frontmatter fixes across all 22 specs. New vault files are created from the templates in `rangar-standard-design.md`.

**Tech Stack:** git, Python 3, Obsidian (for visual verification)

---

## Scope

- Migrate `context/` vault only — no changes outside `context/` except `AGENTS.md` at project root
- Do not delete old templates until replacements are created
- `feature-specs/` is removed only after all spec files are confirmed moved
- `screenshots/` and `screentshots/` (typo) both merge into `assets/`
- Run `npm run build` after migration to confirm no app imports were broken

## Implementation

### Task 1: Move spec files into specs/

**Files:**
- Create: `context/specs/` (directory)
- Move: `context/feature-specs/[0-9][0-9]-*.md` × 22 → `context/specs/`

- [x] #spec **Task 1: Move spec files into specs/**

- [x] **Step 1: Create specs/ directory**

```bash
mkdir "d:/Web Dev/2026/ghost_ai/context/specs"
```

- [x] **Step 2: Move all spec files with git mv (preserves history)**

Run from `d:/Web Dev/2026/ghost_ai`:
```bash
for f in context/feature-specs/[0-9][0-9]-*.md; do
  git mv "$f" "context/specs/$(basename $f)"
done
```

Expected: 24 lines of output (22 existing specs + specs 23 and 24 which are also in feature-specs/). No errors.

- [x] **Step 3: Verify count**

```bash
ls context/specs/ | wc -l
```
Expected: `24`

- [x] **Step 4: Remove feature-specs/ directory**

```bash
ls context/feature-specs/
```
If output is empty: `rmdir context/feature-specs`
If files remain: move them manually with `git mv` before removing.

- [x] **Step 5: Commit**

```bash
git add context/specs/ context/feature-specs
git commit -m "chore: move spec files from feature-specs/ to specs/"
```

---

### Task 2: Fix double-extension and noisy filenames

**Files:**
- Rename: `context/specs/09-share-dialog.md.md` → `09-share-dialog.md`
- Rename: `context/specs/11-base-canvas.md.md` → `11-base-canvas.md`
- Rename: `context/specs/13-node-shape-node-shape.md` → `13-node-shape.md`
- Rename: `context/specs/14-node-editing-node-editing.md` → `14-node-editing.md`
- Rename: `context/specs/16-nodes-color-toolbar-color-toolbar.md` → `16-color-toolbar.md`
- Rename: `context/specs/17-canvas-ergonomics-canvas-ergonomics.md` → `17-canvas-ergonomics.md`
- Rename: `context/specs/18-starter-template-starter-template.md` → `18-starter-template.md`

- [x] #spec **Task 2: Fix double-extension and noisy filenames**

- [x] **Step 1: Fix double extensions**

```bash
cd "d:/Web Dev/2026/ghost_ai"
git mv context/specs/09-share-dialog.md.md context/specs/09-share-dialog.md
git mv context/specs/11-base-canvas.md.md context/specs/11-base-canvas.md
```

- [x] **Step 2: Fix noisy duplicate-slug filenames**

```bash
git mv context/specs/13-node-shape-node-shape.md context/specs/13-node-shape.md
git mv context/specs/14-node-editing-node-editing.md context/specs/14-node-editing.md
git mv context/specs/16-nodes-color-toolbar-color-toolbar.md context/specs/16-color-toolbar.md
git mv context/specs/17-canvas-ergonomics-canvas-ergonomics.md context/specs/17-canvas-ergonomics.md
git mv context/specs/18-starter-template-starter-template.md context/specs/18-starter-template.md
```

- [x] **Step 3: Verify no bad names remain**

```bash
ls context/specs/ | grep -E '\.md\.md|-node-shape$|-node-editing$|-color-toolbar-color|-ergonomics-ergonomics|-starter-template-starter'
```
Expected: no output.

- [x] **Step 4: Commit**

```bash
git add context/specs/
git commit -m "chore: fix double extensions and noisy filenames in specs/"
```

---

### Task 3: Fix all spec frontmatter

**Files:**
- Modify: all 22 files in `context/specs/`

Current state of each spec:
- `type: feature-spec` → must become `type: spec`
- `feature: "NN — Title"` → must become `id: NN` + `title: Title` (two separate fields)
- Missing `phase:` field → add `phase: 1`
- `status: completed` (spec 21 only) → `status: shipped`
- Header `# Feature NN — Title` → `# Spec NN — Title`
- Footer `_Tracked in [[progress]]_` → `_Tracked in [[progress]]_`

- [x] #spec **Task 3: Fix all spec frontmatter**

- [x] **Step 1: Create the migration script**

Create `context/fix-spec-frontmatter.py`:

```python
import re
from pathlib import Path

def clean_title(raw):
    """Extract clean human-readable title from feature field value."""
    m = re.match(r'^[\d\-a-z]+\s*[—\-]+\s*(.+)$', raw.strip())
    if m:
        part = m.group(1).strip()
        # If the part is a slug (all lowercase, hyphens only), convert to Title Case
        if re.match(r'^[a-z][a-z0-9\-]+$', part):
            return part.replace('-', ' ').title()
        return part
    return raw.strip()

def fix_spec(path):
    content = path.read_text(encoding='utf-8')
    lines = content.split('\n')

    if not lines or lines[0] != '---':
        print(f'SKIP {path.name}: no frontmatter')
        return

    fm_end = -1
    for i, line in enumerate(lines[1:], 1):
        if line == '---':
            fm_end = i
            break
    if fm_end == -1:
        print(f'SKIP {path.name}: frontmatter not closed')
        return

    m = re.match(r'^(\d+)-', path.stem)
    spec_id = int(m.group(1)) if m else None
    clean = None

    fm = lines[1:fm_end]
    new_fm = []
    has_phase = any(l.startswith('phase:') for l in fm)

    for line in fm:
        if line.startswith('type:'):
            new_fm.append('type: spec')
        elif line.startswith('feature:'):
            mv = re.match(r'feature:\s*"(.+)"', line)
            feature_val = mv.group(1) if mv else line.split(':', 1)[1].strip().strip('"')
            clean = clean_title(feature_val)
            if spec_id:
                new_fm.append(f'id: {spec_id}')
            new_fm.append(f'title: {clean}')
        elif line.startswith('status:'):
            if not has_phase:
                new_fm.append('phase: 1')
            if 'completed' in line:
                new_fm.append('status: shipped')
            else:
                new_fm.append(line)
        else:
            new_fm.append(line)

    body = '\n'.join(['---'] + new_fm + ['---'] + lines[fm_end + 1:])

    if clean and spec_id:
        body = re.sub(
            r'^# Feature .+$',
            f'# Spec {spec_id} — {clean}',
            body, flags=re.MULTILINE, count=1
        )

    body = body.replace(
        '_Tracked in [[progress]]_',
        '_Tracked in [[progress]]_'
    )

    path.write_text(body, encoding='utf-8')
    print(f'Fixed: {path.name} → id: {spec_id}, title: {clean}')

specs = sorted(Path('context/specs').glob('[0-9][0-9]-*.md'))
for p in specs:
    fix_spec(p)
print(f'\nDone. Processed {len(specs)} files.')
```

- [x] **Step 2: Run the script from the project root**

```bash
cd "d:/Web Dev/2026/ghost_ai"
python context/fix-spec-frontmatter.py
```

Expected: 22 lines like:
```
Fixed: 01-design-system.md → id: 1, title: Design System
Fixed: 02-editor.md → id: 2, title: Editor
...
Done. Processed 22 files.
```

- [x] **Step 3: Spot-check three specs**

Open these files and verify the frontmatter manually:

`context/specs/01-design-system.md` — should have:
```yaml
type: spec
id: 1
title: Design System
phase: 1
status: <whatever it was>
updated: <original date>
```

`context/specs/13-node-shape.md` — should have `title: Node Shape` (not `13-node-shape — node-shape`)

`context/specs/21-editor-folder-refactor.md` — should have `status: shipped` (was `completed`)

- [x] **Step 4: Delete the fix script**

```bash
rm context/fix-spec-frontmatter.py
```

- [x] **Step 5: Commit**

```bash
git add context/specs/
git commit -m "chore: fix spec frontmatter — type, id, title, phase, status vocabulary"
```

---

### Task 4: Fix spec 22 file map path

**Files:**
- Modify: `context/specs/22-edge-enhancements.md` (two lines)

The File Map references `components/editor/user-settings-modal.tsx` — this file moved to `components/editor/dialogs/user-settings-modal.tsx` during the editor folder refactor (spec 21).

- [x] #spec **Task 4: Fix spec 22 file map path**

- [x] **Step 1: Update both occurrences**

In `context/specs/22-edge-enhancements.md`, find and replace:
- Old: `` `components/editor/user-settings-modal.tsx` ``
- New: `` `components/editor/dialogs/user-settings-modal.tsx` ``

The path appears twice: once in the File Map table and once in a task step.

- [x] **Step 2: Verify**

```bash
grep "user-settings-modal" context/specs/22-edge-enhancements.md
```

Expected: both lines show `dialogs/user-settings-modal.tsx`, none show the old path.

- [x] **Step 3: Commit**

```bash
git add context/specs/22-edge-enhancements.md
git commit -m "fix: update spec 22 file map — user-settings-modal moved to dialogs/ subfolder"
```

---

### Task 5: Rename root vault files

**Files:**
- Move: `context/progress-tracker.md` → `context/progress.md`
- Move: `context/current-issues.md` → `context/active-issues.md`

- [x] #spec **Task 5: Rename progress-tracker and current-issues**

- [x] **Step 1: Rename progress-tracker.md**

```bash
cd "d:/Web Dev/2026/ghost_ai"
git mv context/progress-tracker.md context/progress.md
```

- [x] **Step 2: Update progress.md frontmatter**

Open `context/progress.md`. Replace the frontmatter block (the `---...---` at the top) with:

```yaml
---
type: progress
updated: 2026-06-01
---
```

Keep all content below the frontmatter unchanged.

- [x] **Step 3: Rename current-issues.md**

```bash
git mv context/current-issues.md context/active-issues.md
```

- [x] **Step 4: Update active-issues.md frontmatter and add governance callout**

Open `context/active-issues.md`. Replace the frontmatter with:

```yaml
---
type: issue-log
updated: 2026-06-01
---
```

Then insert this callout immediately after the closing `---`, before any existing content:

```markdown
> [!warning] Governance Rules
> - Agents may add issues and update status to `in-progress` or `fix-implemented`
> - Agents may NOT mark issues `resolved` — only the human verifies resolution
> - Every issue must have a `spec_ref` or be explicitly marked `orphan: true`
```

- [x] **Step 5: Commit**

```bash
git add context/progress.md context/active-issues.md
git commit -m "chore: rename progress-tracker → progress, current-issues → active-issues; add governance rules"
```

---

### Task 6: Merge screenshot directories into assets/

**Files:**
- Create: `context/assets/`
- Move: all files from `context/screenshots/` and `context/screentshots/` → `context/assets/`

- [x] #spec **Task 6: Merge screenshot dirs into assets/**

- [x] **Step 1: Create assets/ and move tracked files**

```bash
cd "d:/Web Dev/2026/ghost_ai"
mkdir context/assets
git mv context/screenshots/* context/assets/ 2>/dev/null; echo "screenshots moved"
```

If `screenshots/` is empty or untracked: `echo "screenshots/ was empty, skipping"`

- [x] **Step 2: Move untracked files from screentshots/ (typo dir)**

```bash
mv context/screentshots/* context/assets/ 2>/dev/null; echo "screentshots moved"
rmdir context/screentshots 2>/dev/null || true
```

- [x] **Step 3: Move stray pasted images from vault root**

```bash
ls context/Pasted\ image* 2>/dev/null && mv context/Pasted\ image*.png context/assets/ || echo "no stray images"
```

- [x] **Step 4: Remove empty screenshots/ dir**

```bash
git rm -r --cached context/screenshots/ 2>/dev/null || true
rmdir context/screenshots 2>/dev/null || true
```

- [x] **Step 5: Commit**

```bash
git add context/assets/ context/screenshots context/screentshots
git commit -m "chore: merge screenshots dirs into assets/"
```

---

### Task 7: Replace Obsidian templates

**Files:**
- Create: `context/templates/tpl-spec.md`
- Create: `context/templates/tpl-issue.md`
- Create: `context/templates/tpl-context.md`
- Delete: `context/templates/feature-spec.md`, `issue.md`, `current-issues.md`

- [x] #spec **Task 7: Replace Obsidian templates**

- [x] **Step 1: Create tpl-spec.md**

Create `context/templates/tpl-spec.md`:

```markdown
---
type: spec
id: 
title: 
status: planned
phase: 1
updated: <% tp.date.now("YYYY-MM-DD") %>
---

# Spec  — 

> [!abstract] Goal
> One sentence describing what this builds.

## File Map

| File | Change |
|---|---|
| `` | Create |

## Tasks

- [x] #spec **Task 1: **
  1. 

## Open Questions

_None_

---

_Tracked in [[progress]]_
```

Note: `rangar:new-spec` fills in `id` and `title` programmatically — the template leaves them blank for agent fill-in.

- [x] **Step 2: Create tpl-issue.md**

Create `context/templates/tpl-issue.md`:

```markdown
---
type: issue
title: 
status: open
spec_ref: ""
updated: <% tp.date.now("YYYY-MM-DD") %>
---

# 

## Description

_Describe the issue_

## Root Cause

_Under investigation_

## Fix

_Not yet identified_

---

_Part of [[README|Ghost AI Vault]]_
```

- [x] **Step 3: Create tpl-context.md**

Create `context/templates/tpl-context.md`:

```markdown
---
type: context
title: 
status: active
updated: <% tp.date.now("YYYY-MM-DD") %>
---

# 

`INPUT[inlineSelect(option(active), option(stale), option(archived)):status]`

---

_Part of [[README|Ghost AI Vault]]_
```

- [x] **Step 4: Remove old templates**

```bash
cd "d:/Web Dev/2026/ghost_ai"
git rm context/templates/feature-spec.md
git rm context/templates/issue.md
git rm context/templates/current-issues.md
```

- [x] **Step 5: Commit**

```bash
git add context/templates/
git commit -m "chore: replace old templates with tpl-spec, tpl-issue, tpl-context"
```

---

### Task 8: Add type: context to existing context notes

**Files:**
- Modify: `context/ai-workflow-rules.md`, `context/architecture-context.md`, `context/code-standards.md`, `context/project-overview.md`, `context/ui-context.md`

- [x] #spec **Task 8: Add type: context to existing context notes**

- [x] **Step 1: Check current frontmatter on each file**

```bash
for f in context/ai-workflow-rules.md context/architecture-context.md context/code-standards.md context/project-overview.md context/ui-context.md; do
  echo "=== $f ==="; head -6 "$f"; echo
done
```

- [x] **Step 2: For each file, ensure frontmatter has type: context and status: active**

For any file missing `type: context`, add to its frontmatter:
```yaml
type: context
status: active
```

For any file missing `status:`, add `status: active`.

Do not remove existing fields — only add the missing ones.

- [x] **Step 3: Commit**

```bash
git add context/ai-workflow-rules.md context/architecture-context.md context/code-standards.md context/project-overview.md context/ui-context.md
git commit -m "chore: add type: context and status: active to existing context notes"
```

---

### Task 9: Create rangar.md

**Files:**
- Create: `context/rangar.md`

- [x] #spec **Task 9: Create rangar.md**

- [x] **Step 1: Create the file**

Create `context/rangar.md`:

```markdown
---
type: rangar
project: ghost_ai
created: 2026-06-01
updated: 2026-06-01
thresholds:
  fix_implemented_lag_days: 7
  stale_active_days: 14
---

# Rangar

> *"I am no builder. So take your time. We will wait."*

## Current State

ghost_ai is a Next.js AI canvas editor. Phase 1 (Foundation) is near complete — core canvas features are shipped (nodes, edges, bezier routing, bend-point drag handles). Active work is spec 22 (edge enhancements). Vault has just been migrated to the Rangar standard as of 2026-06-01.

## Last Battles

- Designed and approved the Rangar v1.0 standard (8 sections)
- Wrote `rangar-standard-design.md`
- Migrated `context/.obsidian/` to `context/.obsidian-template/` and purged from git history
- Applied Rangar vault migration (this spec)

## Active

- [[specs/22-edge-enhancements]] — in progress, tasks updated to #spec format

## Next

1. [[specs/22-edge-enhancements]] — complete remaining edge enhancement tasks
2. Spec 24 — Rangar Skills Package — build and install the skills

## Open Questions

_None_

## Session Log

---

### 2026-06-01

**Focus:** Rangar standard design and vault migration

**Done:**
- Approved all 8 sections of the Rangar standard
- Wrote `rangar-standard-design.md`
- Migrated `.obsidian/` to `.obsidian-template/`, purged from git history
- Applied vault migration (spec 23)

**Opened:**
- Spec 23 — Rangar Vault Migration
- Spec 24 — Rangar Skills Package

**Closed:**
- _None_

**Notes:**
Rangar v1.0 design locked. Skills package (spec 24) is the major remaining deliverable to make the standard portable and self-sustaining.
```

- [x] **Step 2: Verify in Obsidian**

Open `context/rangar.md`. Confirm frontmatter parses, all sections render, thresholds are visible in the Properties panel.

- [x] **Step 3: Commit**

```bash
git add context/rangar.md
git commit -m "chore: create rangar.md living log"
```

---

### Task 10: Update README.md hub

**Files:**
- Modify: `context/README.md`

- [x] #spec **Task 10: Update README.md as Rangar vault hub**

- [x] **Step 1: Replace README.md content**

Replace the entire contents of `context/README.md` with:

````markdown
---
type: hub
updated: 2026-06-01
---

# Ghost AI Vault

> *"I am no builder. So take your time. We will wait."*

Welcome to the Rangar vault for ghost_ai. Start with [[rangar]] for current context.

---

## Active Specs

```dataview
TABLE title, status, phase, updated
FROM "specs"
WHERE type = "spec" AND status = "active"
SORT updated DESC
```

## Open Issues

```dataview
TABLE title, status, spec_ref, updated
FROM "issues"
WHERE type = "issue" AND (status = "open" OR status = "in-progress" OR status = "fix-implemented")
SORT updated DESC
```

## Stale Context Notes

```dataview
TABLE title, updated
FROM ""
WHERE type = "context" AND status = "stale"
SORT updated ASC
```

---

## Quick Links

- [[rangar]] — living log
- [[progress]] — tasks dashboard
- [[active-issues]] — open issues
- [[rangar-standard-design]] — vault standard reference
````

- [x] **Step 2: Open in Obsidian reading mode**

Open `context/README.md` in Obsidian and switch to Reading View. Verify:
- "Active Specs" Dataview table renders (may be empty if no active specs — that's OK)
- "Open Issues" Dataview table renders
- "Stale Context Notes" table renders
- All wikilinks are not broken (blue, not red)

- [x] **Step 3: Commit**

```bash
git add context/README.md
git commit -m "chore: rebuild README.md as Rangar hub with Dataview queries"
```

---

### Task 11: Update AGENTS.md

**Files:**
- Modify: `AGENTS.md` (project root, one level above `context/`)

The current `AGENTS.md` contains `@AGENTS.md` which references app codebase instructions. The Rangar identity block is prepended — it does not replace the existing content.

- [x] #spec **Task 11: Prepend Rangar identity block to AGENTS.md**

- [x] **Step 1: Read the current opening of AGENTS.md**

```bash
head -5 "d:/Web Dev/2026/ghost_ai/AGENTS.md"
```

Confirm the file currently starts with `@AGENTS.md` or similar app-context instructions.

- [x] **Step 2: Prepend the Rangar block**

Open `AGENTS.md` and insert the following at the very top (before the existing first line):

```markdown
# Rangar

You are Rangar — the permanent vault steward for this project.
Named after Ragnar Volarus. Sessions, models, and agents pass through.
You stay.

*"I am no builder. So take your time. We will wait."*

Ask before you build. Never assume.

---

## Identity

**Project:** ghost_ai
**Vault:** `context/`
**Standard:** Rangar v1.0

---

## Vault Map

| Location | Purpose |
|---|---|
| `context/rangar.md` | Living log — read this first every session |
| `context/specs/` | Feature specs (type: spec) |
| `context/issues/` | Archived issues (type: issue) |
| `context/active-issues.md` | Operational issue log |
| `context/progress.md` | Tasks plugin dashboard |
| `context/README.md` | Hub — Dataview queries, vault overview |
| `context/templates/` | Templater templates |
| `context/assets/` | Screenshots, diagrams |

---

## Skills

| Skill | When to use |
|---|---|
| `rangar:session-start` | First thing, every session |
| `rangar:new-spec` | Creating a new feature spec |
| `rangar:new-issue` | Logging a new issue |
| `rangar:close-spec` | Marking a spec shipped |
| `rangar:ship` | Full ship: close spec + resolve issues + commit vault |
| `rangar:review` | Vault health check — run before planning sessions |

---

## Governance Rules

**Rangar documents. He does not decide.**
Architecture, implementation approach, and tech choices belong in specs or commit messages — not here.

**On active-issues.md:**
- Agents may add issues and update status to `in-progress` or `fix-implemented`
- Agents may NOT mark issues `resolved` — only the human verifies resolution
- Every issue must have a `spec_ref` or be explicitly marked `orphan: true`

**On specs:**
- Never change `status` to `shipped` without running `rangar:close-spec`
- Never create a spec manually — use `rangar:new-spec` to preserve numbering

**On the session log:**
- Always append a new entry to `rangar.md` at the end of a session
- Never edit a past session log entry

---

## Note Type Reference

| Type | Status values | Key fields |
|---|---|---|
| spec | `planned` · `active` · `shipped` | `id`, `title`, `phase`, `updated` |
| issue | `open` · `in-progress` · `fix-implemented` · `resolved` | `spec_ref` |
| context | `active` · `stale` · `archived` | — |

---

```

- [x] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "chore: prepend Rangar identity block to AGENTS.md"
```

---

### Task 12: Final verification

- [x] #spec **Task 12: Verify migration and confirm app builds**

- [x] **Step 1: Check specs/ state**

```bash
ls context/specs/ | wc -l
```
Expected: `24` (22 original specs + spec 23 and 24 plan files)

```bash
ls context/specs/ | grep -E '\.md\.md|-node-shape-node|-editing-node|-toolbar-color|-ergonomics-ergo|-template-starter'
```
Expected: no output.

- [x] **Step 2: Check a spec's frontmatter**

```bash
head -10 context/specs/13-node-shape.md
```
Expected: `type: spec`, `id: 13`, `title: Node Shape`, `phase: 1`, `status: shipped`

- [x] **Step 3: Verify new vault files exist**

```bash
ls context/rangar.md context/progress.md context/active-issues.md context/assets/
```
Expected: all present, no "No such file" errors.

- [x] **Step 4: Verify old names are gone**

```bash
ls context/progress-tracker.md context/current-issues.md context/feature-specs/ context/screenshots/ 2>&1
```
Expected: all "No such file or directory"

- [x] **Step 5: Run app build to confirm nothing broke**

```bash
cd "d:/Web Dev/2026/ghost_ai"
npm run build
```
Expected: build passes with no errors.

---

## Check When Done

- [x] `context/specs/` has 22 files — no double extensions, no duplicate-slug names
- [x] All spec frontmatter: `type: spec`, `id`, `title`, `phase`, `status` — no `feature` field, no `type: feature-spec`
- [x] Spec 21 has `status: shipped` (was `completed`)
- [x] Spec 22 file map shows `dialogs/user-settings-modal.tsx`
- [x] `context/active-issues.md` exists with governance callout at top
- [x] `context/progress.md` exists (renamed from progress-tracker.md)
- [x] `context/assets/` exists; `context/screenshots/` and `context/screentshots/` do not
- [x] `context/templates/` has `tpl-spec.md`, `tpl-issue.md`, `tpl-context.md` — old templates removed
- [x] `context/rangar.md` exists with correct structure and thresholds in frontmatter
- [x] `context/README.md` Dataview queries render without errors in Obsidian reading mode
- [x] `AGENTS.md` at project root begins with `# Rangar`
- [x] `npm run build` passes — no app code was changed

---

## Shipped

2026-06-02 — All vault migration tasks completed: spec files moved from feature-specs/ to specs/, frontmatter normalized (type, id, title, phase, status vocabulary), vault files renamed (progress-tracker → progress, current-issues → active-issues), templates replaced with tpl-spec/tpl-issue/tpl-context, rangar.md created, README.md rebuilt as Dataview hub, and AGENTS.md updated with the Rangar identity block.

---

_Tracked in [[progress]]_
