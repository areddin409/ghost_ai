---
type: issue
title: Bend Handle Overlaps "Add label…" Prompt
status: Resolved
priority: Medium
opened: 2026-06-01
updated: 2026-06-02
description: When an edge is selected but has no bend point yet, the cyan midpoint handle circle renders at the same (labelX, labelY) coordinates as the "Add label…" prompt, causing them to visually overlap.
verified_result: Pending
verified_date: ""
verified_evidence: ""
---

> [!bug] Bend Handle Overlaps "Add label…" Prompt
> **Status:** `INPUT[inlineSelect(option(Open), option(In Progress), option(Fix Implemented), option(Resolved)):status]` · **Priority:** `INPUT[inlineSelect(option(Low), option(Medium), option(High), option(Critical)):priority]`
>
> Opened **2026-06-01** · Updated `INPUT[date:updated]`
>
> **Result:** `INPUT[inlineSelect(option(Pending), option(Pass), option(Fail)):verified_result]` · **Date:** `INPUT[date:verified_date]` · **Evidence:** `INPUT[text:verified_evidence]`

**Description:** When an edge is selected and no `bendPoint` has been set, the cyan handle circle is positioned at `(labelX, labelY)` — the exact same coordinates used by the `<EdgeLabelRenderer>` to place the "Add label…" / label text. The circle and label div sit on top of each other, making the "Add label…" text unreadable and the handle hard to target precisely.

Once a `bendPoint` is stored the handle moves to `(bendPoint.x, bendPoint.y)` and the conflict disappears. The overlap only exists in the default (no-bend) state.

**Root Cause (suspected):** `resolvePath` returns `(labelX, labelY)` from the path helper, and `CanvasEdgeRenderer` uses that same pair for both the label position and the no-bend handle position. The two renderers share coordinates but render in the same visual space.

**Reproduction:** Select any edge that has no stored `bendPoint`. The cyan circle appears directly on top of "Add label…".

![[Pasted image 20260601230026.png]]

![[Pasted image 20260601230119.png]]

---

> [!note]- Investigation
>
> ### Checklist
>
> - [x] Decide on fix: offset the handle slightly (e.g. +20px vertically), or suppress the label text when `selected`, or move the handle to an alternative midpoint position
> - [x] Ensure fix works for all four routing types
> - [x] Ensure "Add label…" remains reachable for double-click label editing when edge is selected
>
> **Root Cause (confirmed):** `CanvasEdgeRenderer` shows "Add label…" when `isActive` (`hovered || selected`). When the edge is selected the bend handle circle is also rendered at `(labelX, labelY)`. Both elements occupy the same screen position, making "Add label…" unreadable and the handle hard to target.
>
> **Fix Applied:** Changed the "Add label…" condition from `isActive` to `hovered && !selected`. When the edge is selected the hint is hidden and the bend handle is unobstructed. Label editing is still accessible via double-click on the edge hit-area path (`onDoubleClick` → `openEditor`), which works for all four routing types.

> [!info]- Verification Log
>
> | Date | By  | Result  | Evidence |
> | ---- | --- | ------- | -------- |
> | 2026-06-02 | dev | Resolved | Bend handle feature removed — overlap cannot recur. |

---

_Part of [[README|Ghost AI Vault]] | [[issues-moc]]_
