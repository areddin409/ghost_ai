---
type: feature-spec
feature: "12 — Shape Panel"
status: shipped
updated: 2026-05-23
---

# Feature 12 — Shape Panel

> [!abstract] Goal
> Add a floating shape panel that lets users drag shapes onto the canvas as new nodes.

**References:** [[ui-context]] · [[code-standards]]

---

## Implementation

- [x] Add a floating pill-shaped toolbar at the bottom-center of the canvas
- [x] Add draggable icon buttons for these shapes:
  - [x] rectangle
  - [x] diamond
  - [x] circle
  - [x] pill
  - [x] cylinder
  - [x] hexagon
- [x] When dragging a shape, include the shape name and default size in the drag payload
  - [x] rectangles should be wider than tall
  - [x] circles should be square
  - [x] diamonds should be slightly larger so labels have room
- [x] Add `dragover` and `drop` handling to the canvas wrapper
- [x] On drop:
  - [x] read the dragged shape payload
  - [x] convert the screen position to canvas coordinates using React Flow
  - [x] create a new node at that position
  - [x] use an empty label
  - [x] use the default node color
  - [x] use the dragged shape value
- [x] Generate each node ID using the shape name, timestamp, and a counter
- [x] Add a basic renderer for the custom canvas node type so new nodes are visible
  - [x] render every shape as a simple bordered rectangle with the label centered
  - [x] shape-specific SVG visuals implemented: rectangle, pill, circle, diamond, hexagon, cylinder

## Check when done

- [x] shape drag payload includes the correct shape and size data
- [x] drop logic creates new canvas nodes with the expected shape data
- [x] new nodes use the custom canvas node type
- [x] `npm run build` passes

---

_Tracked in [[progress-tracker]]_
