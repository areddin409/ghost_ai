"use client"

import { useState, useRef } from "react"
import {
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react"
import type { CanvasEdge } from "@/types/canvas"

const COLOR_REST = "rgba(248,250,252,0.35)"
const COLOR_ACTIVE = "rgba(248,250,252,0.85)"
const STROKE_WIDTH = 1.5

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
  const { updateEdgeData } = useReactFlow()

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

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
          <path d="M0,0 L0,7 L10,3.5 z" fill={edgeColor} />
        </marker>
      </defs>

      {/* Wide transparent hit area — allows clicks without thick visible line */}
      <path
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
        stroke={edgeColor}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        markerEnd={`url(#arrow-${id})`}
        style={{ pointerEvents: "none", transition: "stroke 0.15s" }}
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
          {editing ? (
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
