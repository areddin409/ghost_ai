"use client"

import { useState } from "react"
import { NODE_COLORS } from "@/types/canvas"

interface NodeColorToolbarProps {
  currentFill: string
  onSelect: (fill: string, text: string) => void
}

export function NodeColorToolbar({ currentFill, onSelect }: NodeColorToolbarProps) {
  return (
    <div
      className="nodrag nopan"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        bottom: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 4,
        alignItems: "center",
        background: "#18181c",
        border: "1px solid #2a2a30",
        borderRadius: 10,
        padding: "6px 8px",
        zIndex: 10,
        pointerEvents: "all",
      }}
    >
      {NODE_COLORS.map(({ fill, text }) => (
        <Swatch
          key={fill}
          fill={fill}
          text={text}
          isActive={fill === currentFill}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

function Swatch({
  fill,
  text,
  isActive,
  onSelect,
}: {
  fill: string
  text: string
  isActive: boolean
  onSelect: (fill: string, text: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  return (
    <button
      type="button"
      aria-label={`Select ${fill} color`}
      aria-pressed={isActive}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(fill, text)
      }}
      style={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: fill,
        border: isActive
          ? "2px solid #f0f0f4"
          : "1.5px solid rgba(255,255,255,0.18)",
        boxShadow: focused
          ? `0 0 0 2px #f0f0f4`
          : isActive
            ? "0 0 0 2px rgba(240,240,244,0.25)"
            : hovered
              ? `0 0 6px 0px ${text}b3`
              : "none",
        cursor: "pointer",
        padding: 0,
        outline: "none",
        flexShrink: 0,
        transition: "box-shadow 0.15s, border-color 0.15s",
      }}
    />
  )
}
