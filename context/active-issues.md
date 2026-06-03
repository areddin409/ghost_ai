---
type: issue-log
updated: 2026-06-02
edge_insert_verified: Pass
edge_insert_verified_date: ""
edge_insert_verified_evidence: ""
shape_rendering_verified: Pending
shape_rendering_verified_date: ""
shape_rendering_verified_evidence: ""
minimap_verified: Pending
minimap_verified_date: ""
minimap_verified_evidence: ""
edge_insert_status: Fix Implemented
exampleProperty: false
---

> [!warning] Governance Rules
> - Agents may add issues and update status to `in-progress` or `fix-implemented`
> - Agents may NOT mark issues `resolved` — only the human verifies resolution
> - Every issue must have a `spec_ref` or be explicitly marked `orphan: true`

# Current Issues

> [!important] Resolution Rules — Read Before Touching This File
>
> **States:** `Open` → `Fix Implemented` → `Resolved`
>
> **Agents may:**
>
> - Move `Open → Fix Implemented` only after running the app and observing the fix working
>
> **Agents may NOT:**
>
> - Mark any issue `Resolved` — ever
> - Move an issue to `Fix Implemented` without live testing
>
> **To mark Resolved:**
>
> - Set Result to `Pass` below, then confirm with the human
> - The agent then moves the entry under `## Resolved`

---

## Open

### Edge Insert — "Insert Here" Persists and Shape Not Always Inserted Between Nodes

**Status:** `INPUT[inlineSelect(option(Open), option(Fix Implemented), option(Resolved)):edge_insert_status]` · **Spec:** [[specs/22-edge-enhancements|Spec 22 — Edge Enhancements]] · **Opened:** 2026-06-02 · **Fixed:** 2026-06-02

**Description:** After dropping a shape onto an edge, the "Insert here" dashed indicator is never cleared and remains on the canvas permanently. The dropped node is also not consistently spliced between the source and target nodes (existing edge is not always split into two edges through the new node).

**Verification:** `INPUT[inlineSelect(option(Pending), option(Pass), option(Fail)):edge_insert_verified]` · **Date:** `INPUT[date:edge_insert_verified_date]` · **Evidence:** `INPUT[text:edge_insert_verified_evidence]`

---

### Shape Rendering — All Nodes Render as the Same Shape

**Status:** `INPUT[inlineSelect(option(Open), option(Fix Implemented), option(Resolved)):shape_rendering_status]` · **Opened:** 2026-05-24

**Description:** All dropped nodes render identically (rounded rectangle) regardless of which shape was dragged. The `shape` field is stored correctly in node data but the renderer ignores it.

**Root Cause:** `CanvasNodeRenderer` used `rounded-xl` CSS for all shapes and never read `data.shape`. No shape-specific visual logic existed.

**Fix Applied — 2026-05-24:** Replaced the generic div renderer with an SVG-based `ShapeRenderer` in `canvas.tsx` that branches on `data.shape` and renders: rectangle (rounded rect), pill (fully rounded rect), circle (ellipse), diamond (4-point polygon), hexagon (6-point polygon, pointed top/bottom), cylinder (rect body + top/bottom ellipses with side lines). Label overlaid as an absolute-positioned div.

**Verification:** `INPUT[inlineSelect(option(Pending), option(Pass), option(Fail)):shape_rendering_verified]` · **Date:** `INPUT[date:shape_rendering_verified_date]` · **Evidence:** `INPUT[text:shape_rendering_verified_evidence]`

---

### Minimap — Cannot Pan Canvas When Zoomed Out

**Status:** `INPUT[inlineSelect(option(Open), option(Fix Implemented), option(Resolved)):minimap_status]` · **Opened:** 2026-05-24

**Description:** When the user is zoomed out and nodes are out of the visible viewport, the minimap does not allow grabbing/dragging to pan the canvas back to the nodes. The minimap renders but its drag-to-pan interaction is non-functional.

**Expected Behavior:** Clicking and dragging the viewport indicator inside the minimap should pan the main canvas so nodes that are off-screen become visible.

**Root Cause:** The `<MiniMap>` component in `canvas.tsx` was missing the `pannable` (and `zoomable`) props. React Flow's MiniMap disables drag-to-pan by default; these boolean props must be explicitly set to enable the interaction.

**Fix Applied — 2026-05-24:** Added `pannable` and `zoomable` props to `<MiniMap>` in `components/editor/canvas.tsx`.

**Verification:** `INPUT[inlineSelect(option(Pending), option(Pass), option(Fail)):minimap_verified]` · **Date:** `INPUT[date:minimap_verified_date]` · **Evidence:** `INPUT[text:minimap_verified_evidence]`

---

## Resolved

_No resolved issues._

---

_Part of [[README|Ghost AI Vault]]_
