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

  const body: unknown = await request.json().catch(() => ({}))
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const b = body as Record<string, unknown>
  const EDGE_ROUTING = ["smoothstep", "step", "straight"] as const
  const BG_VARIANT = ["dots", "lines", "cross", "none"] as const
  const NODE_SHAPES = ["rectangle", "rounded", "ellipse", "diamond", "parallelogram", "hexagon"] as const
  const HEX = /^#[0-9a-fA-F]{6}$/

  const patch: Record<string, unknown> = {}
  if ("edgeRouting" in b) {
    if (!EDGE_ROUTING.includes(b.edgeRouting as (typeof EDGE_ROUTING)[number]))
      return NextResponse.json({ error: "Invalid edgeRouting" }, { status: 400 })
    patch.edgeRouting = b.edgeRouting
  }
  if ("minimapVisible" in b) {
    if (typeof b.minimapVisible !== "boolean")
      return NextResponse.json({ error: "Invalid minimapVisible" }, { status: 400 })
    patch.minimapVisible = b.minimapVisible
  }
  if ("backgroundVariant" in b) {
    if (!BG_VARIANT.includes(b.backgroundVariant as (typeof BG_VARIANT)[number]))
      return NextResponse.json({ error: "Invalid backgroundVariant" }, { status: 400 })
    patch.backgroundVariant = b.backgroundVariant
  }
  if ("backgroundPatternColor" in b) {
    if (typeof b.backgroundPatternColor !== "string" || !HEX.test(b.backgroundPatternColor))
      return NextResponse.json({ error: "Invalid backgroundPatternColor" }, { status: 400 })
    patch.backgroundPatternColor = b.backgroundPatternColor
  }
  if ("snapToGrid" in b) {
    if (typeof b.snapToGrid !== "boolean")
      return NextResponse.json({ error: "Invalid snapToGrid" }, { status: 400 })
    patch.snapToGrid = b.snapToGrid
  }
  if ("defaultNodeShape" in b) {
    if (!NODE_SHAPES.includes(b.defaultNodeShape as (typeof NODE_SHAPES)[number]))
      return NextResponse.json({ error: "Invalid defaultNodeShape" }, { status: 400 })
    patch.defaultNodeShape = b.defaultNodeShape
  }
  if ("defaultNodeColor" in b) {
    if (typeof b.defaultNodeColor !== "string" || !HEX.test(b.defaultNodeColor))
      return NextResponse.json({ error: "Invalid defaultNodeColor" }, { status: 400 })
    patch.defaultNodeColor = b.defaultNodeColor
  }

  const settings = await prisma.userSettings.upsert({
    where: { userId },
    update: patch,
    create: { userId, ...patch },
  })

  return NextResponse.json(settings)
}
