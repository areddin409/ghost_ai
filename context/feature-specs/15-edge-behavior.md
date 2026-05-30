---
type: feature-spec
feature: "15-edge-behavior — edge-behavior"
status: planned
updated: 2026-05-30
---

# Feature 15-edge-behavior — edge-behavior

> [!abstract] Goal
> Replace the default canvas edges with custom edges that are easier to follow, easier to click, and support inline labels.

**References:** [[architecture-context]] · [[code-standards]]

---

## Implementation

- [ ] Add a default style for new edges.
	- [ ] use a light stroke with rounded ends
	- [ ] add an arrowhead at the end of each edge
	- [ ] make new connections use the custom canvas edge renderer
- [ ] Create the custom edge renderer.
	- [ ] use clean right-angle routing
	- [ ] keep edges slightly dimmed at rest
	- [ ] brighten edges when hovered or selected
	- [ ] make edges easier to hover and click without increasing the visible line thickness
- [ ] Add inline edge label editing.
	- [ ] double-click an edge to edit its label
	- [ ] use React Flow's `EdgeLabelRenderer` and the path midpoint coordinates from `getSmoothStepPath` to position the label — do not calculate midpoint position manually
	- [ ] use an input that grows with the label text
	- [ ] save the label on blur, Enter, or Escape
	- [ ] show saved labels as small pill badges
	- [ ] when an active edge has no label, show a faint hint
	- [ ] prevent label clicks and typing from dragging or panning the canvas
	- [ ] update labels through the existing collaborative edge data flow

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
