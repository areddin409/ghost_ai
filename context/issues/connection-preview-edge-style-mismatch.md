---
type: issue
title: Connection Preview Line Does Not Match Connected Edge Style
status: Resolved
priority: Medium
opened: 2026-05-30
updated: 2026-05-30
description: While dragging a new connection, the preview line is a smooth Bezier curve. Once connected, the edge switches to a right-angle SmoothStep path. The two styles do not match.
verified_result: Pass
verified_date: 2026-05-30
verified_evidence: user
---

> [!bug] Connection Preview Line Does Not Match Connected Edge Style
> **Status:** `INPUT[inlineSelect(option(Open), option(In Progress), option(Fix Implemented), option(Resolved)):status]` · **Priority:** `INPUT[inlineSelect(option(Low), option(Medium), option(High), option(Critical)):priority]`
>
> Opened **2026-05-30** · Updated `INPUT[date:updated]`
>
> **Result:** `INPUT[inlineSelect(option(Pending), option(Pass), option(Fail)):verified_result]` · **Date:** `INPUT[date:verified_date]` · **Evidence:** `INPUT[text:verified_evidence]`

**Description:** When dragging a connection from a node handle, React Flow renders a live preview line in the default **Bezier** curve style. As soon as the connection is completed, `CanvasEdgeRenderer` renders the settled edge using `getSmoothStepPath`, which produces a **right-angle step** path. The visual snap from curved to stepped is jarring and misleading — the user cannot tell what the final edge will look like while dragging.

---

> [!note]- Investigation
>
> #### Checklist
>
> - [x] Confirm `connectionLineType` is absent / defaulting to Bezier in `canvas.tsx`
> - [x] Confirm `CanvasEdgeRenderer` uses `getSmoothStepPath` (right-angle steps)
> - [x] Add `connectionLineType={ConnectionLineType.SmoothStep}` to `<ReactFlow>` in `canvas.tsx`
> - [x] Added `connectionLineStyle` matching `COLOR_REST` / `STROKE_WIDTH` from `canvas-edge.tsx` — no custom component needed
>
> **Root Cause:**
>
> `canvas.tsx` passes no `connectionLineType` to `<ReactFlow>`, so the in-flight preview uses the React Flow default (`ConnectionLineType.Bezier`). The committed edge is rendered by `CanvasEdgeRenderer` via `getSmoothStepPath` — a completely different curve type.
>
> The fix is to set `connectionLineType={ConnectionLineType.SmoothStep}` on the `<ReactFlow>` instance so the preview matches the settled edge. A `connectionLineStyle` prop (or custom `ConnectionLineComponent`) can also align stroke color (`rgba(248,250,252,0.35)`) and width (`1.5px`) with `COLOR_REST` / `STROKE_WIDTH` constants in `canvas-edge.tsx`.
>
> **Fix Applied:** Added `connectionLineType={ConnectionLineType.SmoothStep}` and `connectionLineStyle={{ stroke: "rgba(248,250,252,0.35)", strokeWidth: 1.5 }}` to `<ReactFlow>` in `canvas.tsx`. Preview now uses the same right-angle step path and rest-state stroke style as the committed edge.

> [!info]- Verification Log
>
> | Date | By  | Result  | Evidence |
> | ---- | --- | ------- | -------- |
> | —    | —   | Pending | —        |

---

_Part of [[README|Ghost AI Vault]] | [[issues-moc]]_
