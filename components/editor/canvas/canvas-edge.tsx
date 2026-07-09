"use client"

import { useState } from "react"
import {
  EdgeLabelRenderer,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  useReactFlow,
  type EdgeProps,
  type Position,
} from "@xyflow/react"
import type { CanvasEdge } from "@/types/canvas"
import { useUserSettings } from "@/components/editor/dialogs/user-settings-context"
import { useDragEdge } from "./drag-edge-context"

const COLOR_REST = "rgba(248,250,252,0.35)"
const COLOR_ACTIVE = "rgba(248,250,252,0.85)"
// Opaque equivalents of the stroke colors over the canvas background —
// the marker must not be translucent or the line underneath shows through
// and the arrowhead tip reads as faded.
const ARROW_REST = "#5c5d5e"
const ARROW_ACTIVE = "#d4d6d7"
const STROKE_WIDTH = 1.5

type PathArgs = {
  sourceX: number
  sourceY: number
  sourcePosition: Position
  targetX: number
  targetY: number
  targetPosition: Position
}

function resolvePath(routing: string, args: PathArgs): [string, number, number] {
  if (routing === "straight") {
    const [p, lx, ly] = getStraightPath(args)
    return [p, lx, ly]
  }
  if (routing === "step") {
    const [p, lx, ly] = getSmoothStepPath({ ...args, borderRadius: 0 })
    return [p, lx, ly]
  }
  if (routing === "bezier") {
    const [p, lx, ly] = getBezierPath(args)
    return [p, lx, ly]
  }
  const [p, lx, ly] = getSmoothStepPath(args)
  return [p, lx, ly]
}

export function CanvasEdgeRenderer({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  data,
}: EdgeProps<CanvasEdge>) {
  const [hovered, setHovered] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(data?.label ?? "")
  const { updateEdgeData } = useReactFlow()
  const { settings } = useUserSettings()
  const { dragOverEdgeId } = useDragEdge()
  const isDragTarget = dragOverEdgeId === id

  const pathArgs: PathArgs = { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition }
  const [edgePath, labelX, labelY] = resolvePath(settings.edgeRouting, pathArgs)

  const isActive = hovered || !!selected
  const edgeColor = isActive ? COLOR_ACTIVE : COLOR_REST
  const label = data?.label

  const commit = (value: string) => {
    const trimmed = value.trim() || undefined
    updateEdgeData(id, { label: trimmed })
    setEditing(false)
  }

  const openEditor = () => {
    setEditValue(label ?? "")
    setEditing(true)
  }

  return (
    <>
      <defs>
        <marker
          id={`arrow-${id}`}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path
            d="M0,0 L0,7 L10,3.5 z"
            fill={isActive ? ARROW_ACTIVE : ARROW_REST}
          />
        </marker>
      </defs>

      {/* Wide transparent hit area — allows clicks without thick visible line */}
      <path
        data-edgeid={id}
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={16}
        style={{ cursor: "pointer" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onDoubleClick={(e) => {
          e.stopPropagation()
          openEditor()
        }}
      />

      {/* Visible edge path */}
      <path
        d={edgePath}
        fill="none"
        stroke={isDragTarget ? "rgba(248,250,252,0.95)" : edgeColor}
        strokeWidth={isDragTarget ? 2.5 : STROKE_WIDTH}
        strokeLinecap="round"
        strokeDasharray={isDragTarget ? "6,3" : undefined}
        markerEnd={`url(#arrow-${id})`}
        style={{
          pointerEvents: "none",
          transition: isDragTarget ? "none" : "stroke 0.15s",
          animation: isDragTarget ? "ghost-dash 0.4s linear infinite" : undefined,
          strokeDashoffset: isDragTarget ? 0 : undefined,
        }}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          {isDragTarget ? (
            <div
              style={{
                padding: "2px 10px",
                background: "#111114",
                border: "1px solid rgba(248,250,252,0.5)",
                borderRadius: 9999,
                color: "rgba(248,250,252,0.9)",
                fontSize: "0.75rem",
                whiteSpace: "nowrap",
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              Insert here
            </div>
          ) : editing ? (
            <input
              autoFocus
              value={editValue}
              className="nodrag nopan"
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => commit(editValue)}
              onKeyDown={(e) => {
                e.stopPropagation()
                if (e.key === "Enter" || e.key === "Escape") {
                  e.preventDefault()
                  commit(editValue)
                }
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              placeholder="Add label…"
              style={{
                background: "#111114",
                border: "1px solid #2a2a30",
                borderRadius: 9999,
                outline: "none",
                color: COLOR_ACTIVE,
                fontSize: "0.75rem",
                textAlign: "center",
                padding: "2px 10px",
                minWidth: 60,
                width: `${Math.max((editValue.length + 4) * 7.5, 70)}px`,
                fontFamily: "inherit",
              }}
            />
          ) : label?.trim() ? (
            <div
              onDoubleClick={(e) => {
                e.stopPropagation()
                openEditor()
              }}
              style={{
                padding: "2px 10px",
                background: "#111114",
                border: "1px solid #2a2a30",
                borderRadius: 9999,
                color: COLOR_ACTIVE,
                fontSize: "0.75rem",
                whiteSpace: "nowrap",
                cursor: "text",
                userSelect: "none",
              }}
            >
              {label}
            </div>
          ) : isActive ? (
            <div
              onDoubleClick={(e) => {
                e.stopPropagation()
                openEditor()
              }}
              style={{
                padding: "2px 10px",
                color: COLOR_REST,
                fontSize: "0.75rem",
                cursor: "text",
                userSelect: "none",
                borderRadius: 9999,
              }}
            >
              Add label…
            </div>
          ) : null}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
