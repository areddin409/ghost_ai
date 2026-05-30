"use client"

import type { NodeProps } from "@xyflow/react"
import type { CanvasNode, CanvasNodeData, NodeShape } from "@/types/canvas"
import { DEFAULT_NODE_COLOR, DEFAULT_NODE_SIZES } from "@/types/canvas"

const STROKE = "#3a3a42"
const SW = 1.5
const H = SW / 2

function ShapeRenderer({
  shape,
  w,
  h,
  fill,
  stroke = STROKE,
}: {
  shape: NodeShape
  w: number
  h: number
  fill: string
  stroke?: string
}) {
  switch (shape) {
    case "diamond": {
      const pts = `${w / 2},${H} ${w - H},${h / 2} ${w / 2},${h - H} ${H},${h / 2}`
      return (
        <svg width={w} height={h} style={{ display: "block" }}>
          <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={SW} />
        </svg>
      )
    }
    case "hexagon": {
      const cx = w / 2,
        cy = h / 2
      const rx = w / 2 - H,
        ry = h / 2 - H
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (i * 60 - 90) * (Math.PI / 180)
        return `${cx + rx * Math.cos(a)},${cy + ry * Math.sin(a)}`
      }).join(" ")
      return (
        <svg width={w} height={h} style={{ display: "block" }}>
          <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={SW} />
        </svg>
      )
    }
    case "cylinder": {
      const eRy = Math.round(h * 0.18)
      return (
        <svg width={w} height={h} style={{ display: "block" }}>
          <rect x={H} y={eRy} width={w - SW} height={h - eRy * 2} fill={fill} stroke="none" />
          <line x1={H} y1={eRy} x2={H} y2={h - eRy} stroke={stroke} strokeWidth={SW} />
          <line x1={w - H} y1={eRy} x2={w - H} y2={h - eRy} stroke={stroke} strokeWidth={SW} />
          <ellipse cx={w / 2} cy={h - eRy} rx={w / 2 - H} ry={eRy} fill={fill} stroke={stroke} strokeWidth={SW} />
          <ellipse cx={w / 2} cy={eRy} rx={w / 2 - H} ry={eRy} fill={fill} stroke={stroke} strokeWidth={SW} />
        </svg>
      )
    }
    default:
      return null
  }
}

export function CanvasNodeRenderer({
  data,
  selected,
  width: nodeW,
  height: nodeH,
}: NodeProps<CanvasNode>) {
  const { label, color, shape } = data
  const nodeShape: NodeShape = shape ?? "rectangle"
  const bg = color ?? DEFAULT_NODE_COLOR.fill
  const w = nodeW ?? DEFAULT_NODE_SIZES[nodeShape].width
  const h = nodeH ?? DEFAULT_NODE_SIZES[nodeShape].height
  const stroke = selected ? "#00c8d4" : STROKE

  const labelEl = label ? (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.875rem",
        color: DEFAULT_NODE_COLOR.text,
        padding: "8px",
        pointerEvents: "none",
      }}
    >
      {label}
    </div>
  ) : null

  if (nodeShape === "rectangle" || nodeShape === "pill" || nodeShape === "circle") {
    const borderRadius =
      nodeShape === "circle"
        ? "50%"
        : nodeShape === "pill"
          ? `${h / 2}px`
          : "8px"
    return (
      <div
        style={{
          width: w,
          height: h,
          position: "relative",
          backgroundColor: bg,
          borderRadius,
          border: `${SW}px solid ${stroke}`,
        }}
      >
        {labelEl}
      </div>
    )
  }

  return (
    <div style={{ width: w, height: h, position: "relative" }}>
      <ShapeRenderer shape={nodeShape} w={w} h={h} fill={bg} stroke={stroke} />
      {labelEl}
    </div>
  )
}
