import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

interface RouteContext {
  params: Promise<{ projectId: string }>
}

interface EnrichedCollaborator {
  id: string
  email: string
  displayName: string
  imageUrl: string | null
}

interface OwnerInfo {
  displayName: string
  imageUrl: string | null
  email: string
}

async function enrichCollaborators(
  records: Array<{ id: string; email: string }>
): Promise<EnrichedCollaborator[]> {
  if (records.length === 0) return []
  const clerkMap: Record<string, { displayName: string; imageUrl: string }> = {}
  try {
    const clerk = await clerkClient()
    const { data: users } = await clerk.users.getUserList({
      emailAddress: records.map((r) => r.email)
    })
    for (const u of users) {
      for (const e of u.emailAddresses) {
        clerkMap[e.emailAddress] = {
          displayName: u.fullName ?? u.firstName ?? e.emailAddress,
          imageUrl: u.imageUrl
        }
      }
    }
  } catch {
    // fall back to email-only display
  }
  return records.map((r) => ({
    id: r.id,
    email: r.email,
    displayName: clerkMap[r.email]?.displayName ?? r.email,
    imageUrl: clerkMap[r.email]?.imageUrl ?? null
  }))
}

export async function GET(_request: Request, context: RouteContext) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await context.params

  const project = await prisma.project.findUnique({
    where: { id: projectId }
  })

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const clerk = await clerkClient()

  if (project.ownerId !== userId) {
    const callerUser = await clerk.users.getUser(userId)
    const callerEmail = callerUser.emailAddresses[0]?.emailAddress
    if (!callerEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    const membership = await prisma.projectCollaborator.findUnique({
      where: { projectId_email: { projectId, email: callerEmail } }
    })
    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  const [ownerUser, records] = await Promise.all([
    clerk.users.getUser(project.ownerId),
    prisma.projectCollaborator.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
      select: { id: true, email: true }
    })
  ])

  const owner: OwnerInfo = {
    displayName:
      ownerUser.fullName ??
      ownerUser.firstName ??
      ownerUser.emailAddresses[0]?.emailAddress ??
      "Owner",
    imageUrl: ownerUser.imageUrl,
    email: ownerUser.emailAddresses[0]?.emailAddress ?? ""
  }

  const collaborators = await enrichCollaborators(records)

  return NextResponse.json({ owner, collaborators })
}

export async function POST(request: Request, context: RouteContext) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await context.params

  const project = await prisma.project.findUnique({
    where: { id: projectId }
  })

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (project.ownerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body: unknown = await request.json().catch(() => ({}))
  const rawEmail =
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    typeof (body as { email: unknown }).email === "string"
      ? (body as { email: string }).email.trim().toLowerCase()
      : undefined

  if (!rawEmail || !rawEmail.includes("@")) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
  }

  const clerk = await clerkClient()
  const ownerUser = await clerk.users.getUser(userId)
  const ownerEmail = ownerUser.emailAddresses[0]?.emailAddress

  if (ownerEmail && ownerEmail.toLowerCase() === rawEmail) {
    return NextResponse.json(
      { error: "Owner cannot be added as a collaborator" },
      { status: 400 }
    )
  }

  const existing = await prisma.projectCollaborator.findUnique({
    where: { projectId_email: { projectId, email: rawEmail } }
  })

  if (existing) {
    return NextResponse.json({ error: "Already a collaborator" }, { status: 409 })
  }

  const created = await prisma.projectCollaborator.create({
    data: { projectId, email: rawEmail },
    select: { id: true, email: true }
  })

  const enriched = await enrichCollaborators([created])

  return NextResponse.json(enriched[0], { status: 201 })
}
