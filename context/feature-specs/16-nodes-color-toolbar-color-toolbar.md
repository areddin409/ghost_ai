---
type: feature-spec
feature: "16 — nodes color toolbar"
status: shipped
updated: 2026-05-30
---

# Feature 16 — nodes color toolbar

> [!abstract] Goal
> Add a small floating color toolbar so selected nodes can change both their background and text color directly on the canvas.

**References:** [[architecture-context]] · [[code-standards]]

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Architecture:** The toolbar renders inside the node component as an absolutely-positioned overlay (`bottom: calc(100% + 8px)`) visible only when `selected` is true. Color selection calls `updateNodeData` with both `color` and `textColor` fields, routing through React Flow's BatchProvider → `onNodesChange` → `useLiveblocksFlow` — no direct server calls.

**Tech Stack:** React, React Flow (`@xyflow/react`), Liveblocks (`useLiveblocksFlow`), TypeScript — all already in use.

---

## Scope

- Don't change drag/drop behavior
- Don't rebuild node selection logic
- Don't add a full color picker
- Keep this focused on predefined color themes only

## Implementation

### Task 1: Add `textColor` to `CanvasNodeData`

**Files:**
- Modify: `types/canvas.ts`

- [x] **Step 1: Add `textColor` field to `CanvasNodeData`**

  `NODE_COLORS` already exists in `types/canvas.ts` and the 8 color pairs are already defined in `context/ui-context.md`. Reuse that constant — no new colors needed.

  Update `CanvasNodeData`:

  ```ts
  export type CanvasNodeData = {
    label: string;
    color?: string;
    textColor?: string;
    shape?: NodeShape;
  };
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add types/canvas.ts
  git commit -m "feat: add textColor field to CanvasNodeData"
  ```

---

### Task 2: Create `NodeColorToolbar` component

**Files:**
- Create: `components/editor/node-color-toolbar.tsx`

- [x] **Step 1: Create the toolbar file**

  ```tsx
  "use client"

  import { useState } from "react"
  import { NODE_COLORS } from "@/types/canvas"

  interface NodeColorToolbarProps {
    currentFill: string
    onSelect: (fill: string, text: string) => void
  }

  export function NodeColorToolbar({ currentFill, onSelect }: NodeColorToolbarProps) {
    return (
      <div
        className="nodrag nopan"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          bottom: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 4,
          alignItems: "center",
          background: "#18181c",
          border: "1px solid #2a2a30",
          borderRadius: 10,
          padding: "6px 8px",
          zIndex: 10,
          pointerEvents: "all",
        }}
      >
        {NODE_COLORS.map(({ fill, text }) => (
          <Swatch
            key={fill}
            fill={fill}
            text={text}
            isActive={fill === currentFill}
            onSelect={onSelect}
          />
        ))}
      </div>
    )
  }

  function Swatch({
    fill,
    text,
    isActive,
    onSelect,
  }: {
    fill: string
    text: string
    isActive: boolean
    onSelect: (fill: string, text: string) => void
  }) {
    const [hovered, setHovered] = useState(false)

    return (
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(fill, text)
        }}
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: fill,
          border: isActive
            ? "2px solid #f0f0f4"
            : "1.5px solid rgba(255,255,255,0.18)",
          boxShadow: isActive
            ? "0 0 0 2px rgba(240,240,244,0.25)"
            : hovered
              ? `0 0 6px 0px ${text}b3`
              : "none",
          cursor: "pointer",
          padding: 0,
          outline: "none",
          flexShrink: 0,
          transition: "box-shadow 0.15s, border-color 0.15s",
        }}
      />
    )
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add components/editor/node-color-toolbar.tsx
  git commit -m "feat: add NodeColorToolbar component with 8 color swatches"
  ```

---

### Task 3: Update `CanvasNodeRenderer` — dynamic text color + render toolbar

**Files:**
- Modify: `components/editor/canvas-node.tsx`

- [x] **Step 1: Import `NodeColorToolbar`**

  ```ts
  import { NodeColorToolbar } from "./node-color-toolbar"
  ```

- [x] **Step 2: Destructure `textColor`, compute resolved text color, add handler**

  Update the data block at the top of `CanvasNodeRenderer`:

  ```ts
  const { label, color, shape, textColor } = data
  const nodeShape: NodeShape = shape ?? "rectangle"
  const bg = color ?? DEFAULT_NODE_COLOR.fill
  const resolvedTextColor = textColor ?? DEFAULT_NODE_COLOR.text
  ```

  After `const { updateNodeData } = useReactFlow()`, add:

  ```ts
  const handleColorSelect = (fill: string, text: string) => {
    updateNodeData(id, { color: fill, textColor: text })
  }
  ```

- [x] **Step 3: Add toolbar variable**

  After the `resizerProps` / `handleStyle` block, add:

  ```tsx
  const colorToolbar = selected ? (
    <NodeColorToolbar currentFill={bg} onSelect={handleColorSelect} />
  ) : null
  ```

- [x] **Step 4: Replace hardcoded `DEFAULT_NODE_COLOR.text` with `resolvedTextColor`**

  In the `labelEl` block, both the editing div's `color` style and the display div's `color` style currently use `DEFAULT_NODE_COLOR.text`. Replace both with `resolvedTextColor`.

- [x] **Step 5: Add `{colorToolbar}` to both render branches**

  Rectangle / pill / circle branch: add `{colorToolbar}` inside the outer div.

  Diamond / hexagon / cylinder branch: add `{colorToolbar}` inside the outer div.

- [x] **Step 6: Verify build**

  ```bash
  npm run build
  ```

  Expected: exit 0, no TypeScript errors.

- [x] **Step 7: Commit**

  ```bash
  git add components/editor/canvas-node.tsx
  git commit -m "feat: render color toolbar on selected nodes, apply dynamic text color"
  ```

---
### Validation
![[Pasted image 20260530161140.png]]
![[Pasted image 20260530161059.png]]
## Check when done

- [x] `npm run build` passes
- [x] Nodes use predefined background/text color pairs
- [x] Selected nodes show a floating color toolbar
- [x] Swatch selection updates both node background and text color

---

_Tracked in [[progress-tracker]]_
