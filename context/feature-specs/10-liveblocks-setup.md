---
type: feature-spec
feature: "10 — Liveblocks Setup"
status: shipped
updated: 2026-05-23
---

# Feature 10 — Liveblocks Setup

> [!abstract] Goal
> Set up the Liveblocks realtime collaboration infrastructure with auth route and user metadata.

> [!success] Shipped
> Config, cached client, and auth route working. User metadata attached to sessions. Build passes.

**References:** [[architecture-context]] · [[code-standards]]

---

Set up the realtime collaboration infrastructure using Liveblocks.

## Configuration

Configure `liveblocks.config.ts` at the project root.

### Presence

- [x] cursor position
- [x] `isThinking` boolean

### Metadata

- [x] user ID
- [x] display name
- [x] avatar URL
- [x] cursor color

## Liveblocks Client

Create a cached Liveblocks node client in `lib`.

Add a helper that deterministically maps a user ID to a consistent color from a fixed palette.

## Auth Route

Create `POST /api/liveblocks-auth`.

Use the project ID as the Liveblocks room ID.

This route must:

- [x] require Clerk authentication
- [x] verify project access using the existing access helper
- [x] ensure the Liveblocks room exists (create only if needed)
- [x] return a session token with:
  - [x] user name
  - [x] avatar
  - [x] generated cursor color

Return `403` for unauthorized project access.

## Dependencies

All required Liveblocks packages are already installed.

## Check when done

- [x] `liveblocks.config.ts` defines Presence and UserMeta
- [x] Liveblocks client is cached
- [x] auth route verifies project access
- [x] user metadata is attached to sessions
- [x] `npm run build` passes

---

_Tracked in [[progress-tracker]]_
