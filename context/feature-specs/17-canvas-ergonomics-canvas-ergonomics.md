---
type: feature-spec
feature: "17-canvas-ergonomics — canvas-ergonomics"
status: shipped
updated: 2026-05-30
---

# Feature 17-canvas-ergonomics — canvas-ergonomics

> [!abstract] Goal
> Add a floating control bar for zoom and undo/redo, then wire the same actions to keyboard shortcuts.

**References:** [[architecture-context]] · [[code-standards]]

---

## Implementation

- [x] Add a pill-shaped control bar at the bottom-left of the canvas
	- [x] it should sit above the shape panel and include two groups:
		- [x] zoom controls: zoom out, fit view, zoom in
		- [x] history controls: undo, redo
	- [x] Separate the two groups with a thin divider.
- [x] Wire the zoom controls to the React Flow instance.
	- [x] zoom in/out
	- [x] fit view
	- [x] use a short animation so the movement feels smooth
- [x] Wire undo and redo to Liveblocks history
	- [x] use the existing Liveblocks undo/redo blocks 
	- [x] diable undo when there is nothing to undo 
	- [x] disable redo when there is nothing to redo
	- [x] keep disabled buttons visually dimmed
- [x] Create a `useKeyboardShortcuts` hook in `hooks/`
	- [x] The hook should
		- [x] receive the React Flow instance
		- [x] receive undo and redo handles
		- [x] listen for keyboard shortcuts on `window`
		- [x] ignore shortcuts while typing in inputs, textareas, or editable text fields
- [x] Support these shortcuts
	- [x] `+` or = to zoom in
	- [x] `-` to zoom out
	- [x] `Cmd/Ctrl + Z` to undo
	- [x] `Cmd/Ctrl + Shift + Z` to redo
	- [x] `Cmd/Ctrl + Y` to redo
	- [x] `Home` to fit view

## Scope

- don't change the shape panel
- don't change node or edge rendering
- don't add extra canvas controls
- don't change the existing collaborative state setup

## Check when done

- [x] `npm run build` passes
- [x] Control bar is added to the canvas.
- [x] Zoom actions use the React Flow instance.
- [x] Undo and redo use Liveblocks history.
- [x] Keyboard shortcuts are handled in `hooks/useKeyboardShortcuts`.
- [x] Shortcut handling skips editable fields.

---

_Tracked in [[progress-tracker]]_
