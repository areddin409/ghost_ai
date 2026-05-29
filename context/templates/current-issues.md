---
type: issue-log
status: active
updated: 2026-05-24
open_count: 0
resolved_count: 0
---

# Current Issues

> [!important] Resolution Rules — Read Before Touching This File
>
> **States:** `Open` → `Fix Implemented (Pending Verification)` → `Resolved`
>
> **Agents may:**
>
> - Move `Open → Fix Implemented` only after running the app and observing the fix working
> - Add a row to the **Verification Log** with the date, what was run, and what was observed
>
> **Agents may NOT:**
>
> - Mark any issue `Resolved` — ever
> - Move an issue to `Fix Implemented` without live testing
>
> **To mark Resolved:**
>
> - The user must explicitly confirm it
> - The agent then updates the Status field and moves the entry under `## Resolved`
>
> **If verification fails after Fix Implemented:**
>
> - Move back to `Open` and add a `Verification failed:` row to the log explaining what broke

---

## Open

### Shape Rendering — All Nodes Render as the Same Shape

|             |                                        |
| ----------- | -------------------------------------- |
| **Status**  | Fix Implemented (Pending Verification) |
| **Opened**  | 2026-05-24                             |
| **Updated** | 2026-05-24                             |

**Description:** All dropped nodes render identically (rounded rectangle) regardless of which shape was dragged. The `shape` field is stored correctly in node data but the renderer ignores it.

**Root Cause:** `CanvasNodeRenderer` used `rounded-xl` CSS for all shapes and never read `data.shape`. No shape-specific visual logic existed.

**Fix Applied — 2026-05-24:** Replaced the generic div renderer with an SVG-based `ShapeRenderer` in `canvas.tsx` that branches on `data.shape` and renders: rectangle (rounded rect), pill (fully rounded rect), circle (ellipse), diamond (4-point polygon), hexagon (6-point polygon, pointed top/bottom), cylinder (rect body + top/bottom ellipses with side lines). Label overlaid as an absolute-positioned div.

#### Verification Log

| Date | By  | Result  | Evidence |
| ---- | --- | ------- | -------- |
| —    | —   | Pending | —        |

---

### Minimap — Cannot Pan Canvas When Zoomed Out

|             |                                        |
| ----------- | -------------------------------------- |
| **Status**  | Fix Implemented (Pending Verification) |
| **Opened**  | 2026-05-24                             |
| **Updated** | 2026-05-24                             |

**Description:** When the user is zoomed out and nodes are out of the visible viewport, the minimap does not allow grabbing/dragging to pan the canvas back to the nodes. The minimap renders but its drag-to-pan interaction is non-functional.

**Expected Behavior:** Clicking and dragging the viewport indicator inside the minimap should pan the main canvas so nodes that are off-screen become visible.

**Root Cause:** The `<MiniMap>` component in `canvas.tsx` was missing the `pannable` (and `zoomable`) props. React Flow's MiniMap disables drag-to-pan by default; these boolean props must be explicitly set to enable the interaction.

**Fix Applied — 2026-05-24:** Added `pannable` and `zoomable` props to `<MiniMap>` in `components/editor/canvas.tsx`.

#### Verification Log

| Date | By  | Result  | Evidence |
| ---- | --- | ------- | -------- |
| —    | —   | Pending | —        |

---

## Resolved

_No resolved issues._

---

_Part of [[README|Ghost AI Vault]]_
