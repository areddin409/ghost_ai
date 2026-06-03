---
type: spec
id: 25
title: Canvas Presence — Participant Avatars and Live Cursors
status: shipped
phase: 1
updated: 2026-06-02
---

# Spec 25 — Canvas Presence — Participant Avatars and Live Cursors

> [!abstract] Goal
> Show active room participants inside the editor canvas view — as an overlapping avatar group (collaborators only) plus the current user's Clerk UserButton — and render live cursors for other participants on the canvas, without touching the editor home navbar.

## Scope Limits

- Do not add presence UI to the shared navbar globally
- Do not remove or move existing navbar actions (Save, Import, Share, AI)
- Do not replace Clerk user/profile/logout behavior
- Do not make collaborator avatars interactive
- Do not change canvas node or edge behavior
- Presence UI must only appear in the editor canvas view — editor home navbar is unchanged

## File Map

| File | Change |
|---|---|
| `liveblocks.config.ts` | Add `cursor` and `thinking` to Presence type |
| `components/editor/canvas/canvas.tsx` | Broadcast cursor position; render `<LiveCursors>`; mount `<PresenceAvatarGroup>` |
| `components/editor/canvas/presence-avatar-group.tsx` | Create — overlapping collaborator avatars + Clerk UserButton |
| `components/editor/canvas/live-cursors.tsx` | Create — render colored pointer + name badge for each other participant |

## Tasks

- [x] #spec **Task 1: Update Presence type in liveblocks.config.ts** ✅ 2026-06-02
  1. Add `cursor: { x: number; y: number } | null` to the `Presence` type
  2. Add `thinking: boolean` to the `Presence` type
  3. Set initial presence defaults accordingly in any `useMyPresence` initializer

- [x] #spec **Task 2: Create `<PresenceAvatarGroup>` component** ✅ 2026-06-02
  1. Get current user ID from `useUser()` (Clerk)
  2. Get all others from `useOthers()` (Liveblocks) — these are the collaborators
  3. Filter: exclude any entry whose `o.id` matches the current Clerk user ID
  4. Render up to 5 collaborator avatars in an overlapping stack (`-space-x-2`)
  5. Use profile photo when available; fall back to initials on a colored background
  6. Show a `+N` overflow chip when collaborator count exceeds 5
  7. Add a subtle ring (`ring-2 ring-bg-base`) so avatars read on the dark canvas
  8. Render a vertical divider only when at least one collaborator exists
  9. Render the current user's `<UserButton>` (Clerk) at the end — same `h-7 w-7` size
  10. Collaborator avatars are display-only; title tooltip via HTML `title` attribute

- [x] #spec **Task 3: Mount `<PresenceAvatarGroup>` in canvas view only** ✅ 2026-06-02
  1. Canvas view: `Canvas` component in `canvas.tsx` (inside `CanvasWrapper` / `WorkspaceShell`)
  2. Mounted as `absolute right-3 top-3 z-50` overlay inside the canvas container div
  3. `EditorShell` / `EditorNavbar` not touched

- [x] #spec **Task 4: Create `<LiveCursors>` component** ✅ 2026-06-02
  1. `useOthers()` selector filters to participants with non-null `presence.cursor`
  2. SVG pointer + name badge per participant — badge uses `info.color` as background
  3. Color sourced from `o.info.color` (set at Liveblocks auth time from `userIdToColor`)
  4. Never renders current user — `useOthers` excludes current user by definition
  5. `useStore(s => s.transform)` converts flow coords to canvas-relative pixel positions; component is absolutely positioned overlay inside the canvas container

- [x] #spec **Task 5: Broadcast cursor position from React Flow canvas** ✅ 2026-06-02
  1. `useMyPresence()` in `canvas.tsx`
  2. `onMouseMove` on `<ReactFlow>` calls `screenToFlowPosition` then `updateMyPresence({ cursor: pos })`
  3. `onMouseLeave` calls `updateMyPresence({ cursor: null })`

- [x] #spec **Task 6: Mount `<LiveCursors>` in canvas and verify build** ✅ 2026-06-02
  1. `<LiveCursors />` rendered after `<ReactFlow>` inside the `relative h-full w-full` container
  2. `npm run build` passes — no TypeScript errors

## Open Questions

_None_

---

## Shipped

2026-06-02 — Implemented Liveblocks real-time presence for the canvas editor. `PresenceAvatarGroup` shows overlapping avatars for all connected participants using `useSelf()` + `useOthers()`, renders nothing when solo, and includes shadcn `Tooltip` name labels on hover — matching Google Docs/Figma conventions. `LiveCursors` renders a color-coded SVG pointer and name badge per other participant. Cursor broadcast wired via `onMouseMove`/`onMouseLeave` on the ReactFlow canvas with flow-coordinate conversion.

_Tracked in [[progress]]_
