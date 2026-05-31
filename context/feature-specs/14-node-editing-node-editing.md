---
type: feature-spec
feature: "14-node-editing — node-editing"
status: shipped
updated: 2026-05-29
---

# Feature 14-node-editing — node-editing

> [!abstract] Goal
> Add resizing, ability to connect nodes, and inline label editing to canvas nodes.

**References:** [[architecture-context]] · [[code-standards]]

---

## Implementation

- [x] Add resizing
	- [x] selected nodes should show resize handles
	- [x] prevent nodes from being resized below a minimum size
	- [x] keep resize handles subtle and consistent with the dark canvas UI
- [x] add inline label editing
	- [x] keep the node label centered inside the node
	- [x] double click the center/label area of a node to edit its label
	- [x] show placeholder text in the same centered position when the label is empty
	- [x] keep editing smooth without causing layout shifts
	- [x] show a textarea directly over the label while editing
	- [x] update the label as user type
	- [x] close editing on blur or `Escape`
	- [x] prevent text editing interactions from dragging or panning the canvas
- [x] keep all node updates connected to the existing collaborative canvas state.
- [x] add connection points to each node 
	- [x] use liveblocks best practices when added points 
	- [x] points should be able to connect to other nodes

## Scope

- don't change shape rendering from the previous unit
- don't change the shape panel or drag preview
- don't change how dropped nodes are created
- keep this focused on resize, connections and label editing only

## Check when done

- Selected nodes show resize handles.
- Resizing updates node dimensions through the existing node state flow.
- Double-clicking a node opens inline label editing.
- Label editing updates node labels through the existing sync flow.
- Editing closes on blur or Escape.
- Text interactions do not trigger canvas drag or pan.
- Connection points are visible on each node.
- Connection points follow Liveblocks best practices for collaborative state.
- Dragging from one connection point to another creates a connection between nodes.
- Connections persist and sync across collaborators via the existing Liveblocks storage flow.
- `npm run build` passes without type errors.

---

_Tracked in [[progress-tracker]]_
