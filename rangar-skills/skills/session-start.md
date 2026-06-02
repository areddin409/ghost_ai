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
