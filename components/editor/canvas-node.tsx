"use client"

import { useState } from "react"
import { Handle, NodeResizer, Position, type NodeProps } from "@xyflow/react"
import type { CanvasNode, NodeShape } from "@/types/canvas"
import { DEFAULT_NODE_COLOR, DEFAULT_NODE_SIZES } from "@/types/canvas"

const STROKE = "#3a3a42"
const SW = 1.5
const H = SW / 2
const ACCENT = "#00c8d4"
const CANVAS_BG = "#080809"

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
  const [isHovered, setIsHovered] = useState(false)

  const defaults = DEFAULT_NODE_SIZES[nodeShape]
  const minW = Math.round(defaults.width / 2)
  const minH = Math.round(defaults.height / 2)

  const resizerProps = {
    isVisible: selected,
    minWidth: minW,
    minHeight: minH,
    keepAspectRatio: nodeShape === "circle",
    lineStyle: { borderColor: "rgba(255,255,255,0.15)" } as React.CSSProperties,
    handleStyle: { width: 5, height: 5, background: "#ffffff", border: "1px solid #080809", borderRadius: 2 } as React.CSSProperties,
  }

  const handleStyle: React.CSSProperties = {
    width: 10,
    height: 10,
    background: ACCENT,
    border: `2px solid ${CANVAS_BG}`,
    borderRadius: "50%",
    opacity: isHovered ? 1 : 0,
    transition: "opacity 0.15s",
  }

  const handles = (
    <>
      <Handle type="source" position={Position.Top} style={handleStyle} />
      <Handle type="source" position={Position.Right} style={handleStyle} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
      <Handle type="source" position={Position.Left} style={handleStyle} />
    </>
  )

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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <NodeResizer {...resizerProps} />
        {handles}
        {labelEl}
      </div>
    )
  }

  return (
    <div
      style={{ width: w, height: h, position: "relative" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ShapeRenderer shape={nodeShape} w={w} h={h} fill={bg} stroke={stroke} />
      <NodeResizer {...resizerProps} />
      {handles}
      {labelEl}
    </div>
  )
}
