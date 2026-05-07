---
type: feature-spec
feature: "01 — Design System"
status: shipped
updated: 2026-05-06
---

# Feature 01 — Design System

> [!abstract] Goal
> Configure shadcn/ui, install the seven core UI primitives, and establish the `cn()` utility.

> [!success] Shipped
> All components installed and verified. `cn()` helper in `libs/utils.ts`. No default light styling.

**References:** [[ui-context]] · [[code-standards]]

---

We're adding the design system and UI primitives components.

Install and configure `shadcn/ui`.

Add these shadcn components:

- [ ] Button
- [ ] Card
- [ ] Dialog
- [ ] Input
- [ ] Tabs
- [ ] Textarea
- [ ] ScrollArea

Do not modify the generated `components/ui/*` files after installation.

Also install `lucide-react` for icons.

Create `libs/utils.ts` with a reusable `cn()` helper for merging Tailwind classes.

Ensure all components match the existing dark theme in the `global.css` file.

## Check when done

- [ ] All components import without errors
- [ ] `cn()` helper correctly merges classes
- [ ] No default light styling appears

---

*Tracked in [[progress-tracker]]*
