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
If `status: active` and no line matching `- [ ] #spec` exists in the file body, flag as "active spec with no tasks".

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
