import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import type { Project } from "@/hooks/use-project-actions"

interface RawProject {
  id: string
  ownerId: string
  name: string
  description: string | null
  status: string
  canvasBlobUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export interface UserIdentity {
  userId: string
  email: string | null
}

function serializeProject(p: RawProject): Project {
  return {
    id: p.id,
    ownerId: p.ownerId,
    name: p.name,
    description: p.description,
    status: p.status,
    canvasBlobUrl: p.canvasBlobUrl,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString()
  }
}

// currentUser() is a Clerk Backend API network call on every request (auth()
// only verifies the session JWT locally). Autosave PUTs made that call fire
// every ~1.5s, which trips dev-instance rate limits — the SDK then retries
// with long backoffs and eventually throws during SSR. A user's email is
// effectively immutable, so cache it per user and serve stale on API failure.
const EMAIL_CACHE_TTL_MS = 5 * 60 * 1000
const emailCache = new Map<string, { email: string | null; expiresAt: number }>()

export async function getCachedUserEmail(userId: string): Promise<string | null> {
  const cached = emailCache.get(userId)
  if (cached && cached.expiresAt > Date.now()) return cached.email

  try {
    const user = await currentUser()
    const email = user?.primaryEmailAddress?.emailAddress ?? null
    emailCache.set(userId, {
      email,
      expiresAt: Date.now() + EMAIL_CACHE_TTL_MS
    })
    return email
  } catch {
    // Clerk API unavailable (rate limit, network) — a missing email only
    // skips the collaborator lookup; it must not fail the whole request.
    return cached?.email ?? null
  }
}

export async function getCurrentIdentity(): Promise<UserIdentity | null> {
  const { userId } = await auth()
  if (!userId) return null
  const email = await getCachedUserEmail(userId)
  return { userId, email }
}

export async function getProjectWithAccess(
  projectId: string,
  identity: UserIdentity
): Promise<Project | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId }
  })
  if (!project) return null

  if (project.ownerId === identity.userId) {
    return serializeProject(project as RawProject)
  }

  if (identity.email) {
    const collab = await prisma.projectCollaborator.findUnique({
      where: { projectId_email: { projectId, email: identity.email } }
    })
    if (collab) return serializeProject(project as RawProject)
  }

  return null
}
