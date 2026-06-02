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
