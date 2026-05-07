Primsa is already install add the project data models, primsa client singleton, and first migration

## Models

Create `primsa/models/project.primsa`

Add `Project`:
- [x] owner id mapped to clerk user
- [x] name
- [x] optional description
- [x] status enum: `DRAFT`, `ARCHIVED`
- [x] `canvasJsonPath` for future canvas blob storage
- [x] timestamps
- [x] indexes on owner ID and creation date

Add `ProjectCollaborator`:
- [x] project relation with cascade delete
- [x] collaborator email
- [x] creation timestamp
- [x] unique constraint on project/email
- [x] indexes on email and project/date

Do not add extra fields unless required by prisma

## Prisma Client

Create `lib/prims.ts` as a cached singleton.

Branch by `DATABASE_URL`:
- [x] If it starts with `prisma+postgres://`, use Accelerate
- [x] otherwise use direct `@prisma/adapter-pg`

Cache the client on `global` in development for hot reloads.

##  Migration

Run the migration and generate the client.

## Dependencies

Already installed:
- `prisma`
- `@prisma/client`
- `@prisma/adapter-pg`
- `pg`

## Check When done

- [x] schema has both models with correct relations and indexes
- [x] `lib/prisma.ts` exports one cached Prisma instance
- [x] migration runs successfully
- [x] `npm run build` passes