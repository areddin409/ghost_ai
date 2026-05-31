import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserSettings } from "@/lib/user-settings"

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const settings = await getUserSettings(userId)
  return NextResponse.json(settings)
}

export async function PATCH(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  const allowed = [
    "edgeRouting",
    "minimapVisible",
    "backgroundVariant",
    "backgroundPatternColor",
    "snapToGrid",
    "defaultNodeShape",
    "defaultNodeColor",
  ] as const

  const patch: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) patch[key] = body[key]
  }

  const settings = await prisma.userSettings.upsert({
    where: { userId },
    update: patch,
    create: { userId, ...patch },
  })

  return NextResponse.json(settings)
}
