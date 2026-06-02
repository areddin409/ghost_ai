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
