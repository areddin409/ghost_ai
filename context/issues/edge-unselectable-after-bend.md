---
type: issue
title: Other Edges Unselectable After One Edge Is Bent
status: Open
priority: High
opened: 2026-06-01
updated: 2026-06-01
description: After bending one edge via the midpoint drag handle, other edges on the canvas can no longer be selected by clicking them.
verified_result: Pending
verified_date: ""
verified_evidence: ""
---

> [!bug] Other Edges Unselectable After One Edge Is Bent
> **Status:** `INPUT[inlineSelect(option(Open), option(In Progress), option(Fix Implemented), option(Resolved)):status]` · **Priority:** `INPUT[inlineSelect(option(Low), option(Medium), option(High), option(Critical)):priority]`
>
> Opened **2026-06-01** · Updated `INPUT[date:updated]`
>
> **Result:** `INPUT[inlineSelect(option(Pending), option(Pass), option(Fail)):verified_result]` · **Date:** `INPUT[date:verified_date]` · **Evidence:** `INPUT[text:verified_evidence]`

**Description:** Once a `bendPoint` has been stored on one edge (by dragging its midpoint handle), clicking other edges on the canvas does not select them. The interaction appears to be swallowed or ignored.

**Reproduction:** Select edge A. Drag its cyan handle to set a `bendPoint`. Click elsewhere to deselect. Now click edge B — it does not become selected.

**Root Cause (suspected — two candidates):**

1. **Pointer capture not released.** If `releasePointerCapture` fails silently (e.g. because the circle element was re-rendered with a different React key between drag frames), the SVG circle on the bent edge may retain pointer capture, eating subsequent pointer events.

2. **Bent edge path covers the canvas.** Because the `bendPoint` ends up at extreme coordinates (see [[bend-handle-path-goes-wild]]), the 16 px wide transparent hit-area `<path>` for the bent edge may span a very large region of the canvas, intercepting clicks intended for other edges. The hit-area uses `strokeWidth={16}` with `style={{ cursor: "pointer" }}` and `pointerEvents` implicitly on by default for SVG paths.

3. **`edgeGroupCycleRef` state corruption.** The `onEdgeClick` handler maintains `edgeGroupCycleRef` to cycle through co-located edges. If the bent edge's coordinates cause it to be considered "at the same handle point" as another edge, the cycle logic may prevent selection of the target edge.

---

> [!note]- Investigation
>
> ### Checklist
>
> - [ ] Confirm whether the issue reproduces when the bend path is only slightly moved (vs. wildly off-course) — if not, [[bend-handle-path-goes-wild]] is the root cause (large hit-area hypothesis)
> - [ ] Add `console.log` to `onEdgeClick` to confirm it fires when clicking the unselectable edge
> - [ ] Check whether clicking on a node (to deselect all) restores edge selectability
> - [ ] Verify `releasePointerCapture` is actually called — add a log inside `handleBendPointerUp`
> - [ ] Check if `dragOverEdgeIdRef` gets stuck in a non-null state after the drag, causing other edges to be in a "drag target" state that intercepts events

> [!info]- Verification Log
>
> | Date | By  | Result  | Evidence |
> | ---- | --- | ------- | -------- |
> | —    | —   | Pending | —        |

---

_Part of [[README|Ghost AI Vault]] | [[issues-moc]]_
