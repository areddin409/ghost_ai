import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" }
  })

  return NextResponse.json(projects)
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body: unknown = await request.json().catch(() => ({}))
  const parsed =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {}

  const name =
    typeof parsed.name === "string"
      ? parsed.name.trim() || "Untitled Project"
      : "Untitled Project"

  const customId =
    typeof parsed.id === "string" && parsed.id.trim()
      ? parsed.id.trim()
      : undefined

  const project = await prisma.project.create({
    data: { ...(customId ? { id: customId } : {}), ownerId: userId, name }
  })

  return NextResponse.json(project, { status: 201 })
}
