import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import type { Project } from "@/hooks/use-project-actions"

interface RawProject {
  id: string
  ownerId: string
  name: string
  description: string | null
  status: string
  canvasJsonPath: string | null
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
    canvasJsonPath: p.canvasJsonPath,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString()
  }
}

export async function getCurrentIdentity(): Promise<UserIdentity | null> {
  const { userId } = await auth()
  if (!userId) return null
  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? null
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
