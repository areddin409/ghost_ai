---
type: feature-spec
feature: "22 — Edge Enhancements"
status: planned
updated: 2026-06-01
---

# Feature 22 — Edge Enhancements

> [!abstract] Goal
> Add bezier routing, per-edge draggable midpoint handles (all routing types), and drop-onto-edge insertion with dashed-highlight feedback.

**References:** [[architecture-context]] · [[code-standards]]

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Architecture:** Three independent but related enhancements to edge behaviour. Bezier is a one-line settings addition. Midpoint drag stores a `bendPoint` in Liveblocks edge data (via `updateEdgeData`) and converts pointer events to flow coordinates via `screenToFlowPosition`. Edge-split detection uses `document.elementsFromPoint` against a `data-edgeid` attribute on each edge's hit-area path; hover state lives in a lightweight React context (`DragEdgeContext`) so `CanvasEdgeRenderer` can style itself without prop drilling.

**Tech Stack:** `@xyflow/react` (`getBezierPath`, `getSmoothStepPath`, `getStraightPath`, `EdgeLabelRenderer`, `useReactFlow`), React context, CSS `@keyframes` in `globals.css`

---

## Scope

- No new npm packages
- No Prisma migration — `edgeRouting` is already a `String` column; `bendPoint` lives in Liveblocks edge data
- Do not touch `canvas-node.tsx`, `shape-panel.tsx`, or any auth/project code
- `DragEdgeContext` is local React state only — never written to Liveblocks presence or storage

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `types/canvas.ts` | Modify | Add `bendPoint` field to `CanvasEdgeData` |
| `components/editor/canvas/drag-edge-context.tsx` | **Create** | Context, provider, and hook for drag-over-edge state |
| `components/editor/canvas/canvas-wrapper.tsx` | Modify | Wrap `<ReactFlowProvider>` with `<DragEdgeProvider>` |
| `components/editor/canvas/canvas-edge.tsx` | Modify | Bezier path branch, `resolvePath` helper, bend handle, drag-highlight feedback |
| `components/editor/canvas/canvas.tsx` | Modify | `bezier` in `connectionLineTypeMap`, edge-id detection in `onDragOver`, split logic in `onDrop`, `dragOverEdgeIdRef` |
| `components/editor/user-settings-modal.tsx` | Modify | Add `"bezier"` to `EDGE_ROUTING_OPTIONS` |
| `app/globals.css` | Modify | Add `@keyframes ghost-dash` for animated dashed stroke |

---

## Implementation

- [ ] #spec **Task 1: Bezier routing option**

  1. Add `"bezier"` to `EDGE_ROUTING_OPTIONS` in `user-settings-modal.tsx`
  2. Add `getBezierPath` import to `canvas-edge.tsx`
  3. Add bezier branch to path resolution block
  4. Add `bezier` to `connectionLineTypeMap` in `canvas.tsx`
  5. Build check · Commit

- [ ] #spec **Task 2: CanvasEdgeData type + path helper**

  1. Add `bendPoint` field to `CanvasEdgeData` in `types/canvas.ts`
  2. Add `resolvePath` helper above `CanvasEdgeRenderer`
  3. Replace path resolution block with `resolvePath` call
  4. Build check · Commit

- [ ] #spec **Task 3: Midpoint drag handle**

  1. Add `screenToFlowPosition` to `useReactFlow` destructure
  2. Add `bendDragRef` state ref
  3. Add pointer event handlers (`Down`, `Move`, `Up`, `Reset`)
  4. Render handle circle in SVG when `selected`
  5. Manual verify · Commit

- [x] #spec **Task 4: DragEdgeContext**

  1. [x] Create `drag-edge-context.tsx` with provider and hook
  2. [x] Wrap `ReactFlowProvider` with `DragEdgeProvider` in `canvas-wrapper.tsx`
  3. [x] Build check · Commit

- [x] #spec **Task 5: Edge hit detection + highlight feedback**

  1. [x] Add `@keyframes ghost-dash` to `globals.css`
  2. [x] Add `data-edgeid` attribute to hit-area path
  3. [x] Read `DragEdgeContext` in `CanvasEdgeRenderer`
  4. [x] Apply dashed highlight to visible path when `isDragTarget`
  5. [x] Render "Insert here" label via `EdgeLabelRenderer`
  6. [x] Add `dragOverEdgeId` ref + `onDragOver` edge detection in `canvas.tsx`
  7. [x] Add `onDragLeave` handler
  8. Manual verify · Commit

- [ ] #spec **Task 6: Drop-onto-edge split logic**

  1. Add split logic to `onDrop` in `canvas.tsx`
  2. Build check
  3. Manual verify: basic split, label inheritance, undo, collaborator safety
  4. Commit

## Check when done

- [ ] Settings modal shows four routing options: Smoothstep, Step, Straight, Bezier — all switch the canvas edges and the connection preview line
- [ ] Selecting an edge shows a cyan midpoint handle; dragging reshapes the path for all four routing types; double-clicking the handle resets the path
- [ ] `bendPoint` persists in Liveblocks — a second browser tab sees the bent edge
- [ ] Dragging a shape over an edge highlights it with a bright dashed stroke and "Insert here" label; releasing drops the shape and splits the edge into two
- [ ] Both split edges carry the original edge's label
- [ ] Ctrl+Z after a split restores the original edge
- [ ] `npm run build` passes without type errors

---

_Tracked in [[progress-tracker]]_
