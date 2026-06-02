---
type: feature-spec
feature: "11 — Base Canvas"
status: shipped
updated: 2026-05-23
---

# Feature 11 — Base Canvas

> [!abstract] Goal
> Replace the canvas placeholder with a Liveblocks-backed React Flow canvas.

> [!success] Shipped
> Canvas wrapper, Liveblocks room setup, shared types, and React Flow syncing all working. Build passes.

**References:** [[architecture-context]] · [[ui-context]] · [[code-standards]]

---

## Implementation

- [x] Keep the workspace page server-side
- [x] Create a client-side canvas wrapper that sets up the Liveblocks room
  - [x] `LiveblocksProvider` using `/api/liveblocks-auth`
  - [x] `RoomProvider` using current room ID
  - [x] initial presence with `cursor: null`
  - [x] `ClientSideSuspense` with a simple loading state
  - [x] error fallback for Liveblocks connection issues
- [x] Wire React Flow to Liveblocks state
  - [x] use `useLiveblocksFlow`
  - [x] enable suspense
  - [x] start with empty nodes and edges
  - [x] pass the synced nodes, edges, and change handlers into `ReactFlow`
- [x] Add shared canvas types in `types/canvas.ts`
  - [x] Node data supports: label, color, shape
  - [x] Custom node and edge types: `canvasNode`, `canvasEdge`
- [x] Render the basic canvas
  - [x] loose connection behavior
  - [x] `fitView`
  - [x] `MiniMap`
  - [x] dot-pattern background

## Scope

Do not add controls, custom node/edge rendering, persistence logic, or AI behavior yet.

## Check when done

- [x] client canvas wrapper sets up the Liveblocks room
- [x] React Flow uses Liveblocks-synced nodes and edges
- [x] shared canvas types exist in `types/canvas.ts`
- [x] `npm run build` passes

---

_Tracked in [[progress-tracker]]_
