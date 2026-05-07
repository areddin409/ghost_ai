---
type: feature-spec
feature: "02 — Editor Chrome"
status: shipped
updated: 2026-05-06
---

# Feature 02 — Editor Chrome

> [!abstract] Goal
> Build the editor navbar and floating project sidebar shell that frames the editor workspace.

> [!success] Shipped
> Navbar and sidebar compile without errors. Sidebar floats without pushing content. Dialog pattern ready.

**References:** [[ui-context]] · [[code-standards]]

---

We need the base chrome components that frame editor screen - the top navbar and the left sidebar shell. These will be reused and extended in every chapter that follows.

## Editor Navbar

Create `components/editor/editor-navbar.tsx`

Requirements:

- [x] Fixed-height top navbar ✅ 2026-05-06
- [x] left, center, and right sections ✅ 2026-05-06
- [x] left section contains sidebar toggle button ✅ 2026-05-06
- [x] use `PanelLeftOpen` / `PanelLeftClose` icons based on sidebar state ✅ 2026-05-06
- [x] right section stays empty for now ✅ 2026-05-06
- [x] dark background with subtle bottom border ✅ 2026-05-06

## Project Sidebar

Create `components/editor/project-sidebar.tsx`

Requirements:

- [x] sidebar should float above the editor canvas ✅ 2026-05-06
- [x] opening it should not push page content ✅ 2026-05-06
- [x] slides in from the left ✅ 2026-05-06
- [x] accepts `isOpen` prop to control visibility ✅ 2026-05-06
- [x] header with `Projects` title + close button ✅ 2026-05-06
- [x] shadcn `Tabs`: ✅ 2026-05-06
  - [x] `My Projects` ✅ 2026-05-06
  - [x] `Starred` ✅ 2026-05-06
- [x] both tabs show empty placeholder state for now ✅ 2026-05-06
- [x] full-width `New Project` button at the bottom with `Plus` icon ✅ 2026-05-06

## Dialog Pattern

use the existing color tokens from `global.css` for dialog styling.

Support:

- [x] title ✅ 2026-05-06
- [x] description ✅ 2026-05-06
- [x] footer actions ✅ 2026-05-06

do not build actual dialogs yet.

## Check when done

- [x] new components compile without TypeScript errors ✅ 2026-05-06
- [x] no lint warnings or errors ✅ 2026-05-06
- [x] dialog pattern is ready for future use ✅ 2026-05-06

---

*Tracked in [[progress-tracker]]*
