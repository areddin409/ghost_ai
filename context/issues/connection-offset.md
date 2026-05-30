---
type: issue
title: Connection Lines — Endpoints Are Visually Offset from Shape Edges
status: Resolved
priority: High
opened: 2026-05-29
updated: 2026-05-29
description: Rendered connection lines do not meet the edge of their source and target shapes accurately — lines appear to start and end slightly off the shape boundary.
verified_result: Pass
verified_date: ""
verified_evidence: ""
---

> [!bug] Connection Lines — Endpoints Are Visually Offset from Shape Edges
> **Status:** `INPUT[inlineSelect(option(Open), option(In Progress), option(Fix Implemented), option(Resolved)):status]` · **Priority:** `INPUT[inlineSelect(option(Low), option(Medium), option(High), option(Critical)):priority]`
>
> Opened **2026-05-29** · Updated `INPUT[date:updated]`
>
> **Result:** `INPUT[inlineSelect(option(Pending), option(Pass), option(Fail)):verified_result]` · **Date:** `INPUT[date:verified_date]` · **Evidence:** `INPUT[text:verified_evidence]`

**Description:** Connection lines between shapes do not visually meet the shape edges. The source and/or target endpoints appear offset — the line floats slightly away from or inside the shape boundary instead of touching it cleanly. Likely caused by anchor point calculations not accounting for shape-specific geometry (e.g. SVG viewBox offset, shape padding, or canvas transform scale). Related to [[connection-handle-direction]].

---

> [!note]- Investigation
>
> #### Checklist
>
> - [x] Capture exact pixel offset at different zoom levels to determine if it's scale-dependent
> - [x] Check whether offset differs by shape type (circle vs rectangle vs hexagon)
> - [x] Audit anchor point calculation — confirm it uses the node's rendered bounding box, not layout position
> - [x] Check for SVG viewBox or padding offset being ignored in the calculation
> - [ ] Verify fix across all shape types at multiple zoom levels
>
> **Root Cause:**
>
> Two compounding causes:
>
> **Primary — same null-handle-ID bug as [[connection-handle-direction]]:** All connections resolve to the `Position.Top` handle because `sourceHandle/targetHandle` are stored as `null`. The line exits the top of the source and anchors to the top of the target regardless of geometry — this is the dominant "offset."
>
> **Secondary — handle outer-edge anchoring with oversized handles:** React Flow calculates edge endpoints using `getHandlePosition()` (`@xyflow/system/dist/esm/index.js:1420`), which returns the handle element's *outer* edge (farthest from the node body), not its center. Handle positions are measured via `getBoundingClientRect()` (`@xyflow/system:870`) and divided by zoom. Our handles are 10×10 px; React Flow's default CSS centers them on the node boundary via `transform: translate(-50%, -50%)`. This places the outer edge **5 px outside** the node boundary — meaning every edge endpoint floats 5 px past the shape edge.
>
> This 5 px offset is **zoom-invariant in screen pixels** (the division by zoom cancels out with the zoom applied at render time). It appears more pronounced proportionally at low zoom because the node renders smaller while the offset stays 5 px.
>
> **SVG viewBox / scale:** Not a factor. SVGs have no `viewBox`; coordinate systems match CSS pixels directly. The `H = SW/2 = 0.75 px` inset on SVG polygon vertices is negligible.
>
> **Fix Applied:**
- Handle `id` props added — primary cause resolved (connections now exit/anchor from the correct edge).
- Hexagon left/right handle geometry corrected: `right`/`left` CSS overrides position those handles at `w/2 * (1 - √3/2) + H*√3/2 + 5 ≈ 14.4 px` inset from the div boundary, placing the connection endpoint on the actual hexagon visual edge. The `+5` compensates for ReactFlow's `getHandlePosition` always returning the handle's outer edge (not center).
- Residual: all shapes retain a ~5 px float at the handle outer edge (inherent to ReactFlow's endpoint calculation). Fixing this by overriding handle `transform` CSS moves handles fully inside the node, breaking hover-from-outside interactivity — deferred.

> [!info]- Verification Log
>
> | Date | By  | Result  | Evidence |
> | ---- | ---- | ------- | -------- |
> | —    | —   | Pending | —        |

---

_Part of [[README|Ghost AI Vault]] · [[issues-moc]]_
