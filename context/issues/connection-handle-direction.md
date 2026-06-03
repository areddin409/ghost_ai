---
type: issue
title: Connection Handles — All Connections Exit and Anchor to Top of Shape
status: Resolved
priority: High
opened: 2026-05-29
updated: 2026-05-29
description: Dragging a connection from any handle always produces a line that exits from the top of the source shape, and dropping it on a target snaps the endpoint to the top of the target instead of the nearest edge point.
verified_result: Pending
verified_date: ""
verified_evidence: ""
---

> [!bug] Connection Handles — All Connections Exit and Anchor to Top of Shape
> **Status:** `INPUT[inlineSelect(option(Open), option(In Progress), option(Fix Implemented), option(Resolved)):status]` · **Priority:** `INPUT[inlineSelect(option(Low), option(Medium), option(High), option(Critical)):priority]`
>
> Opened **2026-05-29** · Updated `INPUT[date:updated]`
>
> **Result:** `INPUT[inlineSelect(option(Pending), option(Pass), option(Fail)):verified_result]` · **Date:** `INPUT[date:verified_date]` · **Evidence:** `INPUT[text:verified_evidence]`

**Description:** Dragging a connection from any handle always produces a line that exits from the top of the source shape, regardless of which directional handle (top, right, bottom, left) was grabbed. When the connection is dropped onto a target shape, the endpoint also snaps to the top of the target rather than the nearest or correct anchor point. Expected behavior: each handle should define the exit direction (e.g. right handle → line exits from right edge), and the target endpoint should anchor to the closest edge point on the target shape.

---

> [!note]- Investigation
>
> #### Checklist
>
> - [x] Identify where connection drag origin point is calculated
> - [x] Confirm handle position data (top/right/bottom/left) is passed through to the edge renderer
> - [x] Identify where target anchor point is resolved on drop
> - [ ] Fix source exit point to use the dragged handle's position
> - [ ] Fix target anchor to use nearest edge intersection, not always top
>
> **Root Cause:**
>
> All four `<Handle>` components in `canvas-node.tsx` have no `id` prop.
>
> React Flow sets `handleId = id || null` when registering each handle (`@xyflow/react/dist/esm/index.js:1738`). On connection, the edge is stored with `sourceHandle: null` and `targetHandle: null`.
>
> When the edge is rendered, `getEdgePosition()` calls `getHandle$1(bounds, null)` (`@xyflow/system/dist/esm/index.js:1372`). The implementation is:
>
> ```js
> // if no handleId is given, we use the first handle
> return (!handleId ? bounds[0] : bounds.find((d) => d.id === handleId)) || null;
> ```
>
> `bounds[0]` is always the `Position.Top` handle — the first one in JSX order — regardless of which directional handle the user actually dragged from or dropped onto.
>
> Additionally, there are no `type="target"` handles. With `ConnectionMode.Loose`, target-side handles are found in both target and source bounds, so source handles work for anchoring. But the null-ID fallback still resolves to top.
>
> **Fix Applied:** _TBD — add explicit `id` prop to each Handle (`"top"` / `"right"` / `"bottom"` / `"left"`)_

> [!info]- Verification Log
>
> | Date | By  | Result  | Evidence |
> | ---- | ---- | ------- | -------- |
> | —    | —   | Pending | —        |

---

_Part of [[README|Ghost AI Vault]] · [[issues-moc]]_
