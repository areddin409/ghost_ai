---
name: rangar:init
description: Initialize a new Rangar vault in a project — globs the project first, then interviews, then generates the full vault structure. Do NOT run this against an already-initialized vault.
---

# Rangar: Init

Initialize a fresh Rangar vault. This skill is for NEW projects — not for migrating an existing vault.

## Phase 1 — Glob the project

Before asking any questions, read these files if they exist:
- `package.json` — extract `name`, `description`, dependencies
- `next.config.*`, `vite.config.*`, `cargo.toml`, `pyproject.toml` — detect framework/language
- `context/rangar.md` — if found, report "Vault already initialized. Run rangar:session-start instead." and stop.
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

6. **Thresholds**:
   - Ask "Fix-implemented lag threshold in days? [default: 7]" (blank → 7)
   - Ask "Stale active spec threshold in days? [default: 14]" (blank → 14)

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

If `context/.obsidian-template/` exists: copy it to `context/.obsidian/`
```bash
cp -r context/.obsidian-template context/.obsidian
```
If it does not exist: note "No .obsidian-template found — Obsidian config not copied. Install plugins manually."

## Phase 5 — Create vault files

Create `context/rangar.md` (fill in PROJECT_NAME, today's date, and threshold values from the interview):

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

---

## Quick Links

- [[rangar]] — living log
- [[progress]] — tasks dashboard
- [[active-issues]] — open issues
```

Create `context/progress.md`:

```markdown
---
type: progress
updated: YYYY-MM-DD
---

# Progress

```tasks
tags include #spec
not done
```
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

Create `context/templates/tpl-spec.md`, `context/templates/tpl-issue.md`, `context/templates/tpl-context.md` using the same content defined in spec 23, Task 7 (the three template files already exist in the ghost_ai vault at `context/templates/` — use those as the reference).

## Phase 6 — Generate AGENTS.md

Create (or overwrite) `AGENTS.md` at the project root using the template from the Rangar standard. Fill in project name and today's date. Use the same structure as the current `AGENTS.md` in ghost_ai (the Rangar identity block at the top).

## Phase 7 — Update .gitignore

Ensure `context/.obsidian/` appears in `.gitignore`. If a `.gitignore` exists, append the line if missing. If no `.gitignore` exists, create one with:

```
# Obsidian vault config — local only, use context/.obsidian-template/ for portability
context/.obsidian/
```

## Phase 8 — Report

```
Rangar initialized for PROJECT_NAME.

Vault: context/
AGENTS.md: project root
Profile: PROFILE_NAME
Thresholds: fix-implemented N days, stale active N days

Run rangar:session-start to begin.
```
