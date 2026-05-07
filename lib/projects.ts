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

function serialize(p: RawProject): Project {
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

export async function getProjectsForUser(): Promise<{
  owned: Project[]
  shared: Project[]
}> {
  const { userId } = await auth()
  if (!userId) return { owned: [], shared: [] }

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress

  const [owned, sharedCollabs] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" }
    }),
    email
      ? prisma.projectCollaborator.findMany({
          where: { email },
          include: { project: true },
          orderBy: { createdAt: "desc" }
        })
      : Promise.resolve([])
  ])

  const shared = sharedCollabs.map((c) => c.project)

  return {
    owned: (owned as RawProject[]).map(serialize),
    shared: (shared as RawProject[]).map(serialize)
  }
}
