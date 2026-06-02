"use client"

import { useState, useRef } from "react"
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
const STROKE_WIDTH = 1.5

type PathArgs = {
  sourceX: number
  sourceY: number
  sourcePosition: Position
  targetX: number
  targetY: number
  targetPosition: Position
}

function resolvePath(
  routing: string,
  args: PathArgs,
  bp: { x: number; y: number } | null
): [string, number, number] {
  if (bp) {
    // When a bend point is set, construct the path to route through it
    if (routing === "bezier") {
      // Quadratic bezier: control point = bend point
      return [
        `M ${args.sourceX},${args.sourceY} Q ${bp.x},${bp.y} ${args.targetX},${args.targetY}`,
        bp.x,
        bp.y,
      ]
    }
    if (routing === "straight") {
      // Two-segment polyline through the bend point
      return [
        `M ${args.sourceX},${args.sourceY} L ${bp.x},${bp.y} L ${args.targetX},${args.targetY}`,
        bp.x,
        bp.y,
      ]
    }
    if (routing === "step") {
      const [p] = getSmoothStepPath({ ...args, borderRadius: 0, centerX: bp.x, centerY: bp.y })
      return [p, bp.x, bp.y]
    }
    // smoothstep (default)
    const [p] = getSmoothStepPath({ ...args, centerX: bp.x, centerY: bp.y })
    return [p, bp.x, bp.y]
  }

  // No bend — default path for each routing type
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
  return [p, lx, ly] // smoothstep default
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
  const inputRef = useRef<HTMLInputElement>(null)
  const bendDragRef = useRef<{
    startClient: { x: number; y: number }
    startBend: { x: number; y: number }
  } | null>(null)
  const { updateEdgeData, screenToFlowPosition } = useReactFlow()
  const { settings } = useUserSettings()
  const { dragOverEdgeId } = useDragEdge()
  const isDragTarget = dragOverEdgeId === id

  const bendPoint = data?.bendPoint ?? null
  const pathArgs: PathArgs = { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition }
  const [edgePath, labelX, labelY] = resolvePath(settings.edgeRouting, pathArgs, bendPoint)

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

  function handleBendPointerDown(e: React.PointerEvent<SVGCircleElement>) {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    bendDragRef.current = {
      startClient: { x: e.clientX, y: e.clientY },
      startBend: bendPoint ?? { x: labelX, y: labelY },
    }
  }

  function handleBendPointerMove(e: React.PointerEvent<SVGCircleElement>) {
    if (!bendDragRef.current) return
    e.stopPropagation()
    const cur = screenToFlowPosition({ x: e.clientX, y: e.clientY })
    const start = screenToFlowPosition({
      x: bendDragRef.current.startClient.x,
      y: bendDragRef.current.startClient.y,
    })
    updateEdgeData(id, {
      bendPoint: {
        x: bendDragRef.current.startBend.x + (cur.x - start.x),
        y: bendDragRef.current.startBend.y + (cur.y - start.y),
      },
    })
  }

  function handleBendPointerUp(e: React.PointerEvent<SVGCircleElement>) {
    e.currentTarget.releasePointerCapture(e.pointerId)
    bendDragRef.current = null
  }

  function handleBendReset(e: React.MouseEvent) {
    e.stopPropagation()
    updateEdgeData(id, { bendPoint: undefined })
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
          <path d="M0,0 L0,7 L10,3.5 z" fill={edgeColor} />
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

      {selected && (
        <circle
          cx={bendPoint ? bendPoint.x : labelX}
          cy={bendPoint ? bendPoint.y : labelY}
          r={8}
          fill={bendPoint ? "#00c8d4" : "rgba(0,200,212,0.4)"}
          stroke="rgba(255,255,255,0.8)"
          strokeWidth={1.5}
          style={{ pointerEvents: "all", cursor: "grab" }}
          onPointerDown={handleBendPointerDown}
          onPointerMove={handleBendPointerMove}
          onPointerUp={handleBendPointerUp}
          onPointerCancel={handleBendPointerUp}
          onDoubleClick={handleBendReset}
        />
      )}

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
              ref={inputRef}
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
