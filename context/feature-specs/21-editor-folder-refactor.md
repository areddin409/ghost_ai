---
type: feature-spec
feature: "21 — Editor Folder Refactor"
status: planned
updated: 2026-06-01
---

# Feature 21 — Editor Folder Refactor

> [!abstract] Goal
> Reorganize the flat `components/editor/` folder (23 files) into four subfolders — `canvas/`, `shell/`, `panels/`, `dialogs/` — and move `starter-templates.ts` to `lib/`.

**References:** [[architecture-context]] · [[code-standards]]

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Architecture:** Pure structural refactor — no logic changes. Files are moved using `git mv` to preserve history, then every import referencing a moved file is updated to its new path.

**Tech Stack:** Next.js, TypeScript, `@/` path alias

---

## Scope

- Do NOT change any component logic, props, or exports
- Do NOT add barrel `index.ts` files
- Do NOT rename any files (only move them)
- Do NOT touch any files outside of `components/editor/`, `lib/`, and `app/editor/`

## Final File Layout

```
components/editor/
├── canvas/
│   ├── canvas.tsx
│   ├── canvas-control-bar.tsx
│   ├── canvas-edge.tsx
│   ├── canvas-node.tsx
│   ├── canvas-placeholder.tsx
│   ├── canvas-wrapper.tsx
│   └── node-color-toolbar.tsx
├── dialogs/
│   ├── project-dialogs.tsx
│   ├── project-dialogs-context.tsx
│   ├── share-dialog.tsx
│   ├── starter-templates-modal.tsx
│   ├── user-settings-context.tsx
│   └── user-settings-modal.tsx
├── panels/
│   ├── ai-sidebar.tsx
│   ├── project-sidebar.tsx
│   └── shape-panel.tsx
├── shell/
│   ├── editor-home.tsx
│   ├── editor-navbar.tsx
│   ├── editor-shell.tsx
│   ├── workspace-navbar.tsx
│   └── workspace-shell.tsx
└── access-denied.tsx          ← stays at editor root
lib/
└── starter-templates.ts       ← moved from components/editor/
```

## Implementation

### Task 1: Move `starter-templates.ts` to `lib/`

**Files:**
- Move: `components/editor/starter-templates.ts` → `lib/starter-templates.ts`
- Modify: `components/editor/canvas.tsx` (import)
- Modify: `components/editor/starter-templates-modal.tsx` (import)

- [ ] **Step 1: Move the file**

```powershell
git mv "components/editor/starter-templates.ts" "lib/starter-templates.ts"
```

- [ ] **Step 2: Update import in `components/editor/canvas.tsx`**

Change:
```ts
import type { CanvasTemplate } from "./starter-templates"
```
To:
```ts
import type { CanvasTemplate } from "@/lib/starter-templates"
```

- [ ] **Step 3: Update import in `components/editor/starter-templates-modal.tsx`**

Change:
```ts
import { CANVAS_TEMPLATES, type CanvasTemplate } from "./starter-templates"
```
To:
```ts
import { CANVAS_TEMPLATES, type CanvasTemplate } from "@/lib/starter-templates"
```

- [ ] **Step 4: Commit**

```powershell
git add -A
git commit -m "refactor: move starter-templates to lib/"
```

---

### Task 2: Create `canvas/` subfolder and move canvas files

**Files:**
- Move: `components/editor/canvas.tsx` → `components/editor/canvas/canvas.tsx`
- Move: `components/editor/canvas-control-bar.tsx` → `components/editor/canvas/canvas-control-bar.tsx`
- Move: `components/editor/canvas-edge.tsx` → `components/editor/canvas/canvas-edge.tsx`
- Move: `components/editor/canvas-node.tsx` → `components/editor/canvas/canvas-node.tsx`
- Move: `components/editor/canvas-placeholder.tsx` → `components/editor/canvas/canvas-placeholder.tsx`
- Move: `components/editor/canvas-wrapper.tsx` → `components/editor/canvas/canvas-wrapper.tsx`
- Move: `components/editor/node-color-toolbar.tsx` → `components/editor/canvas/node-color-toolbar.tsx`
- Modify: `components/editor/canvas/canvas-wrapper.tsx` (import update)

- [ ] **Step 1: Move all canvas files**

```powershell
git mv "components/editor/canvas.tsx" "components/editor/canvas/canvas.tsx"
git mv "components/editor/canvas-control-bar.tsx" "components/editor/canvas/canvas-control-bar.tsx"
git mv "components/editor/canvas-edge.tsx" "components/editor/canvas/canvas-edge.tsx"
git mv "components/editor/canvas-node.tsx" "components/editor/canvas/canvas-node.tsx"
git mv "components/editor/canvas-placeholder.tsx" "components/editor/canvas/canvas-placeholder.tsx"
git mv "components/editor/canvas-wrapper.tsx" "components/editor/canvas/canvas-wrapper.tsx"
git mv "components/editor/node-color-toolbar.tsx" "components/editor/canvas/node-color-toolbar.tsx"
```

- [ ] **Step 2: Update import in `components/editor/canvas/canvas-wrapper.tsx`**

Change:
```ts
import { Canvas } from "@/components/editor/canvas"
```
To:
```ts
import { Canvas } from "./canvas"
```

- [ ] **Step 3: Commit**

```powershell
git add -A
git commit -m "refactor: move canvas components into canvas/ subfolder"
```

---

### Task 3: Create `shell/` subfolder and move shell files

**Files:**
- Move: `components/editor/editor-home.tsx` → `components/editor/shell/editor-home.tsx`
- Move: `components/editor/editor-navbar.tsx` → `components/editor/shell/editor-navbar.tsx`
- Move: `components/editor/editor-shell.tsx` → `components/editor/shell/editor-shell.tsx`
- Move: `components/editor/workspace-navbar.tsx` → `components/editor/shell/workspace-navbar.tsx`
- Move: `components/editor/workspace-shell.tsx` → `components/editor/shell/workspace-shell.tsx`
- Modify: `components/editor/shell/editor-home.tsx` (1 import)
- Modify: `components/editor/shell/editor-shell.tsx` (4 imports)
- Modify: `components/editor/shell/workspace-shell.tsx` (11 imports)

- [ ] **Step 1: Move all shell files**

```powershell
git mv "components/editor/editor-home.tsx" "components/editor/shell/editor-home.tsx"
git mv "components/editor/editor-navbar.tsx" "components/editor/shell/editor-navbar.tsx"
git mv "components/editor/editor-shell.tsx" "components/editor/shell/editor-shell.tsx"
git mv "components/editor/workspace-navbar.tsx" "components/editor/shell/workspace-navbar.tsx"
git mv "components/editor/workspace-shell.tsx" "components/editor/shell/workspace-shell.tsx"
```

- [ ] **Step 2: Update imports in `components/editor/shell/editor-home.tsx`**

Change:
```ts
import { useProjectDialogsContext } from "@/components/editor/project-dialogs-context"
```
To:
```ts
import { useProjectDialogsContext } from "@/components/editor/dialogs/project-dialogs-context"
```

- [ ] **Step 3: Update imports in `components/editor/shell/editor-shell.tsx`**

Change:
```ts
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ProjectDialogsContext } from "@/components/editor/project-dialogs-context"
import { ... } from "@/components/editor/project-dialogs"
```
To:
```ts
import { EditorNavbar } from "./editor-navbar"
import { ProjectSidebar } from "@/components/editor/panels/project-sidebar"
import { ProjectDialogsContext } from "@/components/editor/dialogs/project-dialogs-context"
import { ... } from "@/components/editor/dialogs/project-dialogs"
```

> [!note] The `...` represents whatever named imports already exist in the file — do not change the imported names, only the path string.

- [ ] **Step 4: Update imports in `components/editor/shell/workspace-shell.tsx`**

Change:
```ts
import { WorkspaceNavbar } from "@/components/editor/workspace-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { CanvasWrapper } from "@/components/editor/canvas-wrapper"
import { AiSidebar } from "@/components/editor/ai-sidebar"
import { ShareDialog } from "@/components/editor/share-dialog"
import { ProjectDialogsContext } from "@/components/editor/project-dialogs-context"
import { ... } from "@/components/editor/project-dialogs"
import { ShapePanel } from "@/components/editor/shape-panel"
import { StarterTemplatesModal } from "@/components/editor/starter-templates-modal"
import { UserSettingsProvider } from "@/components/editor/user-settings-context"
import { UserSettingsModal } from "@/components/editor/user-settings-modal"
```
To:
```ts
import { WorkspaceNavbar } from "./workspace-navbar"
import { ProjectSidebar } from "@/components/editor/panels/project-sidebar"
import { CanvasWrapper } from "@/components/editor/canvas/canvas-wrapper"
import { AiSidebar } from "@/components/editor/panels/ai-sidebar"
import { ShareDialog } from "@/components/editor/dialogs/share-dialog"
import { ProjectDialogsContext } from "@/components/editor/dialogs/project-dialogs-context"
import { ... } from "@/components/editor/dialogs/project-dialogs"
import { ShapePanel } from "@/components/editor/panels/shape-panel"
import { StarterTemplatesModal } from "@/components/editor/dialogs/starter-templates-modal"
import { UserSettingsProvider } from "@/components/editor/dialogs/user-settings-context"
import { UserSettingsModal } from "@/components/editor/dialogs/user-settings-modal"
```

> [!note] Preserve the existing named imports — only update the path strings.

- [ ] **Step 5: Commit**

```powershell
git add -A
git commit -m "refactor: move shell components into shell/ subfolder"
```

---

### Task 4: Create `panels/` subfolder and move panel files

**Files:**
- Move: `components/editor/ai-sidebar.tsx` → `components/editor/panels/ai-sidebar.tsx`
- Move: `components/editor/project-sidebar.tsx` → `components/editor/panels/project-sidebar.tsx`
- Move: `components/editor/shape-panel.tsx` → `components/editor/panels/shape-panel.tsx`
- Modify: `components/editor/panels/project-sidebar.tsx` (1 import)

- [ ] **Step 1: Move all panel files**

```powershell
git mv "components/editor/ai-sidebar.tsx" "components/editor/panels/ai-sidebar.tsx"
git mv "components/editor/project-sidebar.tsx" "components/editor/panels/project-sidebar.tsx"
git mv "components/editor/shape-panel.tsx" "components/editor/panels/shape-panel.tsx"
```

- [ ] **Step 2: Update import in `components/editor/panels/project-sidebar.tsx`**

Change:
```ts
import { useProjectDialogsContext } from "@/components/editor/project-dialogs-context"
```
To:
```ts
import { useProjectDialogsContext } from "@/components/editor/dialogs/project-dialogs-context"
```

- [ ] **Step 3: Commit**

```powershell
git add -A
git commit -m "refactor: move panel components into panels/ subfolder"
```

---

### Task 5: Create `dialogs/` subfolder and move dialog files

**Files:**
- Move: `components/editor/project-dialogs.tsx` → `components/editor/dialogs/project-dialogs.tsx`
- Move: `components/editor/project-dialogs-context.tsx` → `components/editor/dialogs/project-dialogs-context.tsx`
- Move: `components/editor/share-dialog.tsx` → `components/editor/dialogs/share-dialog.tsx`
- Move: `components/editor/starter-templates-modal.tsx` → `components/editor/dialogs/starter-templates-modal.tsx`
- Move: `components/editor/user-settings-context.tsx` → `components/editor/dialogs/user-settings-context.tsx`
- Move: `components/editor/user-settings-modal.tsx` → `components/editor/dialogs/user-settings-modal.tsx`
- Modify: `components/editor/dialogs/project-dialogs.tsx` (1 import)

- [ ] **Step 1: Move all dialog files**

```powershell
git mv "components/editor/project-dialogs.tsx" "components/editor/dialogs/project-dialogs.tsx"
git mv "components/editor/project-dialogs-context.tsx" "components/editor/dialogs/project-dialogs-context.tsx"
git mv "components/editor/share-dialog.tsx" "components/editor/dialogs/share-dialog.tsx"
git mv "components/editor/starter-templates-modal.tsx" "components/editor/dialogs/starter-templates-modal.tsx"
git mv "components/editor/user-settings-context.tsx" "components/editor/dialogs/user-settings-context.tsx"
git mv "components/editor/user-settings-modal.tsx" "components/editor/dialogs/user-settings-modal.tsx"
```

- [ ] **Step 2: Update import in `components/editor/dialogs/project-dialogs.tsx`**

Change:
```ts
import { useProjectDialogsContext } from "@/components/editor/project-dialogs-context"
```
To:
```ts
import { useProjectDialogsContext } from "./project-dialogs-context"
```

- [ ] **Step 3: Commit**

```powershell
git add -A
git commit -m "refactor: move dialog components into dialogs/ subfolder"
```

---

### Task 6: Update `app/editor/` page imports

**Files:**
- Modify: `app/editor/page.tsx` (2 imports)
- Modify: `app/editor/[roomId]/page.tsx` (1 import — `access-denied` stays at root)

- [ ] **Step 1: Update `app/editor/page.tsx`**

Change:
```ts
import { EditorShell } from "@/components/editor/editor-shell"
import { EditorHome } from "@/components/editor/editor-home"
```
To:
```ts
import { EditorShell } from "@/components/editor/shell/editor-shell"
import { EditorHome } from "@/components/editor/shell/editor-home"
```

- [ ] **Step 2: Update `app/editor/[roomId]/page.tsx`**

Change:
```ts
import { WorkspaceShell } from "@/components/editor/workspace-shell"
```
To:
```ts
import { WorkspaceShell } from "@/components/editor/shell/workspace-shell"
```

> [!note] `access-denied` stays at `@/components/editor/access-denied` — no change needed for that import.

- [ ] **Step 3: Commit**

```powershell
git add -A
git commit -m "refactor: update app/editor page imports to new subfolder paths"
```

---

### Task 7: Verify build

- [ ] **Step 1: Run TypeScript build check**

```powershell
pnpm build
```

Expected: build completes with no TypeScript errors. If errors appear, they will point to any missed import paths — fix them and re-run.

- [ ] **Step 2: Commit fix if needed**

If any import was missed, fix it, then:

```powershell
git add -A
git commit -m "fix: correct missed import paths after editor refactor"
```

---

## Check when done

- [ ] `components/editor/` root contains only `access-denied.tsx` and the four subfolders
- [ ] `lib/starter-templates.ts` exists; `components/editor/starter-templates.ts` is gone
- [ ] `pnpm build` passes without type errors
- [ ] No `@/components/editor/[filename]` flat imports remain (all now reference a subfolder or `access-denied`)

---

_Tracked in [[progress-tracker]]_
