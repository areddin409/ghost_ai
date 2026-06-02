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
