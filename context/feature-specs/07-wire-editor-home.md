---
type: feature-spec
feature: "07 — Wire Editor Home"
status: shipped
updated: 2026-05-06
---

# Feature 07 — Wire Editor Home

> [!abstract] Goal
> Connect the editor home sidebar and dialogs to the real project API with server-side data fetching.

> [!success] Shipped
> Sidebar uses real project data. Create navigates to workspace. Rename and delete work. Build passes.

**References:** [[architecture-context]] · [[ui-context]] · [[code-standards]]

---

Wire the editor home sidebar and dialogs to the real project API.

### Data Fetching

The editor home page is a server component.

Fetch owned and shared projects server side using the existing project data helper and pass both lists to the sidebar.

No client-side fetching for initial load.

### `Use Project Actions`

Create a hook in `hooks/` that manages dialog state and project mutations.

**Create**

- [x] manage create dialog state
- [x] manage project name input
- [x] generate a short unique suffix
- [x] slugify the name to create the room Id
- [x] call `POST /api/projects`
- [x] navigate to the new workspace

the project ID and liveblocks room id should stay aligned.

**Rename**

- [x] store target project id + current name
- [x] call `PATCH /api/projects/[id]`
- [x] refresh on success

**Delete**

- [x] store target project
- [x] call `DELETE /api/projects/[id]`
- [x] redirect to `/editor` if deleting the active workspace
- [x] otherwise refresh

### Wiring

Connect the hook to the sidebar and dialogs

- [x] create dialog shows room ID preview
- [x] rename dialog pre-fills current name
- [x] delete dialog show project name

### Check when done

- [x] sidebar uses real project data
- [x] create navigates to workspace
- [x] rename updates correctly
- [x] delete refreshes or redirects correctly
- [x] `npm run build` passes

---

*Tracked in [[progress-tracker]]*
