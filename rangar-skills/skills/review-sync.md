---
name: rangar:review:sync
description: Compare spec statuses against task completion state — flags inconsistencies between frontmatter and task checkboxes.
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
