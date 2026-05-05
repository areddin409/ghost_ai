Clerk is already installed and connected. wire it into the next.js app: provider, auth pages, redirects, route protection, and user menu.

## Design

Use Clerk's `dark` theme form `@clerk/ui/themes` as the base.

Override Clerk appearance variables using the app's existing CSS variables. Do not hardcode colors.

### Sign-in and Sign-up Pages

- [ ] large screens: simple two-panel layout
- [ ] left: compact logo, tagline, short text-only feature list
- [ ] right: centered Clerk form
- [ ] small screens: form only
- [ ] no gradients
- [ ] no oversized hero sections
- [ ] no feature cards
- [ ] no scroll heavy layouts

Keep the layout minimal and professional

## Implementation

Wrap the root layout with `ClerkProvider` using Clerk's `dark` theme.

Create sign-in and sign-up pages using Clerk components.

use `proxy.ts` at the project root, not `middleware.ts`

define public routes using the existing sign-in and sign-up env vars. Protect everything else by default.

update `/`:

- [ ] authenticated users redirect to `/editor`
- [ ] unauthenticated users redirect to `/sign-in`

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
