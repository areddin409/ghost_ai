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

### Task 1: Bezier routing option

**Files:**
- Modify: `components/editor/user-settings-modal.tsx`
- Modify: `components/editor/canvas/canvas-edge.tsx`
- Modify: `components/editor/canvas/canvas.tsx`

- [x] **Step 1: Add "bezier" to settings options**

In `components/editor/user-settings-modal.tsx`, update line 17:

```ts
const EDGE_ROUTING_OPTIONS = ["smoothstep", "step", "straight", "bezier"] as const
```

- [x] **Step 2: Add getBezierPath import to canvas-edge.tsx**

In `components/editor/canvas/canvas-edge.tsx`, update the `@xyflow/react` import to include `getBezierPath`:

```ts
import {
  EdgeLabelRenderer,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react"
```

- [x] **Step 3: Add bezier to the path resolution block in canvas-edge.tsx**

Replace the existing path resolution block (lines ~36–42):

```ts
const pathArgs = { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition }
const [edgePath, labelX, labelY] =
  settings.edgeRouting === "straight"
    ? getStraightPath(pathArgs)
    : settings.edgeRouting === "step"
      ? getSmoothStepPath({ ...pathArgs, borderRadius: 0 })
      : getSmoothStepPath(pathArgs)
```

With:

```ts
const pathArgs = { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition }
const [edgePath, labelX, labelY] =
  settings.edgeRouting === "straight"
    ? getStraightPath(pathArgs)
    : settings.edgeRouting === "step"
      ? getSmoothStepPath({ ...pathArgs, borderRadius: 0 })
      : settings.edgeRouting === "bezier"
        ? getBezierPath(pathArgs)
        : getSmoothStepPath(pathArgs)
```

- [x] **Step 4: Add bezier to connectionLineTypeMap in canvas.tsx**

In `components/editor/canvas/canvas.tsx`, update `connectionLineTypeMap`:

```ts
const connectionLineTypeMap = {
  smoothstep: ConnectionLineType.SmoothStep,
  step: ConnectionLineType.Step,
  straight: ConnectionLineType.Straight,
  bezier: ConnectionLineType.Bezier,
} as const
```

- [x] **Step 5: Build check**

```bash
cd "d:/Web Dev/2026/ghost_ai" && npm run build
```

Expected: build passes with no type errors.

- [x] **Step 6: Commit**

```bash
git add components/editor/canvas/canvas-edge.tsx components/editor/canvas/canvas.tsx components/editor/user-settings-modal.tsx
git commit -m "feat: add bezier edge routing option"
```

---

### Task 2: CanvasEdgeData type + path helper

**Files:**
- Modify: `types/canvas.ts`
- Modify: `components/editor/canvas/canvas-edge.tsx`

- [x] **Step 1: Add bendPoint to CanvasEdgeData** ➕ 2026-06-01 ✅ 2026-06-01

In `types/canvas.ts`, update `CanvasEdgeData`:

```ts
export type CanvasEdgeData = {
  label?: string
  bendPoint?: { x: number; y: number }
}
```

- [x] **Step 2: Add resolvePath helper above the component in canvas-edge.tsx**

Insert this pure function directly above the `CanvasEdgeRenderer` function declaration:

```ts
type PathArgs = {
  sourceX: number
  sourceY: number
  sourcePosition: Position
  targetX: number
  targetY: number
  targetPosition: Position
}

function resolvePath(
  routing: string,
  args: PathArgs,
  bp: { x: number; y: number } | null
): [string, number, number] {
  if (bp) {
    // When a bend point is set, construct the path to route through it
    if (routing === "bezier") {
      // Quadratic bezier: control point = bend point
      return [
        `M ${args.sourceX},${args.sourceY} Q ${bp.x},${bp.y} ${args.targetX},${args.targetY}`,
        bp.x,
        bp.y,
      ]
    }
    if (routing === "straight") {
      // Two-segment polyline through the bend point
      return [
        `M ${args.sourceX},${args.sourceY} L ${bp.x},${bp.y} L ${args.targetX},${args.targetY}`,
        bp.x,
        bp.y,
      ]
    }
    if (routing === "step") {
      const [p] = getSmoothStepPath({ ...args, borderRadius: 0, centerX: bp.x, centerY: bp.y })
      return [p, bp.x, bp.y]
    }
    // smoothstep (default)
    const [p] = getSmoothStepPath({ ...args, centerX: bp.x, centerY: bp.y })
    return [p, bp.x, bp.y]
  }

  // No bend — default path for each routing type
  if (routing === "straight") return getStraightPath(args)
  if (routing === "step") return getSmoothStepPath({ ...args, borderRadius: 0 })
  if (routing === "bezier") return getBezierPath(args)
  return getSmoothStepPath(args) // smoothstep default
}
```

You will also need to import `Position` from `@xyflow/react`. Add it to the existing import:

```ts
import {
  EdgeLabelRenderer,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  useReactFlow,
  type EdgeProps,
  type Position,
} from "@xyflow/react"
```

- [x] **Step 3: Use resolvePath in CanvasEdgeRenderer**

Replace the current path resolution block inside `CanvasEdgeRenderer` (which now just has the bezier branch from Task 1) with a call to `resolvePath`:

```ts
const bendPoint = data?.bendPoint ?? null
const pathArgs: PathArgs = { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition }
const [edgePath, labelX, labelY] = resolvePath(settings.edgeRouting, pathArgs, bendPoint)
```

Remove the standalone `const pathArgs = ...` line that previously existed — it is now inside the `pathArgs` const above.

- [x] **Step 4: Build check**

```bash
npm run build
```

Expected: passes. `CanvasEdgeData` with `bendPoint` is typed correctly throughout — `updateEdgeData` infers the type from the `CanvasEdge` generic.

- [x] **Step 5: Commit**

```bash
git add types/canvas.ts components/editor/canvas/canvas-edge.tsx
git commit -m "feat: add bendPoint to edge data and resolvePath helper"
```

---

### Task 3: Midpoint drag handle

**Files:**
- Modify: `components/editor/canvas/canvas-edge.tsx`

- [ ] **Step 1: Add screenToFlowPosition to the useReactFlow destructure**

In `CanvasEdgeRenderer`, update the existing `useReactFlow` call:

```ts
const { updateEdgeData, screenToFlowPosition } = useReactFlow()
```

- [ ] **Step 2: Add drag state ref**

Inside `CanvasEdgeRenderer`, below the existing refs and state, add:

```ts
const bendDragRef = useRef<{
  startClient: { x: number; y: number }
  startBend: { x: number; y: number }
} | null>(null)
```

- [ ] **Step 3: Add pointer event handlers**

Inside `CanvasEdgeRenderer`, after `bendDragRef`:

```ts
function handleBendPointerDown(e: React.PointerEvent<SVGCircleElement>) {
  e.stopPropagation()
  e.currentTarget.setPointerCapture(e.pointerId)
  bendDragRef.current = {
    startClient: { x: e.clientX, y: e.clientY },
    startBend: bendPoint ?? { x: labelX, y: labelY },
  }
}

function handleBendPointerMove(e: React.PointerEvent<SVGCircleElement>) {
  if (!bendDragRef.current) return
  e.stopPropagation()
  const cur = screenToFlowPosition({ x: e.clientX, y: e.clientY })
  const start = screenToFlowPosition({
    x: bendDragRef.current.startClient.x,
    y: bendDragRef.current.startClient.y,
  })
  updateEdgeData(id, {
    bendPoint: {
      x: bendDragRef.current.startBend.x + (cur.x - start.x),
      y: bendDragRef.current.startBend.y + (cur.y - start.y),
    },
  })
}

function handleBendPointerUp() {
  bendDragRef.current = null
}

function handleBendReset(e: React.MouseEvent) {
  e.stopPropagation()
  updateEdgeData(id, { bendPoint: undefined })
}
```

- [ ] **Step 4: Render the handle in the SVG**

In the JSX returned by `CanvasEdgeRenderer`, add the following after the visible edge `<path>` and before `<EdgeLabelRenderer>`:

```tsx
{selected && (
  <circle
    cx={bendPoint ? bendPoint.x : labelX}
    cy={bendPoint ? bendPoint.y : labelY}
    r={8}
    fill={bendPoint ? "#00c8d4" : "rgba(0,200,212,0.4)"}
    stroke="rgba(255,255,255,0.8)"
    strokeWidth={1.5}
    style={{ pointerEvents: "all", cursor: "grab" }}
    onPointerDown={handleBendPointerDown}
    onPointerMove={handleBendPointerMove}
    onPointerUp={handleBendPointerUp}
    onDoubleClick={handleBendReset}
  />
)}
```

The handle is a faint cyan ring when `bendPoint` is null (no override yet) and becomes solid cyan once the user has dragged it.

- [ ] **Step 5: Build check**

```bash
npm run build
```

Expected: passes.

- [ ] **Step 6: Manual verify**

Run `npm run dev`. Open a canvas room. Draw two connected nodes. Select the edge — a faint cyan circle appears at its midpoint. Drag it — the path reshapes. Double-click the handle — path resets. Open Settings and switch routing type — the handle still appears at the correct midpoint for each routing type.

- [ ] **Step 7: Commit**

```bash
git add components/editor/canvas/canvas-edge.tsx
git commit -m "feat: add per-edge midpoint drag handle with bendPoint sync"
```

---

### Task 4: DragEdgeContext

**Files:**
- Create: `components/editor/canvas/drag-edge-context.tsx`
- Modify: `components/editor/canvas/canvas-wrapper.tsx`

- [ ] **Step 1: Create drag-edge-context.tsx**

```ts
// components/editor/canvas/drag-edge-context.tsx
"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface DragEdgeContextValue {
  dragOverEdgeId: string | null
  setDragOverEdgeId: (id: string | null) => void
}

const DragEdgeContext = createContext<DragEdgeContextValue | null>(null)

export function DragEdgeProvider({ children }: { children: ReactNode }) {
  const [dragOverEdgeId, setDragOverEdgeId] = useState<string | null>(null)
  return (
    <DragEdgeContext.Provider value={{ dragOverEdgeId, setDragOverEdgeId }}>
      {children}
    </DragEdgeContext.Provider>
  )
}

export function useDragEdge(): DragEdgeContextValue {
  const ctx = useContext(DragEdgeContext)
  if (!ctx) throw new Error("useDragEdge must be used within DragEdgeProvider")
  return ctx
}
```

- [ ] **Step 2: Wrap ReactFlowProvider with DragEdgeProvider in canvas-wrapper.tsx**

In `components/editor/canvas/canvas-wrapper.tsx`, import `DragEdgeProvider` and wrap `ReactFlowProvider`:

```ts
import { DragEdgeProvider } from "./drag-edge-context"
```

Update the JSX inside `CanvasWrapper` — wrap `ReactFlowProvider` (and its children) with `DragEdgeProvider`:

```tsx
<CanvasErrorBoundary>
  <ClientSideSuspense fallback={<CanvasLoading />}>
    <DragEdgeProvider>
      <ReactFlowProvider>
        <Canvas />
      </ReactFlowProvider>
    </DragEdgeProvider>
  </ClientSideSuspense>
</CanvasErrorBoundary>
```

- [ ] **Step 3: Build check**

```bash
npm run build
```

Expected: passes. Context is defined but not yet consumed — no visible change yet.

- [ ] **Step 4: Commit**

```bash
git add components/editor/canvas/drag-edge-context.tsx components/editor/canvas/canvas-wrapper.tsx
git commit -m "feat: add DragEdgeContext for drop-onto-edge hover state"
```

---

### Task 5: Edge hit detection + highlight feedback

**Files:**
- Modify: `components/editor/canvas/canvas-edge.tsx`
- Modify: `components/editor/canvas/canvas.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add the dash-flow animation to globals.css**

At the end of `app/globals.css`, append:

```css
@keyframes ghost-dash {
  to { stroke-dashoffset: -18; }
}
```

- [ ] **Step 2: Add data-edgeid to the hit-area path in canvas-edge.tsx**

In `CanvasEdgeRenderer`, find the wide transparent hit-area `<path>` (the one with `stroke="transparent"` and `strokeWidth={16}`). Add the `data-edgeid` attribute:

```tsx
<path
  data-edgeid={id}
  d={edgePath}
  fill="none"
  stroke="transparent"
  strokeWidth={16}
  style={{ cursor: "pointer" }}
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
  onDoubleClick={(e) => {
    e.stopPropagation()
    openEditor()
  }}
/>
```

- [ ] **Step 3: Read DragEdgeContext in CanvasEdgeRenderer**

Add the import at the top of `canvas-edge.tsx`:

```ts
import { useDragEdge } from "./drag-edge-context"
```

Inside `CanvasEdgeRenderer`, after the existing hooks, add:

```ts
const { dragOverEdgeId } = useDragEdge()
const isDragTarget = dragOverEdgeId === id
```

- [ ] **Step 4: Apply dashed highlight to the visible path**

Find the visible edge `<path>` (the one with `stroke={edgeColor}` and `strokeWidth={STROKE_WIDTH}`). Replace it with a version that changes style when `isDragTarget`:

```tsx
<path
  d={edgePath}
  fill="none"
  stroke={isDragTarget ? "rgba(248,250,252,0.95)" : edgeColor}
  strokeWidth={isDragTarget ? 2.5 : STROKE_WIDTH}
  strokeLinecap="round"
  strokeDasharray={isDragTarget ? "6,3" : undefined}
  markerEnd={`url(#arrow-${id})`}
  style={{
    pointerEvents: "none",
    transition: isDragTarget ? "none" : "stroke 0.15s",
    animation: isDragTarget ? "ghost-dash 0.4s linear infinite" : undefined,
    strokeDashoffset: isDragTarget ? 0 : undefined,
  }}
/>
```

- [ ] **Step 5: Render "Insert here" label via EdgeLabelRenderer**

Replace the entire `<EdgeLabelRenderer>` block in `CanvasEdgeRenderer` with the following. The `isDragTarget` branch is added at the top and takes priority over all other label states. Everything else is unchanged from the original:

```tsx
<EdgeLabelRenderer>
  <div
    style={{
      position: "absolute",
      transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
      pointerEvents: "all",
    }}
    className="nodrag nopan"
  >
    {isDragTarget ? (
      <div
        style={{
          padding: "2px 10px",
          background: "#111114",
          border: "1px solid rgba(248,250,252,0.5)",
          borderRadius: 9999,
          color: "rgba(248,250,252,0.9)",
          fontSize: "0.75rem",
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        Insert here
      </div>
    ) : editing ? (
      <input
        ref={inputRef}
        autoFocus
        value={editValue}
        className="nodrag nopan"
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={() => commit(editValue)}
        onKeyDown={(e) => {
          e.stopPropagation()
          if (e.key === "Enter" || e.key === "Escape") {
            e.preventDefault()
            commit(editValue)
          }
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        placeholder="Add label…"
        style={{
          background: "#111114",
          border: "1px solid #2a2a30",
          borderRadius: 9999,
          outline: "none",
          color: COLOR_ACTIVE,
          fontSize: "0.75rem",
          textAlign: "center",
          padding: "2px 10px",
          minWidth: 60,
          width: `${Math.max((editValue.length + 4) * 7.5, 70)}px`,
          fontFamily: "inherit",
        }}
      />
    ) : label?.trim() ? (
      <div
        onDoubleClick={(e) => {
          e.stopPropagation()
          openEditor()
        }}
        style={{
          padding: "2px 10px",
          background: "#111114",
          border: "1px solid #2a2a30",
          borderRadius: 9999,
          color: COLOR_ACTIVE,
          fontSize: "0.75rem",
          whiteSpace: "nowrap",
          cursor: "text",
          userSelect: "none",
        }}
      >
        {label}
      </div>
    ) : isActive ? (
      <div
        onDoubleClick={(e) => {
          e.stopPropagation()
          openEditor()
        }}
        style={{
          padding: "2px 10px",
          color: COLOR_REST,
          fontSize: "0.75rem",
          cursor: "text",
          userSelect: "none",
          borderRadius: 9999,
        }}
      >
        Add label…
      </div>
    ) : null}
  </div>
</EdgeLabelRenderer>
```

- [ ] **Step 6: Add dragOverEdgeId state + ref in canvas.tsx**

In `components/editor/canvas/canvas.tsx`, import the context hook:

```ts
import { useDragEdge } from "./drag-edge-context"
```

Inside the `Canvas` function, after the existing hooks, add:

```ts
const { setDragOverEdgeId } = useDragEdge()
const dragOverEdgeIdRef = useRef<string | null>(null)
```

- [ ] **Step 7: Update onDragOver to detect hovered edge**

In the `useEffect` that registers DOM event listeners, update the `onDragOver` function:

```ts
function onDragOver(e: DragEvent) {
  const types = e.dataTransfer?.types
  if (!types || !Array.from(types).includes("application/ghost-shape")) return
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = "copy"

  // Detect if cursor is over an edge hit area
  const els = document.elementsFromPoint(e.clientX, e.clientY)
  const edgeEl = els.find((el) => el.hasAttribute("data-edgeid"))
  const hoveredId = edgeEl?.getAttribute("data-edgeid") ?? null
  if (hoveredId !== dragOverEdgeIdRef.current) {
    dragOverEdgeIdRef.current = hoveredId
    setDragOverEdgeId(hoveredId)
  }
}
```

- [ ] **Step 8: Add dragleave handler to clear hover state**

In the same `useEffect`, add a `onDragLeave` handler and register it:

```ts
function onDragLeave(e: DragEvent) {
  // Only clear when leaving the canvas DOM node itself (not a child)
  if (!domNode?.contains(e.relatedTarget as Node | null)) {
    dragOverEdgeIdRef.current = null
    setDragOverEdgeId(null)
  }
}
```

Register and deregister it alongside the existing listeners:

```ts
domNode.addEventListener("dragover", onDragOver)
domNode.addEventListener("dragleave", onDragLeave)
domNode.addEventListener("drop", onDrop)
// …
return () => {
  domNode.removeEventListener("dragover", onDragOver)
  domNode.removeEventListener("dragleave", onDragLeave)
  domNode.removeEventListener("drop", onDrop)
  // …
}
```

- [ ] **Step 9: Build check**

```bash
npm run build
```

Expected: passes.

- [ ] **Step 10: Manual verify**

Run `npm run dev`. Connect two nodes with an edge. Drag a shape from the panel over the edge — the edge goes bright white dashed with "Insert here" at its midpoint. Move the shape off the edge — edge returns to normal.

- [ ] **Step 11: Commit**

```bash
git add app/globals.css components/editor/canvas/canvas-edge.tsx components/editor/canvas/canvas.tsx
git commit -m "feat: edge hover detection and dashed highlight feedback during shape drag"
```

---

### Task 6: Drop-onto-edge split logic

**Files:**
- Modify: `components/editor/canvas/canvas.tsx`

- [ ] **Step 1: Add split logic to onDrop in canvas.tsx**

In the `useEffect`, find the `onDrop` function. At the very start of `onDrop`, before the existing shape-data parsing, add the edge-split path:

```ts
function onDrop(e: DragEvent) {
  e.preventDefault()

  // Clear drag-over-edge hover state immediately
  const splitEdgeId = dragOverEdgeIdRef.current
  dragOverEdgeIdRef.current = null
  setDragOverEdgeId(null)

  const raw = e.dataTransfer?.getData("application/ghost-shape")
  if (!raw) return

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return
  }

  if (!parsed || typeof parsed !== "object") return
  const { shape, width, height } = parsed as Record<string, unknown>

  if (typeof shape !== "string" || !(shape in DEFAULT_NODE_SIZES)) return
  const nodeShape = shape as NodeShape
  const defaults = DEFAULT_NODE_SIZES[nodeShape]
  const w =
    Number.isFinite(width) && (width as number) > 0
      ? (width as number)
      : defaults.width
  const h =
    Number.isFinite(height) && (height as number) > 0
      ? (height as number)
      : defaults.height

  const position = screenToFlowPositionRef.current({
    x: e.clientX - w / 2,
    y: e.clientY - h / 2,
  })
  const newId = crypto.randomUUID()

  const newNode: CanvasNode = {
    id: newId,
    type: "canvasNode",
    position,
    data: {
      label: "",
      color: settingsRef.current.defaultNodeColor,
      shape: settingsRef.current.defaultNodeShape as NodeShape,
    },
    width: w,
    height: h,
  }

  onNodesChangeRef.current([{ type: "add", item: newNode }])

  // If hovering over an edge, split it
  if (splitEdgeId) {
    const original = edgesRef.current.find((ed) => ed.id === splitEdgeId)
    if (original) {
      const sharedLabel = original.data?.label

      onDeleteRef.current({ nodes: [], edges: [original] })

      const edge1: CanvasEdge = {
        id: crypto.randomUUID(),
        type: "canvasEdge",
        source: original.source,
        sourceHandle: original.sourceHandle ?? null,
        target: newId,
        targetHandle: "left",
        data: { label: sharedLabel },
      }
      const edge2: CanvasEdge = {
        id: crypto.randomUUID(),
        type: "canvasEdge",
        source: newId,
        sourceHandle: "right",
        target: original.target,
        targetHandle: original.targetHandle ?? null,
        data: { label: sharedLabel },
      }
      onEdgesChangeRef.current([
        { type: "add", item: edge1 },
        { type: "add", item: edge2 },
      ])
      return
    }
    // Edge was deleted mid-drag (e.g. by a collaborator) — fall through to plain placement
  }
}
```

> [!note] Structure
> The existing `onDrop` body is replaced in full above. The node creation logic is preserved verbatim — only the edge-split block and the `splitEdgeId` preamble are new. The `return` inside the `if (original)` block prevents the caller from doing anything after the split. The fall-through case (edge deleted mid-drag) lands naturally at the end of the function with the node already placed.

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: passes with no type errors. Verify that `CanvasEdge` is imported in `canvas.tsx` (it should already be, from `@/types/canvas`).

- [ ] **Step 3: Manual verify — basic split**

Run `npm run dev`. Connect node A to node B with an edge. Drag a new shape from the panel and hover over the edge (confirm dashed highlight appears). Drop — a new node is created, the original edge is replaced by two edges connecting A → New → B.

- [ ] **Step 4: Manual verify — label inheritance**

Double-click the A → B edge and give it a label (e.g. "calls"). Now drag a new shape onto that edge. Confirm both resulting edges show the "calls" label.

- [ ] **Step 5: Manual verify — undo**

After splitting, press Ctrl+Z. The two new edges and new node should be removed and the original edge restored (all operations went through `useLiveblocksFlow`, so they are in Liveblocks undo history).

- [ ] **Step 6: Manual verify — collaborator safety**

In two browser tabs sharing the same room, delete the edge in tab 2 while dragging a shape over it in tab 1. Drop in tab 1 — the new node is placed but no split occurs (the original edge is gone — the fallback path fires).

- [ ] **Step 7: Commit**

```bash
git add components/editor/canvas/canvas.tsx
git commit -m "feat: drop-onto-edge splits connection and inherits label on both halves"
```

---

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
