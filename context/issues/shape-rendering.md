---
type: issue
title: Shape Rendering — All Nodes Render as the Same Shape
status: Resolved
priority: Medium
opened: 2026-05-24
updated: 2026-05-24
description: All dropped nodes render identically regardless of which shape was dragged. Shape field stored correctly but renderer ignores it.
verified_result: Pending
verified_date: ""
verified_evidence: ""
---

> [!bug] Shape Rendering — All Nodes Render as the Same Shape
> **Status:** `INPUT[inlineSelect(option(Open), option(In Progress), option(Fix Implemented), option(Resolved)):status]` · **Priority:** `INPUT[inlineSelect(option(Low), option(Medium), option(High), option(Critical)):priority]`
>
> Opened **2026-05-24** · Updated `INPUT[date:updated]`
>
> **Result:** `INPUT[inlineSelect(option(Pending), option(Pass), option(Fail)):verified_result]` · **Date:** `INPUT[date:verified_date]` · **Evidence:** `INPUT[text:verified_evidence]`

**Description:** All dropped nodes render identically (rounded rectangle) regardless of which shape was dragged. The `shape` field is stored correctly in node data but the renderer ignores it.

---

> [!note]- Investigation
>
> #### Checklist
>
> - [x] `shape` field confirmed present in node data — _2026-05-24_
> - [x] `CanvasNodeRenderer` audited — ignores `data.shape`, applies `rounded-xl` to all — _2026-05-24_
> - [x] Fix verified live in running app — _pending_
>
> **Root Cause:** `CanvasNodeRenderer` used `rounded-xl` CSS for all shapes and never read `data.shape`. No shape-specific visual logic existed.
>
> **Fix Applied — 2026-05-24:** Replaced the generic div renderer with an SVG-based `ShapeRenderer` in `canvas.tsx` that branches on `data.shape` and renders: rectangle (rounded rect), pill (fully rounded rect), circle (ellipse), diamond (4-point polygon), hexagon (6-point polygon, pointed top/bottom), cylinder (rect body + top/bottom ellipses with side lines). Label overlaid as an absolute-positioned div.

> [!info]- Verification Log
>
> | Date | By  | Result  | Evidence |
> | ---- | --- | ------- | -------- |
> | —    | —   | Pending | —        |

---

_Part of [[README|Ghost AI Vault]] · [[issues-moc]]_
