---
type: issue
title: Edge Path Deforms Wildly After First Bend Handle Drag
status: Open
priority: High
opened: 2026-06-01
updated: 2026-06-01
description: After dragging the midpoint bend handle, the edge path forms an extreme, unintended shape far from where the user dragged — instead of a gentle curve through the dragged point.
verified_result: Pending
verified_date: ""
verified_evidence: ""
---

> [!bug] Edge Path Deforms Wildly After First Bend Handle Drag
> **Status:** `INPUT[inlineSelect(option(Open), option(In Progress), option(Fix Implemented), option(Resolved)):status]` · **Priority:** `INPUT[inlineSelect(option(Low), option(Medium), option(High), option(Critical)):priority]`
>
> Opened **2026-06-01** · Updated `INPUT[date:updated]`
>
> **Result:** `INPUT[inlineSelect(option(Pending), option(Pass), option(Fail)):verified_result]` · **Date:** `INPUT[date:verified_date]` · **Evidence:** `INPUT[text:verified_evidence]`

**Description:** Dragging the cyan midpoint handle produces an edge path that deforms into an extreme S-curve or other unintended shape, routing far from the expected drag target. The stored `bendPoint` coordinates appear to be much further from the drag origin than the pointer actually travelled.

**Reproduction:** Select any edge. Drag the cyan handle a small distance. The edge path reshapes dramatically, extending well beyond where the cursor was.

**Root Cause (suspected):** The delta calculation in `handleBendPointerMove` converts both the current and start client positions through `screenToFlowPosition`, then adds the delta to `startBend`. If `screenToFlowPosition` is not a pure linear transform (e.g. if it includes the canvas element's bounding rect offset or applies zoom non-linearly relative to the client delta), the resulting `bendPoint` can be far from the visual drag position.

Specifically: `screenToFlowPosition` converts an absolute screen coordinate to the flow's coordinate space. The difference `(cur.x - start.x)` should cancel out the canvas offset and give the pure delta in flow space — but if the React Flow instance's viewport transform is applied differently at drag-start vs. during the move (e.g. due to the first frame), the delta can be wildly wrong on the first drag only.

An alternative suspect is that `smoothstep`'s `centerX/centerY` parameters do not force the path to pass through the given point but instead act as a routing hint, causing the visual path to be far from the stored coordinates.

---

> [!note]- Investigation
>
> ### Checklist
>
> - [ ] Log `cur`, `start`, and the resulting `bendPoint` on first `pointermove` to verify whether the coordinate math is the issue
> - [ ] Test whether switching routing to `straight` (which uses a direct polyline through `bendPoint`) shows the same wildness — if straight is correct, the issue is in `smoothstep`/`bezier` path rendering, not the coordinate math
> - [ ] Check if the React Flow viewport is correctly initialised before the first drag event
> - [ ] Consider using `project()` / raw viewport math instead of `screenToFlowPosition` for delta calculation

> [!info]- Verification Log
>
> | Date | By  | Result  | Evidence |
> | ---- | --- | ------- | -------- |
> | —    | —   | Pending | —        |

---

_Part of [[README|Ghost AI Vault]] | [[issues-moc]]_
