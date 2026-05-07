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

  const rawId =
    typeof parsed.id === "string" ? parsed.id.trim() : undefined

  if (rawId !== undefined) {
    if (rawId.length < 2 || rawId.length > 100) {
      return NextResponse.json({ error: "Invalid project id" }, { status: 400 })
    }
    if (!/^[a-z0-9][a-z0-9-_]*[a-z0-9]$/.test(rawId)) {
      return NextResponse.json({ error: "Invalid project id" }, { status: 400 })
    }
  }

  try {
    const project = await prisma.project.create({
      data: { ...(rawId ? { id: rawId } : {}), ownerId: userId, name }
    })
    return NextResponse.json(project, { status: 201 })
  } catch (err) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A project with this id already exists" },
        { status: 409 }
      )
    }
    throw err
  }
}
