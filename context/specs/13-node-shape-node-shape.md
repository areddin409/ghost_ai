---
type: feature-spec
feature: "13-node-shape — node-shape"
status: shipped
updated: 2026-05-29
---

# Feature 13-node-shape — node-shape

> [!abstract] Goal
> Replace the placeholder node renderer with proper shape rendering and a drag preview

**References:** [[architecture-context]] · [[code-standards]]

---

## Implementation

- [x] Replace the placeholder node shape rendering.
	- [x] rectangle, pill, and circle should use CSS styling.
	- [x] diamond, hexagon, and cylinder should render with SVG shapes.
	- [x] SVG shapes should scale with node size.
	- [x] keep borders subtle at rest and brighter when selected.
- [x] Add a shape drag preview.
	- [x] when dragging a shape from the shape panel, show a ghost preview of that shape.
	- [x] keep the preview attached to the cursor while dragging
	- [x] use the same shape type and default size that will be used on drop
	- [x] hide the preview after the shape is dropped or the drag is cancelled
	- [x] keep this limited to drag preview behavior only
- [x] keep node rendering connected to the existing collaborative canvas state.

## Scope

- Don't rebuild shape panel layout
- don't change how dropped nodes are created
- don't add resize or label editing yet
- keep drag/drop changes limited to the ghost preview only

## Check when done

- [x] Nodes render the correct shape variant for each type
- [x] CSS shapes render correctly for rectangle, pill and circle
- [x] SVG shapes render and scale correctly for diamond, hexagon, and cylinder
- [x] Shape dragging shows a ghost preview matching the dragged shape.
- [x] `npm run build` passes

---

_Tracked in [[progress-tracker]]_
