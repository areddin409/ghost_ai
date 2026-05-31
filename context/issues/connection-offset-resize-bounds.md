---
type: issue
title: connection-offset-resize-bounds
status: Fix Implemented
priority: Medium
opened: 2026-05-29
updated: 2026-05-29
description: "there is a battle between the resize bounds and the node connections "
---

> [!bug] connection-offset-resize-bounds
> **Status:** `INPUT[inlineSelect(option(Open), option(In Progress), option(Fix Implemented), option(Resolved)):status]` · **Priority:** `INPUT[inlineSelect(option(Low), option(Medium), option(High), option(Critical)):priority]`
>
> Opened **2026-05-29** · Updated `INPUT[date:updated]`

**Description:** there is a battle between the resize bounds and the node connections. on the hexagon shape the left and right nodes aren't able to be selected from and have no offset. ![[Pasted image 20260529213057.png]] but the nodes are slightly going into the shape. 

---

> [!note]- Investigation
>
> #### Checklist
>
> - [x] Fix pointer-event blocking: move `{handles}` to render after `{labelEl}` in both branches of `CanvasNodeRenderer` so handles sit above the label overlay
> - [x] Fix `hexLROffset` formula: change `+5` to `-5` so handle center lands on the visual hexagon polygon edge
> - [x] Visual test: hover hexagon and confirm all 4 dots appear on the shape border, L/R cursor changes to crosshair, and connection drag starts correctly
> - [ ] Check diamond and cylinder for the same overlap issue (handles inside div covered by labelEl)
> - [ ] Confirm connection lines visually exit from the shape edge outward after handle positions are corrected — existing stale edges route from old positions; re-test with freshly drawn connections
>
> **Root Cause:** `labelEl` (rendered after handles, `position: absolute; inset: 0`) intercepted pointer events for L/R handles shifted inside the div by `hexLROffset`. The `+5` in the offset formula also placed handles ~10px inside the hexagon edge instead of on it.
>
> **Fix Applied:** Swapped `{labelEl}` / `{handles}` render order (handles now last = topmost). Corrected `hexLROffset` formula to `… + H * Math.sqrt(3) / 2 - 5`.

> [!info]- Verification Log
>
> | Date | By  | Result  | Evidence |
> | ---- | --- | ------- | -------- |
> | —    | —   | Pending | —        |

---

_Part of [[README|Ghost AI Vault]] | [[issues-moc]]_
