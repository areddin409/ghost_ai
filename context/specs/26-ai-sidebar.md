---
type: spec
id: 26
title: AI Sidebar
status: active
phase: 2
updated: 2026-06-02
---

# Spec 26 — AI Sidebar

> [!abstract] Goal
> Extract the existing AI sidebar placeholder into its own component and build out the full sidebar UI with header, tabbed layout, AI Architect chat interface, and Specs tab.

## File Map

| File | Change |
|---|---|
| `components/editor/panels/ai-sidebar.tsx` | Modify — replace placeholder with full UI |
| `components/editor/shell/workspace-shell.tsx` | Modify — pass `onClose` prop to `<AiSidebar>` |

## Tasks

- [x] #spec **Task 1: Rebuild AiSidebar component**
  1. Modify `components/editor/panels/ai-sidebar.tsx` (already exists as placeholder)
  2. Add `onClose` prop alongside existing `isOpen`
  3. Preserve slide-in animation, floating position, border, background, shadow styling

- [x] #spec **Task 2: Sidebar header**
  1. Small bot icon (left)
  2. Title `AI Workspace` — `text-primary-text`
  3. Subtitle `Collaborate with Ghost AI` — `text-muted-text`
  4. Close button aligned right

- [x] #spec **Task 3: Tabbed layout**
  1. Add shadcn `Tabs` with two tabs: `AI Architect` and `Specs`
  2. Active tab: `bg-accent text-accent` (or `text-white`)
  3. Inactive tab: `text-muted-text`

- [x] #spec **Task 4: AI Architect tab**
  1. Scrollable chat area
  2. Empty state: bot icon, short description, three starter prompt chips
     - `Design an e-commerce backend`
     - `Create a chat app architecture`
     - `Build a CI/CD pipeline`
  3. Starter chips: soft pill style `bg-subtle text-accent-text`
  4. User messages: right-aligned, `bg-brand-dim border-brand/50 border-2 text-copy-primary`
  5. Assistant messages: left-aligned, `bg-elevated border border-surface-border text-accent-text`
  6. Input area: auto-resizing textarea (min-height ~72px, max-height ~160px)
  7. Send button: `bg-accent text-white`
  8. `Enter` submits, `Shift+Enter` adds newline

- [x] #spec **Task 5: Specs tab**
  1. `Generate Spec` button — `bg-accent text-white`
  2. Demo spec card — `bg-elevated border-surface-border`
  3. Card contains: file/spec icon, title, short snippet, disabled download action

- [x] #spec **Task 6: Wire onClose into workspace-shell**
  1. Pass `onClose={() => setAiOpen(false)}` to `<AiSidebar>` in `workspace-shell.tsx`

- [x] #spec **Task 7: Verify**
  1. `npm run build` passes with no errors
  2. Sidebar slide-in / slide-out behavior unchanged
  3. Both tabs render correctly
  4. Empty state, starter chips, and input UI present in AI Architect tab
  5. Generate Spec button and demo card present in Specs tab

## Open Questions

_None_

---

_Tracked in [[progress]]_
