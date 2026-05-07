---
type: feature-spec
feature: "03 — Auth"
status: shipped
updated: 2026-05-06
---

# Feature 03 — Auth

> [!abstract] Goal
> Wire Clerk authentication into Next.js — provider, route protection, auth pages, and user menu.

> [!success] Shipped
> All routes protected via `proxy.ts`. Auth pages use CSS variables. `ClerkProvider` wraps root layout. Build passes.

**References:** [[architecture-context]] · [[ui-context]] · [[code-standards]]

---

Clerk is already installed and connected. wire it into the next.js app: provider, auth pages, redirects, route protection, and user menu.

## Design

Use Clerk's `dark` theme from `@clerk/ui/themes` as the base.

Override Clerk appearance variables using the app's existing CSS variables. Do not hardcode colors.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {
  'background': '#0d0d12',
  'mainBkg': '#1a1a2e',
  'primaryColor': '#1a1a2e',
  'primaryBorderColor': '#6457f9',
  'primaryTextColor': '#e8e8f0',
  'lineColor': '#3a3a42',
  'secondaryColor': '#1a1a2e',
  'tertiaryColor': '#0d0d12',
  'actorBkg': '#1a1a2e',
  'actorBorder': '#6457f9',
  'actorTextColor': '#e8e8f0',
  'actorLineColor': '#3a3a42',
  'signalColor': '#00c8d4',
  'signalTextColor': '#e8e8f0',
  'labelBoxBkgColor': '#1a1a2e',
  'labelBoxBorderColor': '#3a3a42',
  'labelTextColor': '#e8e8f0',
  'noteBkgColor': '#1a1a2e',
  'noteTextColor': '#e8e8f0',
  'activationBorderColor': '#6457f9',
  'activationBkgColor': '#1a1a2e',
  'edgeLabelBackground': '#1a1a2e'
}}}%%
sequenceDiagram
    participant B as Browser
    participant M as Middleware (proxy.ts)
    participant C as Clerk

    B->>M: GET /editor (no session)
    M->>C: Verify session token
    C-->>M: Unauthenticated
    M-->>B: 302 → /sign-in

    B->>M: POST /sign-in (credentials)
    M->>C: Authenticate
    C-->>M: Session token
    M-->>B: 302 → /editor

    B->>M: GET /editor (with session)
    M->>C: Verify session token
    C-->>M: Valid
    M-->>B: 200 /editor
```

### Sign-in and Sign-up Pages

- [x] large screens: simple two-panel layout ✅ 2026-05-06
- [x] left: compact logo, tagline, short text-only feature list ✅ 2026-05-06
- [x] right: centered Clerk form ✅ 2026-05-06
- [x] small screens: form only ✅ 2026-05-06
- [x] no gradients ✅ 2026-05-06
- [x] no oversized hero sections ✅ 2026-05-06
- [x] no feature cards ✅ 2026-05-06
- [x] no scroll heavy layouts ✅ 2026-05-06

Keep the layout minimal and professional

## Implementation

Wrap the root layout with `ClerkProvider` using Clerk's `dark` theme.

Create sign-in and sign-up pages using Clerk components.

use `proxy.ts` at the project root, not `middleware.ts`

define public routes using the existing sign-in and sign-up env vars. Protect everything else by default.

update `/`:

- [x] authenticated users redirect to `/editor` ✅ 2026-05-06
- [x] unauthenticated users redirect to `/sign-in` ✅ 2026-05-06

Add Clerk's built-in `UserButton` to the editor navbar's right section for profile settings and logout.

keep clerk's default user menu and profile flows intact. do not rebuild or heavily customize clerk internals.

use existing clerk env vars. do not rename or invent new ones.

## Dependencies

install: @clerk/ui.

## Check when done

- `proxy.ts` exists at the root
- all routes are protected except public auth paths
- auth pages use CSS variables with no hardcoded colors
- `ClerkProvider` wraps the root layout
- `npm run build` completes without errors

---

*Tracked in [[progress-tracker]]*
