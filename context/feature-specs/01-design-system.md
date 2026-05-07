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

- [x] Button ✅ 2026-05-06
- [x] Card ✅ 2026-05-06
- [x] Dialog ✅ 2026-05-06
- [x] Input ✅ 2026-05-06
- [x] Tabs ✅ 2026-05-06
- [x] Textarea ✅ 2026-05-06
- [x] ScrollArea ✅ 2026-05-06

Do not modify the generated `components/ui/*` files after installation.

Also install `lucide-react` for icons.

Create `libs/utils.ts` with a reusable `cn()` helper for merging Tailwind classes.

Ensure all components match the existing dark theme in the `global.css` file.

## Check when done

- [x] All components import without errors ✅ 2026-05-06
- [x] `cn()` helper correctly merges classes ✅ 2026-05-06
- [x] No default light styling appears ✅ 2026-05-06

---

*Tracked in [[progress-tracker]]*
