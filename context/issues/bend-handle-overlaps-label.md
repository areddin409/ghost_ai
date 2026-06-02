---
type: issue
title: Bend Handle Overlaps "Add label…" Prompt
status: Open
priority: Medium
opened: 2026-06-01
updated: 2026-06-01
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

---

> [!note]- Investigation
>
> ### Checklist
>
> - [ ] Decide on fix: offset the handle slightly (e.g. +20px vertically), or suppress the label text when `selected`, or move the handle to an alternative midpoint position
> - [ ] Ensure fix works for all four routing types
> - [ ] Ensure "Add label…" remains reachable for double-click label editing when edge is selected

> [!info]- Verification Log
>
> | Date | By  | Result  | Evidence |
> | ---- | --- | ------- | -------- |
> | —    | —   | Pending | —        |

---

_Part of [[README|Ghost AI Vault]] | [[issues-moc]]_
