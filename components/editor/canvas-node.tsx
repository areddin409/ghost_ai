"use client"

import { useState, useRef, useEffect } from "react"
import { Handle, NodeResizer, Position, useReactFlow, type NodeProps } from "@xyflow/react"
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
  id,
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
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(label ?? "")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // updateNodeData routes through RF's BatchProvider → onNodesChange → useLiveblocksFlow.
  // Verified for @xyflow/react v12.10.2. Re-verify on React Flow upgrades.
  const { updateNodeData } = useReactFlow()

  // Keep editValue in sync when label changes from outside (remote collaborator)
  useEffect(() => {
    if (!isEditing) setEditValue(label ?? "")
  }, [label, isEditing])

  // Auto-focus textarea when editing begins
  useEffect(() => {
    if (isEditing) textareaRef.current?.focus()
  }, [isEditing])

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const scheduleSync = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateNodeData(id, { label: value })
    }, 300)
  }

  const commitAndClose = (value: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
    updateNodeData(id, { label: value })
    setIsEditing(false)
  }

  const defaults = DEFAULT_NODE_SIZES[nodeShape]
  const minW = Math.round(defaults.width / 2)
  const minH = Math.round(defaults.height / 2)

  const resizerProps = {
    isVisible: selected,
    minWidth: minW,
    minHeight: minH,
    keepAspectRatio: nodeShape === "circle",
    lineStyle: { borderColor: "rgba(255,255,255,0.15)" } as React.CSSProperties,
    handleStyle: { width: 5, height: 5, background: "#ffffff", border: `1px solid ${CANVAS_BG}`, borderRadius: 2 } as React.CSSProperties,
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

  const labelEl = isEditing ? (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
      }}
    >
      <textarea
        ref={textareaRef}
        className="nodrag nopan"
        value={editValue}
        onChange={(e) => {
          setEditValue(e.target.value)
          scheduleSync(e.target.value)
        }}
        onBlur={() => commitAndClose(editValue)}
        onKeyDown={(e) => {
          e.stopPropagation()
          if (e.key === "Escape") commitAndClose(editValue)
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
          border: "none",
          outline: "none",
          resize: "none",
          textAlign: "center",
          color: DEFAULT_NODE_COLOR.text,
          fontSize: "0.875rem",
          fontFamily: "inherit",
          padding: 0,
          cursor: "text",
          lineHeight: 1.4,
        }}
      />
    </div>
  ) : (
    <div
      onDoubleClick={(e) => {
        e.stopPropagation()
        setEditValue(label ?? "")
        setIsEditing(true)
      }}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.875rem",
        color: label?.trim() ? DEFAULT_NODE_COLOR.text : "var(--text-faint, #505060)",
        padding: "8px",
        cursor: "text",
        userSelect: "none",
      }}
    >
      {label?.trim() || "Label"}
    </div>
  )

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
