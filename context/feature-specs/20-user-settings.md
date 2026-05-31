---
type: feature-spec
feature: "20 — User Settings"
status: planned
updated: 2026-05-31
---

# Feature 20 — User Settings

> [!abstract] Goal
> Persist per-user canvas and workspace preferences (edge routing, minimap, background, snap-to-grid, default node shape/color) in PostgreSQL. Settings load server-side at the workspace page, eliminating client-side flash, and are edited via a modal with live canvas preview.

**References:** [[architecture-context]] · [[ui-context]] · [[code-standards]]

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Architecture:** One `UserSettings` row per Clerk user (upserted on first fetch). Settings are fetched server-side in the workspace page using a `lib/user-settings.ts` helper and passed to `WorkspaceShell` as `initialSettings`. A React context (`UserSettingsContext`) wraps the shell, holding `savedSettings` (last DB snapshot) and `pendingSettings` (live modal edits). The canvas reads exclusively from context; no prop threading needed. The `Map` button is removed from the navbar — minimap is now a modal toggle.

**Tech Stack:** Prisma ORM, Next.js App Router API routes, Clerk auth, `@xyflow/react`, shadcn `Dialog`

---

## Scope

Seven settings stored as one `UserSettings` row per Clerk user:

| Setting | Type | Default |
|---|---|---|
| `edgeRouting` | `"smoothstep" \| "step" \| "straight"` | `"smoothstep"` |
| `minimapVisible` | `boolean` | `true` |
| `backgroundVariant` | `"dots" \| "lines" \| "cross" \| "none"` | `"dots"` |
| `backgroundPatternColor` | hex string | `"#2a2a30"` |
| `snapToGrid` | `boolean` | `false` |
| `defaultNodeShape` | `NodeShape` | `"rectangle"` |
| `defaultNodeColor` | hex string | `"#1F1F1F"` |

> [!warning] Out of scope
> Edge arrow styles and animated edges are deferred until edge features are revisited.

---

## Implementation

### Task 1: Data layer — Prisma model and migration

**Files:**
- Modify: `prisma/schema.prisma`

- [x] **Step 1: Add `UserSettings` model**

Open `prisma/schema.prisma`. Append the following model:

```prisma
model UserSettings {
  id                     String   @id @default(cuid())
  userId                 String   @unique
  edgeRouting            String   @default("smoothstep")
  minimapVisible         Boolean  @default(true)
  backgroundVariant      String   @default("dots")
  backgroundPatternColor String   @default("#2a2a30")
  snapToGrid             Boolean  @default(false)
  defaultNodeShape       String   @default("rectangle")
  defaultNodeColor       String   @default("#1F1F1F")
  updatedAt              DateTime @updatedAt
}
```

- [x] **Step 2: Run migration**

```bash
npx prisma migrate dev --name add-user-settings
```

Expected: migration created and applied, Prisma client regenerated.

- [x] **Step 3: Verify build passes**

```bash
npm run build
```

---

### Task 2: Lib helper — getUserSettings

**Files:**
- Create: `lib/user-settings.ts`

- [x] **Step 1: Create the helper**

Create `lib/user-settings.ts`:

```ts
import { prisma } from "@/lib/prisma"
import type { UserSettings } from "@/app/generated/prisma/client"

export async function getUserSettings(userId: string): Promise<UserSettings> {
  return prisma.userSettings.upsert({
    where: { userId },
    update: {},
    create: { userId },
  })
}
```

The `upsert` with an empty `update: {}` body guarantees a row is always returned with defaults. The caller never receives a null or 404.

---

### Task 3: API routes — GET and PATCH

**Files:**
- Create: `app/api/user-settings/route.ts`

- [x] **Step 1: Create the route file**

Create `app/api/user-settings/route.ts`:

```ts
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserSettings } from "@/lib/user-settings"

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const settings = await getUserSettings(userId)
  return NextResponse.json(settings)
}

export async function PATCH(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()

  const allowed = [
    "edgeRouting",
    "minimapVisible",
    "backgroundVariant",
    "backgroundPatternColor",
    "snapToGrid",
    "defaultNodeShape",
    "defaultNodeColor",
  ] as const

  const patch: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) patch[key] = body[key]
  }

  const settings = await prisma.userSettings.upsert({
    where: { userId },
    update: patch,
    create: { userId, ...patch },
  })

  return NextResponse.json(settings)
}
```

- [x] **Step 2: Verify build passes**

```bash
npm run build
```

---

### Task 4: Settings context

**Files:**
- Create: `components/editor/user-settings-context.tsx`

- [x] **Step 1: Create the context file**

Create `components/editor/user-settings-context.tsx`:

```tsx
"use client"

import { createContext, useContext, useState, useCallback } from "react"
import type { UserSettings } from "@prisma/client"

interface UserSettingsContextValue {
  settings: UserSettings
  updatePending: (key: keyof UserSettings, value: unknown) => void
  saveSettings: () => Promise<void>
  cancelSettings: () => void
  isSaving: boolean
}

const UserSettingsContext = createContext<UserSettingsContextValue | null>(null)

export function UserSettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode
  initialSettings: UserSettings
}) {
  const [savedSettings, setSavedSettings] = useState(initialSettings)
  const [pendingSettings, setPendingSettings] = useState(initialSettings)
  const [isSaving, setIsSaving] = useState(false)

  const updatePending = useCallback((key: keyof UserSettings, value: unknown) => {
    setPendingSettings((prev) => ({ ...prev, [key]: value }))
  }, [])

  const saveSettings = useCallback(async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/user-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingSettings),
      })
      const updated: UserSettings = await res.json()
      setSavedSettings(updated)
      setPendingSettings(updated)
    } finally {
      setIsSaving(false)
    }
  }, [pendingSettings])

  const cancelSettings = useCallback(() => {
    setPendingSettings(savedSettings)
  }, [savedSettings])

  return (
    <UserSettingsContext.Provider
      value={{ settings: pendingSettings, updatePending, saveSettings, cancelSettings, isSaving }}
    >
      {children}
    </UserSettingsContext.Provider>
  )
}

export function useUserSettings(): UserSettingsContextValue {
  const ctx = useContext(UserSettingsContext)
  if (!ctx) throw new Error("useUserSettings must be used within UserSettingsProvider")
  return ctx
}
```

`settings` always exposes `pendingSettings` so the canvas reflects live edits while the modal is open. The context never tracks modal open/close state.

- [x] **Step 2: Verify build passes**

```bash
npm run build
```

---

### Task 5: Settings modal

**Files:**
- Create: `components/editor/user-settings-modal.tsx`

- [x] **Step 1: Create the modal file**

Create `components/editor/user-settings-modal.tsx`. Uses the existing shadcn `Dialog` (same pattern as `ShareDialog`). Three sections:

**Canvas section:** background pattern segmented control, background brightness swatches (4 presets, disabled when pattern is `"none"`), snap-to-grid toggle, minimap toggle.
**Connections section:** edge routing segmented control.
**Node Defaults section:** default shape picker (6 buttons reusing shape icons from `ShapePanel`), default color swatches (8 swatches reusing `NODE_COLORS` from `types/canvas.ts`).

Background brightness presets:

| Label | Hex |
|---|---|
| Subtle | `#1e1e23` |
| Default | `#2a2a30` |
| Bright | `#3a3a45` |
| Vivid | `#52525e` |

All controls call `updatePending` on change — the canvas reflects changes in real time. **Save** calls `saveSettings()` then calls `onClose`. **Cancel** calls `cancelSettings()` then calls `onClose`.

```tsx
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useUserSettings } from "./user-settings-context"
import { NODE_COLORS, NODE_SHAPES, type NodeShape } from "@/types/canvas"

const BACKGROUND_PRESETS = [
  { label: "Subtle", hex: "#1e1e23" },
  { label: "Default", hex: "#2a2a30" },
  { label: "Bright", hex: "#3a3a45" },
  { label: "Vivid", hex: "#52525e" },
]

const EDGE_ROUTING_OPTIONS = ["smoothstep", "step", "straight"] as const
const BACKGROUND_VARIANTS = ["dots", "lines", "cross", "none"] as const

interface UserSettingsModalProps {
  open: boolean
  onClose: () => void
}

export function UserSettingsModal({ open, onClose }: UserSettingsModalProps) {
  const { settings, updatePending, saveSettings, cancelSettings, isSaving } = useUserSettings()

  async function handleSave() {
    await saveSettings()
    onClose()
  }

  function handleCancel() {
    cancelSettings()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Canvas */}
          <section className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Canvas</h3>

            <div className="space-y-1">
              <Label>Background pattern</Label>
              <div className="flex gap-1">
                {BACKGROUND_VARIANTS.map((v) => (
                  <Button
                    key={v}
                    variant={settings.backgroundVariant === v ? "default" : "outline"}
                    size="sm"
                    onClick={() => updatePending("backgroundVariant", v)}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <Label className={settings.backgroundVariant === "none" ? "opacity-50" : ""}>
                Background brightness
              </Label>
              <div className="flex gap-2">
                {BACKGROUND_PRESETS.map((p) => (
                  <button
                    key={p.hex}
                    disabled={settings.backgroundVariant === "none"}
                    onClick={() => updatePending("backgroundPatternColor", p.hex)}
                    title={p.label}
                    className="h-6 w-6 rounded-full border-2 disabled:opacity-40"
                    style={{
                      backgroundColor: p.hex,
                      borderColor: settings.backgroundPatternColor === p.hex ? "#00c8d4" : "transparent",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label>Snap to grid</Label>
              <Switch
                checked={settings.snapToGrid}
                onCheckedChange={(v) => updatePending("snapToGrid", v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Minimap</Label>
              <Switch
                checked={settings.minimapVisible}
                onCheckedChange={(v) => updatePending("minimapVisible", v)}
              />
            </div>
          </section>

          {/* Connections */}
          <section className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Connections</h3>
            <div className="space-y-1">
              <Label>Edge routing</Label>
              <div className="flex gap-1">
                {EDGE_ROUTING_OPTIONS.map((r) => (
                  <Button
                    key={r}
                    variant={settings.edgeRouting === r ? "default" : "outline"}
                    size="sm"
                    onClick={() => updatePending("edgeRouting", r)}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          {/* Node Defaults */}
          <section className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Node Defaults</h3>

            <div className="space-y-1">
              <Label>Default shape</Label>
              <div className="flex gap-1 flex-wrap">
                {NODE_SHAPES.map((shape) => (
                  <Button
                    key={shape}
                    variant={settings.defaultNodeShape === shape ? "default" : "outline"}
                    size="sm"
                    onClick={() => updatePending("defaultNodeShape", shape)}
                  >
                    {shape}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <Label>Default color</Label>
              <div className="flex gap-2 flex-wrap">
                {NODE_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => updatePending("defaultNodeColor", color)}
                    className="h-6 w-6 rounded-full border-2"
                    style={{
                      backgroundColor: color,
                      borderColor: settings.defaultNodeColor === color ? "#00c8d4" : "transparent",
                    }}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

- [x] **Step 2: Verify build passes**

```bash
npm run build
```

---

### Task 6: Workspace navbar and shell

**Files:**
- Modify: `components/editor/workspace-navbar.tsx`
- Modify: `components/editor/workspace-shell.tsx`

- [x] **Step 1: Update workspace-navbar.tsx**

In `WorkspaceNavbar`:
- Remove the `Map` icon button and its `isMinimapVisible` + `onToggleMinimap` props
- Add `onOpenSettings: () => void` to the props interface
- Add a `<Settings className="h-4 w-4" />` icon button (Lucide) on the right side where the `Map` button was, wired to `onOpenSettings`

- [x] **Step 2: Update workspace-shell.tsx**

In `WorkspaceShell`:
- Add `initialSettings: UserSettings` to the component props
- Remove `minimapVisible` state and `onToggleMinimap` handler
- Add `isSettingsOpen` state (`useState(false)`)
- Add `onOpenSettings` callback that sets `isSettingsOpen(true)`
- Wrap the shell JSX in `<UserSettingsProvider initialSettings={initialSettings}>...</UserSettingsProvider>`
- Render `<UserSettingsModal open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />` inside the provider
- Pass `onOpenSettings` to `WorkspaceNavbar`; remove the old minimap props from that call

- [x] **Step 3: Verify build passes**

```bash
npm run build
```

---

### Task 7: Canvas wiring

**Files:**
- Modify: `components/editor/canvas-wrapper.tsx`
- Modify: `components/editor/canvas.tsx`

- [ ] **Step 1: Update canvas-wrapper.tsx**

Remove the `showMinimap` prop — minimap visibility is now owned by `UserSettingsContext`. Update the prop interface and remove any passing of `showMinimap` down to `Canvas`.

- [ ] **Step 2: Wire settings into canvas.tsx**

Import `useUserSettings` from `./user-settings-context`. At the top of the `Canvas` component body, destructure the settings needed:

```tsx
const { settings } = useUserSettings()
```

Replace hardcoded values with context reads:

- `<Background>` — replace hardcoded `variant` and `color` with `variant={settings.backgroundVariant as BackgroundVariant}` and `color={settings.backgroundPatternColor}`
- `<ReactFlow>` — add `snapToGrid={settings.snapToGrid}` and `snapGrid={[20, 20]}`
- `<ReactFlow>` — replace hardcoded `connectionLineType` with the mapped value:

```tsx
const connectionLineTypeMap = {
  smoothstep: ConnectionLineType.SmoothStep,
  step: ConnectionLineType.Step,
  straight: ConnectionLineType.Straight,
} as const

// inside Canvas:
connectionLineType={connectionLineTypeMap[settings.edgeRouting]}
```

- Minimap — replace the static `showMinimap` prop (or hardcoded render) with a conditional: `{settings.minimapVisible && <MiniMap ... />}`

- [ ] **Step 3: Wire edge routing into CanvasEdgeRenderer**

`CanvasEdgeRenderer` currently calls a single path function (e.g. `getSmoothStepPath`). Import `useUserSettings` and switch on `settings.edgeRouting`:

```tsx
const { settings } = useUserSettings()

const getPath =
  settings.edgeRouting === "step"
    ? getStepPath
    : settings.edgeRouting === "straight"
      ? getStraightPath
      : getSmoothStepPath
```

- [ ] **Step 4: Wire defaults into new node creation**

In `canvas.tsx`, find the `onDrop` and `onInsertShape` handlers that build new `CanvasNode` data objects. Replace hardcoded shape and color values with:

```tsx
data: {
  label: "",
  shape: settings.defaultNodeShape as NodeShape,
  color: settings.defaultNodeColor,
  // ...other fields
}
```

- [ ] **Step 5: Verify build passes**

```bash
npm run build
```

---

### Task 8: Server page — fetch settings server-side

**Files:**
- Modify: `app/editor/[roomId]/page.tsx`

- [x] **Step 1: Parallel-fetch settings alongside project data**

In the workspace page server component, import `getUserSettings` from `@/lib/user-settings`. Fetch settings in parallel with the project:

```ts
const [project, settings] = await Promise.all([
  getProjectWithAccess(userId, roomId),
  getUserSettings(userId),
])
```

- [x] **Step 2: Pass settings to WorkspaceShell**

Pass `settings` as the `initialSettings` prop to `<WorkspaceShell>`:

```tsx
<WorkspaceShell
  project={project}
  initialSettings={settings}
  // ...other props
/>
```

- [ ] **Step 3: Verify build passes**

```bash
npm run build
```

---

## Check when done

- [ ] Opening the workspace loads settings from the DB with no loading flash
- [ ] The navbar shows a Settings icon; the Map/minimap button is gone from the navbar
- [ ] Opening the settings modal shows three sections: Canvas, Connections, Node Defaults
- [ ] Changing background pattern updates the canvas behind the modal in real time
- [ ] Background brightness swatches are disabled when pattern is set to None
- [ ] Toggling minimap shows/hides the minimap on the canvas immediately
- [ ] Toggling snap-to-grid activates snapping immediately
- [ ] Changing edge routing updates existing and newly drawn edges immediately
- [ ] Choosing a new default shape/color applies to the next dropped or inserted node
- [ ] Clicking Save commits changes to the DB and closes the modal
- [ ] Clicking Cancel reverts pending changes and closes the modal without a DB write
- [ ] Settings persist across a full page reload
- [ ] `npm run build` passes without type errors

---

*Tracked in [[progress-tracker]]*
