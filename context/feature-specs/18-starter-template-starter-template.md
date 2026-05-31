---
type: feature-spec
feature: "18-starter-template — starter-template"
status: planned
updated: 2026-05-30
---

# Feature 18-starter-template — starter-template

> [!abstract] Goal
> Add a small starter template library so users can start a canvas from a pre-built diagram instead of building from scratch.

**References:** [[architecture-context]] · [[code-standards]]

---

## Implementation

- [ ] Create `components/editor/starter-templates.ts`
	- [ ] Define a `CanvasTemplate` type
	- [ ] Define a `CANVAS_TEMPLATES` array with at least three templates (e.g. microservices, CI/CD pipeline, event-driven system)
	- [ ] Each template includes `id`, `name`, `description`, `nodes`, and `edges`
	- [ ] Use shared canvas types and the existing node color palette
	- [ ] Add small helper functions if needed to keep template data readable
- [ ] Create `components/editor/starter-templates-modal.tsx`
	- [ ] Open as a dialog
	- [ ] Show template cards in a scrollable grid
	- [ ] Show template name and description on each card
	- [ ] Include an import button for each template
	- [ ] Call `onImport` with the selected template, then close the dialog
- [ ] Add a diagram preview to each template card
	- [ ] Fit the preview to a fixed-size viewport
	- [ ] Calculate preview bounds from template node positions
	- [ ] Draw edges as simple lines between node centers
	- [ ] Draw nodes using their shape and color data
	- [ ] Keep the preview lightweight — no React Flow instance needed
- [ ] Wire starter templates into the editor
	- [ ] Add a navbar button to open the starter templates modal
	- [ ] When a template is selected, clear all existing nodes and edges first
	- [ ] Add the selected template's nodes and edges after the canvas is cleared
	- [ ] Ensure the template replaces the current canvas (not added on top)
	- [ ] Fit the view after the template is loaded
	- [ ] Keep this inside the existing collaborative canvas state

## Scope

- don't add template saving yet
- don't add custom user templates
- don't add server persistence
- don't change node or edge rendering behavior
- keep this focused on importing predefined templates

## Check when done

- [ ] Template data is defined using shared canvas types
- [ ] Import modal renders template cards with previews
- [ ] Import action replaces the current canvas through the existing node and edge state flow
- [ ] Editor navbar includes the import entry point
- [ ] `npm run build` passes

---

_Tracked in [[progress-tracker]]_
