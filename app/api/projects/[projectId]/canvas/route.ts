import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import {
  getCurrentIdentity,
  getProjectWithAccess
} from "@/lib/project-access"

interface RouteContext {
  params: Promise<{ projectId: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const identity = await getCurrentIdentity()
  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await context.params

  const project = await getProjectWithAccess(projectId, identity)
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (!project.canvasBlobUrl) {
    return NextResponse.json({ nodes: [], edges: [] }, { status: 200 })
  }

  try {
    const blobRes = await fetch(project.canvasBlobUrl)
    if (!blobRes.ok) {
      return NextResponse.json({ nodes: [], edges: [] }, { status: 200 })
    }
    const data: unknown = await blobRes.json()
    return NextResponse.json(data, { status: 200 })
  } catch {
    return NextResponse.json({ nodes: [], edges: [] }, { status: 200 })
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const identity = await getCurrentIdentity()
  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await context.params

  const project = await getProjectWithAccess(projectId, identity)
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (project.ownerId !== identity.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body: unknown = await request.json().catch(() => null)
  if (body === null) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const blob = await put(
    `canvas/${projectId}.json`,
    JSON.stringify(body),
    { access: "public", contentType: "application/json", allowOverwrite: true }
  )

  await prisma.project.update({
    where: { id: projectId },
    data: { canvasBlobUrl: blob.url }
  })

  return NextResponse.json({ url: blob.url }, { status: 200 })
}
