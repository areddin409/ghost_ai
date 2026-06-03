"use client"

import { useOthers } from "@liveblocks/react"
import { useStore } from "@xyflow/react"

interface CursorEntry {
  connectionId: number
  x: number
  y: number
  name: string
  color: string
}

function CursorPointer({ color }: { color: string }) {
  return (
    <svg
      width="16"
      height="20"
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none"
    >
      <path
        d="M0 0L0 16L4.5 12.5L7.5 19L9.5 18L6.5 11H12L0 0Z"
        fill={color}
        stroke="rgba(0,0,0,0.35)"
        strokeWidth="1"
      />
    </svg>
  )
}

export function LiveCursors() {
  const [tx, ty, zoom] = useStore((s) => s.transform)

  const cursors = useOthers((others) =>
    others
      .filter((o) => o.presence.cursor !== null)
      .map((o): CursorEntry => ({
        connectionId: o.connectionId,
        x: (o.presence.cursor!.x * zoom) + tx,
        y: (o.presence.cursor!.y * zoom) + ty,
        name: o.info?.name ?? "User",
        color: o.info?.color ?? "#7c6ef9",
      }))
  )

  if (cursors.length === 0) return null

  return (
    <>
      {cursors.map((c) => (
        <div
          key={c.connectionId}
          className="pointer-events-none absolute"
          style={{ left: c.x, top: c.y }}
        >
          <CursorPointer color={c.color} />
          <div
            className="mt-1 ml-3 max-w-[120px] truncate rounded px-1.5 py-0.5 text-[11px] font-medium text-white"
            style={{ backgroundColor: c.color }}
          >
            {c.name}
          </div>
        </div>
      ))}
    </>
  )
}
