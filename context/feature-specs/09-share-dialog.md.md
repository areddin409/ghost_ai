Add a `Share` button to the editor navbar that opens the share dialog

Owners can:

- [x] invite collaborators by email
- [x] view current collaborators
- [x] remove collaborators
- [x] copy the project link with the temporary `Copied!` feedback

Collaborators can:

- [x] view the collaborator list only
- [x] not invite, remove, or manage access

## Clerk User Data

Collaborators are stored by email in the database.

Use Clerk Backend API to enrich collaborator emails with:

- [x] display name
- [x] avatar image

if a clerk user is not found for an email fall back to showing the email only.

## Implementation

Add the required API logic for:

- [x] listing collaborators
- [x] inviting collaborators
- [x] removing collaborators

Enforce ownership server-side for invite and remove actions

Do not add a local user table.

## Check when done

- [x] share dialog opens from the workspace
- [x] owners can invite and remove collaborators
- [x] collaborators see read-only access
- [x] collaborator names/avatars load from Clerk when available
- [x] `npm run build` passes 
