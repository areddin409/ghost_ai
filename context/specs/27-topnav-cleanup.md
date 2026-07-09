---
type: spec
id: 27
title: Topnav Cleanup
status: active
phase: 2
updated: 2026-07-09
---

# Spec 27 — Topnav Cleanup

> [!abstract] Goal
> Fix the flat visual hierarchy of the workspace topnav — collapse secondary actions (Share, Settings, manual Save) into a ⋯ overflow menu, replace the Save button with the quiet autosave status chip, and promote AI to the single high-emphasis button.

## Background

The topnav right side currently renders five same-weight outline buttons (Save · Settings · Templates · Share · AI), so nothing signals importance. Design decisions (2026-07-09 brainstorm, human-approved):

- **Primary actions:** AI and Templates stay top-level.
- **Save:** autosave (spec 26) makes the button redundant — it becomes the existing `SaveStatusIndicator` chip. Manual save survives in the overflow menu + `Ctrl/Cmd+S`.
- **Share / Settings:** collapse into a ⋯ overflow dropdown. The Clerk-avatar-menu alternative was considered and rejected (hides project actions inside an account menu; the nav avatar was removed 2026-07-09, Liveblocks presence stack on canvas is the only avatar).

> [!note] History
> Spec 26's post-merge change replaced the navbar `SaveStatusIndicator` pill with a manual Save button. This spec reverses that — the chip returns, but manual save is preserved via the overflow menu and keyboard shortcut, plus a clickable error chip for retry.

## Final Layout

```text
[sidebar toggle] project name        ✓ Saved  [⊞ Templates]  [✦ AI]  [⋯]
```

Right side, left→right:

1. **Save status chip** — non-interactive for `saving`/`saved`; hidden when `idle`; `error` state is clickable → `triggerSave` (tooltip "Retry save").
2. **Templates** — unchanged outline button.
3. **AI** — filled `accent-ai` style at all times (not only when the panel is open); open state deepens/brightens it (pressed look). The nav's only high-emphasis element.
4. **⋯ overflow** — icon-only outline button opening a shadcn `DropdownMenu`:
   - Share (Share2 icon) → existing share dialog
   - Settings (Settings icon) → existing settings modal
   - Save (Save icon, `Ctrl+S` shortcut hint) → `triggerSave`

## Scope Limits

- Do not change the left side of the nav (sidebar toggle, project name)
- Do not change canvas presence avatars or any dialog internals
- Do not change autosave behavior (`use-canvas-autosave` timing, endpoints)

## File Map

| File | Change |
|---|---|
| `package-lock.json` | Delete — project migrates to pnpm |
| `pnpm-lock.yaml` | Create — via `pnpm import` (preserves npm resolutions) |
| `pnpm-workspace.yaml` | Create — `allowBuilds` approvals for native/binary postinstalls |
| `package.json` | Add `packageManager: pnpm@11.11.0` |
| `components/ui/dropdown-menu.tsx` | Create — via `shadcn` CLI |
| `components/editor/shell/workspace-navbar.tsx` | Rewrite right side: delete `SaveButton`, mount `SaveStatusIndicator`, promote AI button, add ⋯ overflow menu |
| `components/editor/canvas/save-status-indicator.tsx` | Add clickable error state (`onRetry` prop, tooltip "Retry save") |
| `components/editor/shell/workspace-shell.tsx` | Add `Ctrl/Cmd+S` keydown handler → `triggerSave`; pass retry/save handlers down |

## Tasks

- [x] #spec **Task 1: Migrate to pnpm + add shadcn DropdownMenu component** ✅ 2026-07-09
  1. Migrate package manager (human-directed 2026-07-09): delete `package-lock.json`, run `pnpm install` to generate `pnpm-lock.yaml`
  2. Verify the app still runs (`pnpm dev`)
  3. `pnpm dlx shadcn@latest add dropdown-menu`
  4. Confirm it uses vault theme tokens (bg-elevated, border-default) per ui-context conventions

- [x] #spec **Task 2: SaveStatusIndicator retry affordance** ✅ 2026-07-09
  1. Add optional `onRetry` prop; when set and status is `error`, render the chip as a button with tooltip "Retry save"
  2. `saving`/`saved` remain non-interactive; `idle` renders nothing

- [x] #spec **Task 3: Navbar rewrite** ✅ 2026-07-09
  1. Delete the `SaveButton` component from `workspace-navbar.tsx`
  2. Mount `<SaveStatusIndicator saveStatus={saveStatus} onRetry={onSave} />` first in the right-side group
  3. AI button: filled `accent-ai` always; deepen when `isAiOpen`
  4. Add ⋯ overflow `DropdownMenu` with Share, Settings, Save (Ctrl+S hint) items wired to existing handlers

- [x] #spec **Task 4: Ctrl/Cmd+S shortcut** ✅ 2026-07-09
  1. `keydown` listener in `workspace-shell.tsx`: Ctrl/Cmd+S → `preventDefault()` + `triggerSave`
  2. Guard: skip when `saveStatus === "saving"`

- [x] #spec **Task 5: Verification** ✅ 2026-07-09 _(human-verified: chip cycle, overflow items, Ctrl+S, error retry)_
  1. Run app; confirm chip cycles idle → saving → saved on canvas edits
  2. Confirm overflow items open share dialog, settings modal, and trigger a save
  3. Confirm Ctrl+S saves without opening the browser save dialog
  4. Simulate save failure; confirm error chip renders and clicking it retries

## Open Questions

_None_

---

_Tracked in [[progress]]_
