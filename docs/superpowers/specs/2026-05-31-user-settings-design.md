# User Settings — Design Spec

**Date:** 2026-05-31
**Status:** Approved

---

## Overview

A per-user settings system that lets each user persist personal canvas and workspace preferences across sessions. Settings are stored server-side (PostgreSQL) and loaded at the workspace page level, so they are available at render time with no client-side flash.

---

## Scope

Six settings, all user-level (one record per Clerk user, not per project):

| Setting | Type | Default |
|---|---|---|
| `edgeRouting` | `"smoothstep" \| "step" \| "straight"` | `"smoothstep"` |
| `minimapVisible` | `boolean` | `true` |
| `backgroundVariant` | `"dots" \| "lines" \| "cross" \| "none"` | `"dots"` |
| `backgroundPatternColor` | hex string | `"#2a2a30"` |
| `snapToGrid` | `boolean` | `false` |
| `defaultNodeShape` | `NodeShape` | `"rectangle"` |
| `defaultNodeColor` | hex string | `"#1F1F1F"` |

Edge arrow styles and animated edges are out of scope — deferred until edge features are revisited.

---

## Data Layer

### Prisma model

```prisma
model UserSettings {
  id                   String   @id @default(cuid())
  userId               String   @unique
  edgeRouting          String   @default("smoothstep")
  minimapVisible       Boolean  @default(true)
  backgroundVariant    String   @default("dots")
  backgroundPatternColor String @default("#2a2a30")
  snapToGrid           Boolean  @default(false)
  defaultNodeShape     String   @default("rectangle")
  defaultNodeColor     String   @default("#1F1F1F")
  updatedAt            DateTime @updatedAt
}
```

Added to `prisma/schema.prisma`. Requires a new migration.

### API routes

**`GET /api/user-settings`**
- Requires Clerk auth via `getCurrentIdentity()`
- Upserts a row with defaults if none exists — never returns 404
- Returns the full `UserSettings` record

**`PATCH /api/user-settings`**
- Requires Clerk auth
- Accepts a partial body; validates all fields before writing
- Returns the updated `UserSettings` record

---

## Settings Context

**File:** `components/editor/user-settings-context.tsx`

Wraps `WorkspaceShell`. Holds two states:

- `savedSettings` — last-committed DB values; used to revert on Cancel
- `pendingSettings` — local edits while the modal is open; drives live canvas preview

```ts
interface UserSettingsContextValue {
  settings: UserSettings  // always reflects current pending state; equals saved when modal is closed
  updatePending: (key: keyof UserSettings, value: unknown) => void
  saveSettings: () => Promise<void>
  cancelSettings: () => void
  isSaving: boolean
}
```

Internally the provider holds `savedSettings` (last DB snapshot) and `pendingSettings` (current edits). `settings` exposed from context is always `pendingSettings`. On modal open, `pendingSettings` is seeded from `savedSettings`. `cancelSettings` resets `pendingSettings` to `savedSettings`. `saveSettings` writes `pendingSettings` to DB and updates `savedSettings`. The context never needs to track modal open state.

`WorkspaceShell` receives `initialSettings: UserSettings` from the server page and passes it to the provider. No fetch on mount; no loading state in consumers.

**Hook:** `useUserSettings()` — reads the context; throws if used outside the provider.

---

## Settings Modal

**File:** `components/editor/user-settings-modal.tsx`

Uses the existing shadcn `Dialog` (same pattern as `ShareDialog`). Three sections:

### Canvas
- **Background pattern** — segmented control: Dots / Lines / Cross / None
- **Background brightness** — 4 preset swatches, disabled when pattern is None:

  | Label | Hex |
  |---|---|
  | Subtle | `#1e1e23` |
  | Default | `#2a2a30` |
  | Bright | `#3a3a45` |
  | Vivid | `#52525e` |

- **Snap to grid** — toggle switch
- **Minimap** — toggle switch (moved here from the navbar)

### Connections
- **Edge routing** — segmented control: Smooth / Step / Straight

### Node Defaults
- **Default shape** — 6-button picker reusing the shape icons from `ShapePanel`
- **Default color** — 8-swatch picker reusing `NODE_COLORS` from `types/canvas.ts`

All controls call `updatePending` on change — the canvas behind the modal reflects changes in real time. **Save** commits to DB and closes. **Cancel** reverts `pendingSettings` to `savedSettings` and closes.

---

## Entry Point

A `<Settings className="h-4 w-4" />` (Lucide) icon button is added to `WorkspaceNavbar` on the right side, in place of the existing `Map` button. The `Map` button is removed from the navbar entirely — minimap is now controlled from the modal.

`WorkspaceNavbar` gains `onOpenSettings: () => void` and loses `isMinimapVisible` and `onToggleMinimap`.

---

## Canvas Wiring

### `canvas.tsx`

Reads from `useUserSettings()`:

- `edgeRouting` → `connectionLineType` on `<ReactFlow>` (`SmoothStep` / `Step` / `Straight`) and the path function inside `CanvasEdgeRenderer`. The renderer calls `useUserSettings()` and switches between `getSmoothStepPath`, `getStepPath`, and `getStraightPath` from `@xyflow/react` based on `edgeRouting`. `defaultEdgeOptions.type` stays `"canvasEdge"` — no new edge types needed.
- `snapToGrid` + `snapGrid={[20, 20]}` → passed to `<ReactFlow>`
- `backgroundVariant` + `backgroundPatternColor` → `<Background variant={...} color={...} />`
- `minimapVisible` → `{settings.minimapVisible && <MiniMap ... />}`

The hardcoded values currently on `<Background>` and `showMinimap` prop are replaced by context values.

### `canvas-wrapper.tsx`

`showMinimap` prop removed — minimap visibility is owned by context.

### `canvas.tsx` — new node creation

`onDrop` and `onInsertShape` handlers use `settings.defaultNodeShape` and `settings.defaultNodeColor` when building the new `CanvasNode` data object.

### `workspace-shell.tsx`

- `minimapVisible` state and `onToggleMinimap` removed
- `WorkspaceNavbar` no longer receives those props
- Gains `onOpenSettings` → opens `UserSettingsModal`
- `UserSettingsContext.Provider` wraps the shell, initialized with `initialSettings` from the server page

---

## Server Page

`app/editor/[roomId]/page.tsx` fetches user settings alongside project data:

```ts
const [project, settings] = await Promise.all([
  getProjectWithAccess(userId, roomId),
  getUserSettings(userId),       // new lib helper — wraps the upsert
])
```

`settings` is passed to `WorkspaceShell` as `initialSettings`.

---

## File Checklist

| File | Change |
|---|---|
| `prisma/schema.prisma` | Add `UserSettings` model |
| `app/api/user-settings/route.ts` | New — GET + PATCH handlers |
| `lib/user-settings.ts` | New — `getUserSettings(userId)` upsert helper |
| `components/editor/user-settings-context.tsx` | New — context + provider + hook |
| `components/editor/user-settings-modal.tsx` | New — settings dialog |
| `components/editor/workspace-navbar.tsx` | Remove Map button, add Settings icon + `onOpenSettings` prop |
| `components/editor/workspace-shell.tsx` | Wire context provider, remove minimap state, add modal |
| `components/editor/canvas-wrapper.tsx` | Remove `showMinimap` prop |
| `components/editor/canvas.tsx` | Read settings from context for all affected props |
| `app/editor/[roomId]/page.tsx` | Fetch settings server-side, pass to shell |
