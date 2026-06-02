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
3. Skip rows where the first column is empty, contains only `—`, or contains only `N/A`
4. For each extracted path, check if the file exists relative to the project root
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
