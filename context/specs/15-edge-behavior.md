---
type: feature-spec
feature: "15-edge-behavior — edge-behavior"
status: shipped
updated: 2026-05-31
---

# Feature 15-edge-behavior — edge-behavior

> [!abstract] Goal
> Replace the default canvas edges with custom edges that are easier to follow, easier to click, and support inline labels.

**References:** [[architecture-context]] · [[code-standards]]

---

## Implementation

- [x] Add a default style for new edges.
	- [x] use a light stroke with rounded ends
	- [x] add an arrowhead at the end of each edge
	- [x] make new connections use the custom canvas edge renderer
- [x] Create the custom edge renderer.
	- [x] use clean right-angle routing
	- [x] keep edges slightly dimmed at rest
	- [x] brighten edges when hovered or selected
	- [x] make edges easier to hover and click without increasing the visible line thickness
- [x] Add inline edge label editing.
	- [x] double-click an edge to edit its label
	- [x] use React Flow's `EdgeLabelRenderer` and the path midpoint coordinates from `getSmoothStepPath` to position the label — do not calculate midpoint position manually
	- [x] use an input that grows with the label text
	- [x] save the label on blur, Enter, or Escape
	- [x] show saved labels as small pill badges
	- [x] when an active edge has no label, show a faint hint
	- [x] prevent label clicks and typing from dragging or panning the canvas
	- [x] update labels through the existing collaborative edge data flow

## Scope

- don't change how nodes are created
- don't change the shape panel
- don't redesign the node renderer beyond the required connection handles
- keep this focused on edge rendering, labels, and connection behavior

## Check when done

- New edges use the custom canvas edge type with arrows.
- Edge hover, selection, and label editing are handled in the custom edge renderer.
- Edge label position uses `EdgeLabelRenderer` and path midpoint coordinates.
- Edge labels update through the existing edge data flow.
- `npm run build` passes without type errors.

---

_Tracked in [[progress-tracker]]_
