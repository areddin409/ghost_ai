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
