---
type: spec
id: 25
title: Presence Avatar Cursors
phase: 1
status: planned
updated: 2026-06-02
---

# Spec 25 — Presence Avatar Cursors

> [!abstract] Goal
> Show active room participants inside the editor canvas view as an avatar group and live cursors, without touching the editor home navbar or any globally shared components.

**References:** [[architecture-context]] · [[ui-context]] · [[code-standards]]

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Architecture:** Two new components (`PresenceAvatarStack`, `CanvasCursor`) rendered inside `Canvas`, which already sits within `RoomProvider` + `ClientSideSuspense`. Cursor position is broadcast via `useUpdateMyPresence` on React Flow mouse events. `<Cursors />` from `@liveblocks/react-flow` handles cursor overlay positioning; a custom `Cursor` component handles visual rendering. The navbar is untouched.

**Tech Stack:** `@liveblocks/react`, `@liveblocks/react-flow`, `@clerk/nextjs`, `@xyflow/react`

---

## Scope

### In scope

- Participant avatar group overlaid in the top-right corner of the editor canvas
- Live cursor rendering for other participants only
- Cursor position broadcast via Liveblocks presence on React Flow mouse events
- Presence type field rename: `isThinking` → `thinking`

### Out of scope

- Participant avatars in the shared navbar
- Collaborator avatar interactivity (no tooltips, popovers, or click handlers)
- Backend or API changes
- Canvas node or edge behavior

---

## Presence Type

Update `liveblocks.config.ts`:

```ts
Presence: {
  cursor: { x: number; y: number } | null
  thinking: boolean  // renamed from isThinking
}
```

- [ ] Rename `isThinking` → `thinking` in `liveblocks.config.ts`
- [ ] Update `initialPresence` in `canvas-wrapper.tsx` to `{ cursor: null, thinking: false }`
- [ ] Find and update any other `isThinking` references (AI sidebar, etc.)

---

## Cursor Broadcasting

Add `useUpdateMyPresence` to `canvas.tsx`.

**Track** — `onMouseMove` on `<ReactFlow>`:
```ts
const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY })
updateMyPresence({ cursor: pos })
```

**Clear** — `onMouseLeave` on the outer `div.relative.h-full.w-full.bg-bg-base`:
```ts
updateMyPresence({ cursor: null })
```

- [ ] Add `useUpdateMyPresence` to `canvas.tsx`
- [ ] Add `handleMouseMove` callback (converts screen → flow coords, calls `updateMyPresence`)
- [ ] Add `handleMouseLeave` callback (sets cursor to null)
- [ ] Pass `onMouseMove={handleMouseMove}` to `<ReactFlow>`
- [ ] Pass `onMouseLeave={handleMouseLeave}` to the outer canvas `div`

---

## Canvas Cursor Component (`canvas-cursor.tsx`)

`<Cursors />` handles SVG overlay positioning in the React Flow viewport. This component renders the cursor visual only — no coordinate logic.

**Props** (from `@liveblocks/react-flow`):
```ts
{ presence: Presence; info: UserMeta["info"] | undefined }
```

**Visual:**
- SVG triangle pointer ~12×16px, pointing top-left, filled with `info.color` (fallback: `var(--accent-primary)`)
- Pill name badge below the pointer: `text-[11px] font-mono px-1.5 py-0.5 rounded-md`
  - Background: `info.color` at 20% opacity
  - Text: `info.color`
- Returns `null` if `presence.cursor` is null (defensive guard)

- [ ] Create `components/editor/canvas/canvas-cursor.tsx`
- [ ] Implement SVG pointer with `info.color` fill and fallback
- [ ] Implement pill name badge below pointer
- [ ] Replace `<Cursors />` with `<Cursors components={{ Cursor: CanvasCursor }} />` in `canvas.tsx`

---

## Presence Avatar Stack (`presence-avatar-stack.tsx`)

### Positioning

`absolute top-3 right-3 z-10` inside the canvas `div.relative`.

### Data

```ts
const others = useOthers()
const self = useSelf()
const collaborators = others.filter((o) => o.id !== self?.id)
// useOthers() already excludes self; defensive filter by Clerk user ID
```

### Layout

Single flex row, `items-center gap-1.5`:

```
[avatar] [avatar] [avatar] [+N?]   |   [UserButton]
                                ↑ divider only when collaborators.length > 0
```

### Avatar rendering

- Size: `h-8 w-8` circle
- Overlap: flex container, each avatar has `-ml-2 first:ml-0`
- Ring: `ring-2 ring-bg-base`
- Image: `<img src={info.avatar} className="h-full w-full object-cover rounded-full" />`
- Initials fallback: split `info.name` by spaces — first char of first word + first char of last word (single-word names: first char only). Uppercase. On `bg-bg-elevated text-text-secondary text-xs font-mono`
- Max 5 avatars; overflow chip `+N` (same `h-8 w-8`, `bg-bg-elevated text-text-muted text-xs font-mono rounded-full`) when `collaborators.length > 5`

### Divider

`w-px h-5 bg-border-default mx-0.5` — rendered only when `collaborators.length > 0`.

### UserButton

```tsx
<UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
```

Wrapped in `h-8 w-8 flex-shrink-0` container. This is a second `UserButton` instance scoped to the canvas — the navbar's `UserButton` is unchanged.

### Collaborator avatars

Display-only. No click handler, tooltip, popover, or hover state beyond the ring.

- [ ] Create `components/editor/canvas/presence-avatar-stack.tsx`
- [ ] Implement `useOthers()` + `useSelf()` data with defensive filter
- [ ] Implement overlapping avatar strip (up to 5, with `+N` overflow chip)
- [ ] Implement initials fallback with single/multi-word name handling
- [ ] Implement conditional divider
- [ ] Render `<UserButton />` sized to `h-8 w-8`
- [ ] Add `<PresenceAvatarStack />` to `canvas.tsx` inside the canvas `div`

---

## Scope Limits

- Do not add participant avatars to the shared navbar component
- Do not remove or modify existing navbar actions (Settings, Templates, Share, AI)
- Do not replace Clerk user/profile/logout behavior
- Do not add interactivity to collaborator avatars
- Do not change canvas node or edge behavior

---

## Check When Done

- [ ] Presence avatars only appear in the editor canvas view
- [ ] Editor home navbar is unchanged
- [ ] Current user is resolved from the active Clerk session
- [ ] Collaborator avatars exclude the current user
- [ ] Divider only appears when collaborators exist
- [ ] Cursor position is broadcast via Liveblocks presence on React Flow mouse events
- [ ] Canvas renders live cursors for other participants only
- [ ] `npm run build` passes

---

*Tracked in [[progress]]*
