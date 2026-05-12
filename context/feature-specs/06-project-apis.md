---
type: feature-spec
feature: "06 — Project APIs"
status: shipped
updated: 2026-05-06
---

# Feature 06 — Project APIs

> [!abstract] Goal
> Build the authenticated REST endpoints for project list, create, rename, and delete.

> [!success] Shipped
> All four routes exist. Owner checks enforced. `401` and `403` handled correctly. Build passes.

**References:** [[architecture-context]] · [[code-standards]]

---

The database schema is ready. Build the backend project API routes only.

## Sequence Diagram

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {
  'actorBkg': '#2d1f63',
  'actorBorder': '#7c6ef9',
  'actorTextColor': '#ffffff',
  'actorLineColor': '#7c6ef9',
  'signalColor': '#00e5ff',
  'signalTextColor': '#ffffff',
  'activationBkgColor': '#0d2e2e',
  'activationBorderColor': '#00c8d4',
  'noteBkgColor': '#1e1e2e',
  'noteTextColor': '#ffffff',
  'labelBoxBkgColor': '#1e1e2e',
  'labelBoxBorderColor': '#7c6ef9',
  'labelTextColor': '#ffffff'
}}}%%
sequenceDiagram
    participant C as Client
    participant R as API Route
    participant K as Clerk
    participant DB as Database

    Note over C,DB: All routes — auth guard
    C->>R: any request
    R->>K: auth() → userId
    K-->>R: null → R-->>C: 401 Unauthorized

    Note over C,DB: GET /api/projects
    C->>R: GET /api/projects
    R->>DB: findMany owned + findMany shared by email
    DB-->>R: project lists
    R-->>C: 200 { owned, shared }

    Note over C,DB: POST /api/projects
    C->>R: POST { name, id? }
    R->>DB: project.create({ ownerId: userId })
    DB-->>R: project
    R-->>C: 201 project

    Note over C,DB: PATCH /api/projects/[id]
    C->>R: PATCH { name }
    R->>DB: project.findUnique(id)
    DB-->>R: project
    Note right of R: ownerId ≠ userId → 403 Forbidden
    R->>DB: project.update({ name })
    DB-->>R: updated project
    R-->>C: 200 project

    Note over C,DB: DELETE /api/projects/[id]
    C->>R: DELETE
    R->>DB: project.findUnique(id)
    DB-->>R: project
    Note right of R: ownerId ≠ userId → 403 Forbidden
    R->>DB: project.delete(id)
    DB-->>R: deleted
    R-->>C: 204 No Content
```

## Routes

Create REST endpoints for:

- [x] `GET /api/projects` , -> list current user's projects
- [x] `POST /api/projects` -> create project
- [x] `PATCH /api/projects/[projectId]` -> rename project
- [x] `DELETE /api/projects/[projectId]` -> delete project

## Rules

Use the authenticated Clerk user ID as 'ownerId'

When Creating:

- [x] default missing project name to `Untitled Project`
- [x] use the schema's existing ID strategy, do not add sequential ID's

Security:

- [x] unauthenticated requests return `401`
- [x] only the project owner can rename or delete
- [x] non-owner mutations return `403`

Keep this backend only, do not wire the UI yet.

## Check when done

- [x] routes exist for list/create/rename/delete
- [x] owner checks are enforced for rename/delete
- [x] `401` & `403` responses are handled correctly
- [x] `npm run build` passes

---

*Tracked in [[progress-tracker]]*
