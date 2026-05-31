---
type: issue
title: "Edge Selection Ambiguity — Shared Handle Point"
status: Fix Implemented
priority: Medium
opened: 2026-05-30
updated: 2026-05-30
description: When two edges share the same source handle on a node, only one edge can be selected or interacted with — the other is permanently occluded and cannot be deleted, relabeled, or reconnected.
verified_result: Pending
verified_date: ""
verified_evidence: ""

---

> [!bug] Edge Selection Ambiguity — Shared Handle Point
> **Status:** `INPUT[inlineSelect(option(Open), option(In Progress), option(Fix Implemented), option(Resolved)):status]` · **Priority:** `INPUT[inlineSelect(option(Low), option(Medium), option(High), option(Critical)):priority]`
>
> Opened **2026-05-30** · Updated `INPUT[date:updated]`
>
> **Result:** `INPUT[inlineSelect(option(Pending), option(Pass), option(Fail)):verified_result]` · **Date:** `INPUT[date:verified_date]` · **Evidence:** `INPUT[text:verified_evidence]`

**Description:** When two edges originate from the same handle point on a node, clicking that area only selects one of them (the topmost in render order). The other edge is unreachable — it cannot be selected, deleted, relabeled, or reconnected. Seen on "Start HERE" node with two edges sharing its bottom handle: the edge going right to DB is always selected; the edge going left to the circle node is never reachable.

**Screenshots:** `context/screentshots/Screenshot 2026-05-30 171228.png` · `context/screentshots/Screenshot 2026-05-30 171253.png`

---

> [!note]- Investigation
>
> #### Checklist
>
> - [x] Confirm React Flow picks the topmost/last-rendered edge when hit areas overlap
> - [x] Determine whether this is a z-index, pointer-events, or hit-test ordering issue
> - [x] Decide on disambiguation approach: popover menu listing overlapping edges, or click-to-cycle
> - [x] Implement and verify fix does not regress single-edge handle behaviour
>
> **Root Cause:** SVG paint-order / pointer-events ordering. Each node has named handles (`"top"`, `"right"`, `"bottom"`, `"left"`). When two edges share the same `source` + `sourceHandle`, both custom-edge `<path>` hit areas (16 px wide, transparent) start at the same screen coordinate. React Flow renders edges in array order — the last edge is topmost in SVG z-order and captures all pointer events in the overlap region near the source handle. This is not a CSS z-index issue; SVG elements have no z-index — paint order determines hit-test precedence.
>
> **Fix Applied:** Click-to-cycle via `onEdgeClick` in `components/editor/canvas.tsx`. An `edgeGroupCycleRef` tracks `{ groupKey, currentId }` — where `groupKey = "${source}:${sourceHandle}"`. On the first click to a group, the topmost edge is selected normally. On repeated clicks to the same group (React Flow always fires for the topmost edge), the handler cycles the logical selection to the next sibling via `onEdgesChange`. `onPaneClick` resets the ref so a fresh click after deselecting all always lands on the topmost edge first. Single-edge handles are unaffected (`group.length <= 1` returns early).

> [!info]- Verification Log
>
> | Date | By  | Result  | Evidence |
> | ---- | --- | ------- | -------- |
> | —    | —   | Pending | —        |

---

_Part of [[README|Ghost AI Vault]] | [[issues-moc]]_
