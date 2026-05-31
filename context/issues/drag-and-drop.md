---
type: issue
title: Drag and Drop — Shape Panel → Canvas
status: Resolved
priority: Medium
opened: 2026-05-23
updated: 2026-05-24
description: Canvas nodes from the shape panel cannot be dragged and dropped onto the canvas.
verified_result: Pass
verified_date: "2026-05-24"
verified_evidence: "running app"
---

# Drag and Drop — Shape Panel → Canvas

**Status:** `INPUT[inlineSelect(option(Open), option(In Progress), option(Fix Implemented), option(Resolved)):status]`

**Result:** `INPUT[inlineSelect(option(Pending), option(Pass), option(Fail)):verified_result]` · **Date:** `INPUT[date:verified_date]` · **Evidence:** `INPUT[text:verified_evidence]`

|             |            |
| ----------- | ---------- |
| **Opened**  | 2026-05-23 |
| **Updated** | 2026-05-24 |

**Description:** Canvas nodes from the node panel cannot be dragged and dropped onto the canvas.

---

#### Investigation Checklist

- [x] Draggable nodes in the node panel have correct `draggable` attribute and `onDragStart` handler setting `"application/ghost-shape"` in `dataTransfer` — _2026-05-23_
- [x] `onDragOver` (with `preventDefault`) and `onDrop` handlers exist and read the correct MIME type — _2026-05-23_
- [x] Drop handler reads shape + size from `dataTransfer`, converts screen coords via `screenToFlowPosition`, and creates a node — _2026-05-23_
- [x] Liveblocks storage structure audited — `useLiveblocksFlow` stores under `storage["flow"]` (nested `LiveObject`), not at the top-level keys — _2026-05-24_
- [x] Fix verified live in running app — _pending_ ✅ 2026-05-24

**Root Cause (confirmed 2026-05-24):** Three compounding bugs:

1. **Event handling** — drag handlers were on a wrapper `<div>`, not wired to the React Flow DOM node. Fixed with native `addEventListener` on `useStore((s) => s.domNode)`.
2. **Wrong storage path (primary)** — `addCanvasNode` mutation wrote to `storage.get("nodes")` (top-level key from `initialStorage`). `useLiveblocksFlow` reads from `storage["flow"]["nodes"]` (nested under `DEFAULT_STORAGE_KEY = "flow"`). Nodes were silently created in a dead path the hook never subscribed to.
3. **Wrong node creation API** — manually constructing `new LiveObject(...)` bypassed `useLiveblocksFlow`'s internal `toLiveblocksInternalNode` which applies the correct sync config.

**Fixes Applied — 2026-05-24:**

- `canvas.tsx`: replaced `addCanvasNode` mutation with `onNodesChange([{ type: "add", item: newNode }])` — routes through `useLiveblocksFlow`'s own mutation which writes to the correct `storage["flow"]["nodes"]` path using `toLiveblocksInternalNode`
- `canvas.tsx`: added explicit `<CanvasNode, CanvasEdge>` type params to `useLiveblocksFlow` call
- `canvas-wrapper.tsx`: updated `initialStorage` from `{ nodes, edges }` to `{ flow: new LiveObject({ nodes, edges }) }` to match actual storage structure
- `liveblocks.config.ts`: updated `Storage` type from `{ nodes, edges }` to `{ flow: LiveblocksFlow<CanvasNode, CanvasEdge> }`

#### Verification Log

| Date | By  | Result  | Evidence |
| ---- | --- | ------- | -------- |
| 2026-05-24 | user | Pass | running app |

---

_Part of [[README|Ghost AI Vault]] · [[issues-moc]]_
