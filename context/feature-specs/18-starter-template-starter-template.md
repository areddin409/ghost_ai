---
type: feature-spec
feature: "18-starter-template — starter-template"
status: shipped
updated: 2026-05-31
---

# Feature 18-starter-template — starter-template

> [!abstract] Goal
> Add a small starter template library so users can start a canvas from a pre-built diagram instead of building from scratch.

**References:** [[architecture-context]] · [[code-standards]]

---

## Implementation

- [x] Create `components/editor/starter-templates.ts`
	- [x] Define a `CanvasTemplate` type
	- [x] Define a `CANVAS_TEMPLATES` array with at least three templates (e.g. microservices, CI/CD pipeline, event-driven system)
	- [x] Each template includes `id`, `name`, `description`, `nodes`, and `edges`
	- [x] Use shared canvas types and the existing node color palette
	- [ ] Add small helper functions if needed to keep template data readable
- [x] Create `components/editor/starter-templates-modal.tsx`
	- [x] Open as a dialog
	- [x] Show template cards in a scrollable grid
	- [x] Show template name and description on each card
	- [x] Include an import button for each template
	- [x] Call `onImport` with the selected template, then close the dialog
- [x] Add a diagram preview to each template card
	- [x] Fit the preview to a fixed-size viewport
	- [x] Calculate preview bounds from template node positions
	- [x] Draw edges as simple lines between node centers
	- [x] Draw nodes using their shape and color data
	- [x] Keep the preview lightweight — no React Flow instance needed
- [x] Wire starter templates into the editor
	- [x] Add a navbar button to open the starter templates modal
	- [x] When a template is selected, clear all existing nodes and edges first
	- [x] Add the selected template's nodes and edges after the canvas is cleared
	- [x] Ensure the template replaces the current canvas (not added on top)
	- [x] Fit the view after the template is loaded
	- [x] Keep this inside the existing collaborative canvas state

## Scope

- don't add template saving yet
- don't add custom user templates
- don't add server persistence
- don't change node or edge rendering behavior
- keep this focused on importing predefined templates

## Check when done

- [x] Template data is defined using shared canvas types
- [x] Import modal renders template cards with previews
- [x] Import action replaces the current canvas through the existing node and edge state flow
- [x] Editor navbar includes the import entry point
- [x] `npm run build` passes

---

_Tracked in [[progress-tracker]]_
