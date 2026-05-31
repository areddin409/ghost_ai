---
type: feature-spec
feature: "19 — Edge Reconnect"
status: shipped
updated: 2026-05-30
---

# Feature 19 — Edge Reconnect

> [!abstract] Goal
> Let users drag an existing edge endpoint to a different node (reconnect) or drop it on empty canvas to delete the edge (undoable via Ctrl+Z).

**References:** [[architecture-context]] · [[code-standards]]

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Architecture:** React Flow v12's native reconnect API is used — three callbacks (`onReconnectStart`, `onReconnect`, `onReconnectEnd`) plus `edgesReconnectable` on `<ReactFlow>`. A `useRef<boolean>` tracks whether the current drag landed on a valid handle. All edge changes route through `useLiveblocksFlow`'s `onEdgesChange` so Liveblocks records them in undo history. A two-rule CSS block in `globals.css` makes the endpoint circles visible on hover.

**Tech Stack:** `@xyflow/react` v12, `@liveblocks/react-flow`, React `useRef` / `useCallback`

---

## Scope

- Touch only `components/editor/canvas.tsx` and `app/globals.css`
- Do not modify `CanvasEdgeRenderer` in `canvas-edge.tsx`
- Do not change connection creation, node editing, or any other canvas behaviour

---

## Implementation

### Task 1: Add reconnect callbacks to canvas.tsx

**Files:**
- Modify: `components/editor/canvas.tsx`

- [x] **Step 1: Add imports**

Open `components/editor/canvas.tsx`. The current `@xyflow/react` import block is:

```tsx
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  ConnectionMode,
  ConnectionLineType,
  useReactFlow,
  useStore,
  type NodeTypes,
  type MiniMapNodeProps
} from "@xyflow/react"
```

Replace it with:

```tsx
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  ConnectionMode,
  ConnectionLineType,
  useReactFlow,
  useStore,
  type NodeTypes,
  type MiniMapNodeProps,
  type Connection,
} from "@xyflow/react"
```

Also add `useRef` and `useCallback` to the React import. The current import is:

```tsx
import { useEffect, useRef } from "react"
```

Replace with:

```tsx
import { useCallback, useEffect, useRef } from "react"
```

- [x] **Step 2: Add reconnect success ref and handlers**

Inside the `Canvas` function body, directly after the `useKeyboardShortcuts` call, add:

```tsx
const reconnectSuccessRef = useRef(false)

const handleReconnectStart = useCallback(() => {
  reconnectSuccessRef.current = false
}, [])

const handleReconnect = useCallback(
  (oldEdge: CanvasEdge, newConnection: Connection) => {
    reconnectSuccessRef.current = true
    const newEdge: CanvasEdge = {
      ...oldEdge,
      source: newConnection.source,
      target: newConnection.target,
      sourceHandle: newConnection.sourceHandle ?? null,
      targetHandle: newConnection.targetHandle ?? null,
    }
    onEdgesChange([
      { type: "remove", id: oldEdge.id },
      { type: "add", item: newEdge },
    ])
  },
  [onEdgesChange]
)

const handleReconnectEnd = useCallback(
  (_event: MouseEvent | TouchEvent, edge: CanvasEdge) => {
    if (!reconnectSuccessRef.current) {
      onEdgesChange([{ type: "remove", id: edge.id }])
    }
  },
  [onEdgesChange]
)
```

- [x] **Step 3: Wire props onto `<ReactFlow>`**

In the JSX, the `<ReactFlow>` opening tag currently ends before `connectionMode`. Add four props after `onDelete`:

```tsx
onDelete={onDelete}
edgesReconnectable
onReconnectStart={handleReconnectStart}
onReconnect={handleReconnect}
onReconnectEnd={handleReconnectEnd}
```

The full `<ReactFlow>` tag should look like:

```tsx
<ReactFlow
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}
  onDelete={onDelete}
  edgesReconnectable
  onReconnectStart={handleReconnectStart}
  onReconnect={handleReconnect}
  onReconnectEnd={handleReconnectEnd}
  nodeTypes={nodeTypes}
  edgeTypes={edgeTypes}
  defaultEdgeOptions={defaultEdgeOptions}
  connectionMode={ConnectionMode.Loose}
  connectionLineType={ConnectionLineType.SmoothStep}
  connectionLineStyle={{ stroke: "rgba(248,250,252,0.35)", strokeWidth: 1.5 }}
  colorMode="dark"
  fitView
>
```

- [x] **Step 4: Verify build passes**

```bash
npm run build
```

Expected: no TypeScript errors, successful build.

- [x] **Step 5: Commit**

```bash
git add components/editor/canvas.tsx
git commit -m "feat: add edge reconnect and delete-by-drop"
```

---

### Task 2: Style the reconnect anchor circles

React Flow renders a transparent `<circle r="10">` at each edge endpoint (class `.react-flow__edgeupdater`). By default these are invisible. This task makes them appear as subtle dots when the user's cursor is over the endpoint, signalling draggability.

**Files:**
- Modify: `app/globals.css`

- [x] **Step 1: Add CSS rules**

Append the following block to the very end of `app/globals.css`, **after** the closing `}` of the `:root` block (these are element selectors, not CSS variables, so they must live outside `:root`):

```css
/* Edge reconnect anchors */
.react-flow__edgeupdater {
  transition: fill 0.15s;
}
.react-flow__edge.updating .react-flow__edgeupdater {
  fill: rgba(248, 250, 252, 0.35);
}
.react-flow__edgeupdater:hover {
  fill: rgba(248, 250, 252, 0.85);
}
```

The `.react-flow__edge.updating` class is added by React Flow when the cursor enters an anchor hit area — this controls when the dot becomes visible. The `:hover` rule brightens it on direct cursor contact, matching the existing edge active color.

- [x] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: no errors.

- [x] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: show edge reconnect anchor dots on hover"
```

---

## Check when done

- [x] Hovering an existing edge endpoint shows a faint dot; moving over it directly brightens the dot and shows a move cursor
- [x] Dragging an edge endpoint and dropping it on a different node handle rewires the connection to the new target
- [x] The rewired edge retains its label and data
- [x] Dragging an edge endpoint and releasing it on empty canvas deletes the edge
- [x] Dragging an edge endpoint and releasing it on an invalid target (wrong handle type, same node) also deletes the edge
- [x] Ctrl+Z after either a rewire or a delete restores the original edge
- [x] `npm run build` passes without type errors

---

_Tracked in [[progress-tracker]]_
