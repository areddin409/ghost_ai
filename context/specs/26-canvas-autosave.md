---
type: spec
id: 26
title: Canvas Autosave
status: active
phase: 2
updated: 2026-07-05
---

# Spec 26 — Canvas Autosave

> [!abstract] Goal
> Persist canvas state to Vercel Blob before AI generation is added — autosave debounces writes from the canvas, a GET/PUT API pair handles storage, and the editor loads saved state only into an empty Liveblocks room.

## Scope Limits

- Do not implement AI generation (that is a future spec)
- Do not change canvas node, edge, or presence behavior
- Do not add authentication beyond what the existing project-access helpers already enforce
- Save only triggers from user canvas interaction — do not auto-save on room join or page load
- Load skips entirely if the Liveblocks room already has nodes or edges

## Storage Pattern

| Layer | Responsibility |
|---|---|
| Prisma (`Project.canvasBlobUrl`) | Stores the Vercel Blob URL for the project's canvas JSON |
| Vercel Blob | Stores the actual canvas JSON (nodes + edges) |

Prisma is metadata-only — it never holds raw canvas JSON.

## File Map

| File | Change |
|---|---|
| `prisma/models/project.prisma` | Rename `canvasJsonPath` → `canvasBlobUrl` |
| `prisma/migrations/` | New migration for the rename |
| `app/api/projects/[projectId]/canvas/route.ts` | Create — PUT (upload + save URL) and GET (read URL + fetch JSON) |
| `hooks/use-canvas-autosave.ts` | Create — debounced autosave hook with save-status state |
| `components/editor/canvas/canvas.tsx` | Wire autosave hook; add load-on-empty-room logic |
| `components/editor/canvas/save-status-indicator.tsx` | Create — small UI chip showing saving / saved / error |
| `components/editor/shell/workspace-navbar.tsx` | Mount `<SaveStatusIndicator>` near the Save button |

## Tasks

- [x] #spec **Task 1: Install @vercel/blob**
  1. Run `npm install @vercel/blob`
  2. Add `BLOB_READ_WRITE_TOKEN` to `.env.local` (document in spec notes below)

- [x] #spec **Task 2: Rename Prisma field** _(migration file was lost uncommitted; recovered 2026-07-05 — DB had it applied 2026-06-03 as `20260603202126`, file recreated and history reconciled)_
  1. In `prisma/models/project.prisma` rename `canvasJsonPath String?` → `canvasBlobUrl String?`
  2. Run `npx prisma migrate dev --name rename_canvas_json_path_to_canvas_blob_url`
  3. Search codebase for any existing reference to `canvasJsonPath` and update to `canvasBlobUrl`

- [ ] #spec **Task 3: PUT /api/projects/[projectId]/canvas** _(unchecked 2026-07-05 — was marked done but `route.ts` does not exist on disk)_
  1. Create `app/api/projects/[projectId]/canvas/route.ts`
  2. Require auth via `getCurrentIdentity()` and ownership via `getProjectWithAccess()`
  3. Accept `{ nodes, edges }` JSON body
  4. Upload to Vercel Blob: `put(\`canvas/${projectId}.json\`, JSON.stringify(body), { access: 'public', contentType: 'application/json' })`
  5. Upsert `project.canvasBlobUrl` with the returned blob URL via Prisma
  6. Return `{ url }` with 200

- [ ] #spec **Task 4: GET /api/projects/[projectId]/canvas** _(unchecked 2026-07-05 — was marked done but `route.ts` does not exist on disk)_
  1. In the same route file, add a `GET` handler
  2. Require auth and project access (collaborators can read)
  3. Read `project.canvasBlobUrl` from Prisma
  4. If null, return `{ nodes: [], edges: [] }` with 200
  5. Fetch the blob URL and return its parsed JSON as-is

- [ ] #spec **Task 5: useCanvasAutosave hook** _(unchecked 2026-07-05 — was marked done but `use-canvas-autosave.ts` does not exist on disk)_
  1. Create `hooks/use-canvas-autosave.ts`
  2. Accept `{ projectId, nodes, edges }` as params
  3. Debounce saves at 1500ms using `useCallback` + `useRef` timer
  4. On each debounced fire, `PUT /api/projects/[projectId]/canvas` with current nodes + edges
  5. Track `saveStatus: 'idle' | 'saving' | 'saved' | 'error'` in local state
  6. Return `{ saveStatus }` — no other side effects

- [ ] #spec **Task 6: Load saved state into empty room**
  1. In `components/editor/canvas/canvas.tsx`, after Liveblocks nodes/edges are available, check if both are empty (`nodes.length === 0 && edges.length === 0`)
  2. If empty, fetch `GET /api/projects/[projectId]/canvas`
  3. If the response contains nodes or edges, write them to Liveblocks storage via `useMutation`
  4. Guard with a `useRef` loaded flag so the load fires once per room session, not on every render
  5. If the room already has nodes or edges, skip the fetch entirely

- [ ] #spec **Task 7: SaveStatusIndicator component**
  1. Create `components/editor/canvas/save-status-indicator.tsx`
  2. Accept `saveStatus: 'idle' | 'saving' | 'saved' | 'error'`
  3. Render a small pill: hidden when idle, spinner + "Saving…" when saving, checkmark + "Saved" when saved, warning icon + "Error" when error
  4. Use existing CSS variables — no new color tokens

- [ ] #spec **Task 8: Wire into WorkspaceNavbar**
  1. In `components/editor/shell/workspace-navbar.tsx`, accept `saveStatus` prop
  2. Mount `<SaveStatusIndicator saveStatus={saveStatus} />` adjacent to the Save button
  3. Pass `saveStatus` down from `canvas.tsx` via a shared prop or context

- [ ] #spec **Task 9: Verify and build**
  1. Run `npm run build` — confirm zero errors
  2. Open editor in two tabs; make canvas changes in one tab
  3. Wait 1.5s — confirm "Saved" status appears
  4. Reload the tab — confirm canvas state is restored only when the room was empty
  5. With two tabs open (room active), reload a third — confirm it does NOT overwrite live room state

## Environment Variables

| Variable | Purpose |
|---|---|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob write token — add to `.env.local` and Vercel project settings |

## Open Questions

_None_

---

## Shipped

_Not yet shipped._

---

_Tracked in [[progress]]_
