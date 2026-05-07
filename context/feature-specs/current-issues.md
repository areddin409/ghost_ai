---
type: issue-log
status: open
updated: 2026-05-06
---

# Current Issues

> [!bug] Loading state never renders
> **Severity:** high
> **File:** `hooks/use-project-dialogs.ts`
> **Feature:** [[04-project-dialogs]]
>
> `isLoading` is set to `true` then immediately back to `false` in the same synchronous execution. React batches these updates so the UI never sees the loading state. Wrap the state-mutating logic in `setTimeout(() => { ... }, 500)` or replace with a genuine async operation.

> [!bug] Starred tab shows shared projects instead
> **Severity:** medium
> **File:** `components/editor/project-sidebar.tsx`
> **Feature:** [[04-project-dialogs]]
>
> `sharedProjects` filters by `!p.isOwned` but populates the "Starred" tab. Starred and shared are different concepts. Either rename the tab to "Shared" or filter by a `starred` / `isFavorite` flag instead.

> [!bug] Hidden buttons remain keyboard-focusable
> **Severity:** medium
> **File:** `components/editor/project-sidebar.tsx`
> **Feature:** [[04-project-dialogs]]
>
> Rename and delete buttons use `opacity-0` to hide but remain in the tab order. Add `tabIndex={hovered ? 0 : -1}` to both buttons to prevent keyboard focus when hidden.

> [!bug] Empty slug passes validation
> **Severity:** medium
> **File:** `components/editor/project-dialogs.tsx`
> **Feature:** [[04-project-dialogs]]
>
> `toSlug()` returns an empty string for names containing only special characters (e.g. `!!!`). The submit button only checks `createName.trim()`, not the slug result. Update the disabled condition to: `disabled={!createName.trim() || !toSlug(createName) || isLoading}`.

---

*Part of [[README|Ghost AI Vault]]*
