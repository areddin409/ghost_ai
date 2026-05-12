Build the `/editor/[roomId]` workspace shell with server-side access checks. No canvas logic yet.

## Access

`/editor/[roomId]` must be a server component

Before rendering:

- [x] unauthenticated users redirect to `/sign-in`
- [x] users without project access see `AccessDenied`
- [x] non-existent projects also show `AccessDenied`

Create `components/editor/access-denied.tsx` with"

- [x] centered layout
- [x] lock icon
- [x] short message
- [x] link back to `/editor`

## Access helpers

Create `lib/project-access.ts` with helpers for:

- [x] getting current Clerk identity: `userId` + primary email
- [x] checking project access by owner or collaborator

## Layout

Build a full-viewport workspace layout with:

- [x] top navbar showing the project name
- [x] navbar actions: share button and AI sidebar toggle
- [x] existing `ProjectSidebar` on the left
- [x] current room highlighted in the sidebar
- [x] central canvas placeholder with dark background and centered message
- [x] right sidebar placeholder for future AI chat

the canvas area should fill the remaining space.

## Scope

Do not add real canvas logic, Liveblocks, AI chat or sharing behavior yet.

## Check when done

- [x] `/editor/[roomId]` builds successfully
- [x] access helper exists outside the page component
- [x] `AccessDenied` is used for missing or unauthorized projects
- [x] workspace layout renders with current project context
- [x] no TS errors

```mermaid
sequenceDiagram
  participant User
  participant EditorPage as EditorPage<br/>(Server)
  participant ProjectAccess as lib/project-access
  participant Database
  participant ClerkAPI as Clerk API
  participant WorkspaceShell as WorkspaceShell<br/>(Client)
  participant ShareDialog as ShareDialog

  User->>EditorPage: GET /editor/[roomId]
  EditorPage->>ProjectAccess: getCurrentIdentity()
  ProjectAccess->>ClerkAPI: auth() + currentUser()
  ClerkAPI-->>ProjectAccess: { userId, email }
  
  alt Unauthenticated
    ProjectAccess-->>EditorPage: null
    EditorPage-->>User: redirect /sign-in
  else Authenticated
    EditorPage->>ProjectAccess: getProjectWithAccess(roomId, identity)
    ProjectAccess->>Database: fetch project
    alt Owner or Collaborator
      Database-->>ProjectAccess: project (serialized)
      ProjectAccess-->>EditorPage: project
    else Denied
      ProjectAccess-->>EditorPage: null
      EditorPage-->>User: render AccessDenied
    end
    
    alt Project Found & Authorized
      EditorPage->>Database: fetch user projects (owned + shared)
      Database-->>EditorPage: initialOwned[], initialShared[]
      EditorPage->>WorkspaceShell: render (project, isOwner, initial lists)
      User->>ShareDialog: click Share button
      ShareDialog->>Database: GET /api/projects/[id]/collaborators
      Database-->>ShareDialog: { owner, collaborators[] }
      ShareDialog-->>User: display owner + collaborator list
      
      alt Invite (Owner only)
        User->>ShareDialog: enter email + click Invite
        ShareDialog->>Database: POST /api/projects/[id]/collaborators (email)
        Database->>ClerkAPI: fetch user by email
        ClerkAPI-->>Database: { displayName, image } or null
        Database-->>ShareDialog: created collaborator (enriched)
        ShareDialog-->>User: add to collaborators list
      end
      
      alt Remove (Owner only)
        User->>ShareDialog: click remove on collaborator
        ShareDialog->>Database: DELETE /api/projects/[id]/collaborators/[id]
        Database-->>ShareDialog: 204 No Content
        ShareDialog-->>User: remove from list
      end
    end
  end
```
