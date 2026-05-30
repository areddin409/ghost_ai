---
type: issue
title: Minimap — Cannot Pan Canvas When Zoomed Out
status: Resolved
priority: Medium
opened: 2026-05-24
updated: 2026-05-24
description: Minimap renders but drag-to-pan interaction is non-functional. Cannot navigate to off-screen nodes.
verified_result: Pending
verified_date: ""
verified_evidence: ""
---

> [!bug] Minimap — Cannot Pan Canvas When Zoomed Out
> **Status:** `INPUT[inlineSelect(option(Open), option(In Progress), option(Fix Implemented), option(Resolved)):status]` · **Priority:** `INPUT[inlineSelect(option(Low), option(Medium), option(High), option(Critical)):priority]`
>
> Opened **2026-05-24** · Updated `INPUT[date:updated]`
>
> **Result:** `INPUT[inlineSelect(option(Pending), option(Pass), option(Fail)):verified_result]` · **Date:** `INPUT[date:verified_date]` · **Evidence:** `INPUT[text:verified_evidence]`

**Description:** When the user is zoomed out and nodes are out of the visible viewport, the minimap does not allow grabbing/dragging to pan the canvas back to the nodes. The minimap renders but its drag-to-pan interaction is non-functional.

**Expected Behavior:** Clicking and dragging the viewport indicator inside the minimap should pan the main canvas so nodes that are off-screen become visible.

---

> [!note]- Investigation
>
> #### Checklist
>
> - [ ] Reproduce reliably — _pending_
> - [ ] Inspect MiniMap props in `canvas.tsx` — _pending_
> - [ ] Check React Flow MiniMap pannable/zoomable prop requirements — _pending_
>
> **Root Cause:** Unknown — not yet investigated.
>
> **Fix Applied:** _TBD_

> [!info]- Verification Log
>
> | Date | By  | Result  | Evidence |
> | ---- | --- | ------- | -------- |
> | —    | —   | Pending | —        |

---

_Part of [[README|Ghost AI Vault]] · [[issues-moc]]_
