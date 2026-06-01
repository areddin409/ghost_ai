"use client";

import { useState, useRef } from "react";
import type { NodeShape } from "@/types/canvas";
import { DEFAULT_NODE_SIZES } from "@/types/canvas";

const P_STROKE = "#00c8d4"
const P_SW = 1.5
const P_H = P_SW / 2
const P_FILL = "#1F1F1F"

function DragPreview({ shape, x, y }: { shape: NodeShape; x: number; y: number }) {
  const { width: w, height: h } = DEFAULT_NODE_SIZES[shape]

  let inner: React.ReactNode

  if (shape === "rectangle") {
    inner = (
      <div
        style={{
          width: w,
          height: h,
          backgroundColor: P_FILL,
          borderRadius: 8,
          border: `${P_SW}px solid ${P_STROKE}`,
        }}
      />
    )
  } else if (shape === "pill") {
    inner = (
      <div
        style={{
          width: w,
          height: h,
          backgroundColor: P_FILL,
          borderRadius: h / 2,
          border: `${P_SW}px solid ${P_STROKE}`,
        }}
      />
    )
  } else if (shape === "circle") {
    inner = (
      <div
        style={{
          width: w,
          height: h,
          backgroundColor: P_FILL,
          borderRadius: "50%",
          border: `${P_SW}px solid ${P_STROKE}`,
        }}
      />
    )
  } else if (shape === "diamond") {
    const pts = `${w / 2},${P_H} ${w - P_H},${h / 2} ${w / 2},${h - P_H} ${P_H},${h / 2}`
    inner = (
      <svg width={w} height={h} style={{ display: "block" }}>
        <polygon points={pts} fill={P_FILL} stroke={P_STROKE} strokeWidth={P_SW} />
      </svg>
    )
  } else if (shape === "hexagon") {
    const cx = w / 2,
      cy = h / 2
    const rx = w / 2 - P_H,
      ry = h / 2 - P_H
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (i * 60 - 90) * (Math.PI / 180)
      return `${cx + rx * Math.cos(a)},${cy + ry * Math.sin(a)}`
    }).join(" ")
    inner = (
      <svg width={w} height={h} style={{ display: "block" }}>
        <polygon points={pts} fill={P_FILL} stroke={P_STROKE} strokeWidth={P_SW} />
      </svg>
    )
  } else {
    // cylinder
    const eRy = Math.round(h * 0.18)
    inner = (
      <svg width={w} height={h} style={{ display: "block" }}>
        <rect
          x={P_H}
          y={eRy}
          width={w - P_SW}
          height={h - eRy * 2}
          fill={P_FILL}
          stroke="none"
        />
        <line x1={P_H} y1={eRy} x2={P_H} y2={h - eRy} stroke={P_STROKE} strokeWidth={P_SW} />
        <line
          x1={w - P_H}
          y1={eRy}
          x2={w - P_H}
          y2={h - eRy}
          stroke={P_STROKE}
          strokeWidth={P_SW}
        />
        <ellipse
          cx={w / 2}
          cy={h - eRy}
          rx={w / 2 - P_H}
          ry={eRy}
          fill={P_FILL}
          stroke={P_STROKE}
          strokeWidth={P_SW}
        />
        <ellipse
          cx={w / 2}
          cy={eRy}
          rx={w / 2 - P_H}
          ry={eRy}
          fill={P_FILL}
          stroke={P_STROKE}
          strokeWidth={P_SW}
        />
      </svg>
    )
  }

  return (
    <div
      style={{
        position: "fixed",
        left: x - w / 2,
        top: y - h / 2,
        pointerEvents: "none",
        zIndex: 9999,
        opacity: 0.75,
      }}
    >
      {inner}
    </div>
  )
}

interface ShapeButtonProps {
  shape: NodeShape;
  onDragBegin: (shape: NodeShape, e: React.DragEvent<HTMLButtonElement>) => void;
}

function ShapeButton({ shape, onDragBegin }: ShapeButtonProps) {
  function handleDragStart(e: React.DragEvent<HTMLButtonElement>) {
    const size = DEFAULT_NODE_SIZES[shape]
    e.dataTransfer.setData(
      "application/ghost-shape",
      JSON.stringify({ shape, width: size.width, height: size.height })
    )
    e.dataTransfer.effectAllowed = "copy"
    onDragBegin(shape, e)
  }

  function handleClick() {
    const size = DEFAULT_NODE_SIZES[shape]
    window.dispatchEvent(
      new CustomEvent("ghost:insert-shape", {
        detail: { shape, width: size.width, height: size.height },
      })
    )
  }

  return (
    <button
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      aria-label={`Insert ${shape}`}
      className="flex h-9 w-9 cursor-grab items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary active:cursor-grabbing"
    >
      <ShapeIcon shape={shape} />
    </button>
  )
}

function ShapeIcon({ shape }: { shape: NodeShape }) {
  const cls = "h-4 w-4";

  switch (shape) {
    case "rectangle":
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}>
          <rect x="1" y="4" width="14" height="8" rx="1" />
        </svg>
      );
    case "diamond":
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}>
          <polygon points="8,1 15,8 8,15 1,8" />
        </svg>
      );
    case "circle":
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}>
          <circle cx="8" cy="8" r="6.25" />
        </svg>
      );
    case "pill":
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}>
          <rect x="1" y="5" width="14" height="6" rx="3" />
        </svg>
      );
    case "cylinder":
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}>
          <ellipse cx="8" cy="4" rx="5.5" ry="2" />
          <line x1="2.5" y1="4" x2="2.5" y2="12" />
          <line x1="13.5" y1="4" x2="13.5" y2="12" />
          <ellipse cx="8" cy="12" rx="5.5" ry="2" />
        </svg>
      );
    case "hexagon":
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}>
          <polygon points="8,1 14.5,4.5 14.5,11.5 8,15 1.5,11.5 1.5,4.5" />
        </svg>
      );
  }
}

const SHAPES: NodeShape[] = [
  "rectangle",
  "diamond",
  "circle",
  "pill",
  "cylinder",
  "hexagon",
];

export function ShapePanel() {
  const [dragPreview, setDragPreview] = useState<{
    shape: NodeShape
    x: number
    y: number
  } | null>(null)

  const cleanupRef = useRef<(() => void) | null>(null)

  function handleDragBegin(
    shape: NodeShape,
    e: React.DragEvent<HTMLButtonElement>
  ) {
    cleanupRef.current?.()

    // Suppress the browser's native ghost image so only our preview shows
    const phantom = document.createElement("div")
    phantom.style.cssText = "position:fixed;top:-9999px;left:-9999px;"
    document.body.appendChild(phantom)
    e.dataTransfer.setDragImage(phantom, 0, 0)
    requestAnimationFrame(() => phantom.remove())

    setDragPreview({ shape, x: e.clientX, y: e.clientY })

    function onDragOver(ev: DragEvent) {
      setDragPreview({ shape, x: ev.clientX, y: ev.clientY })
    }

    function cleanup() {
      setDragPreview(null)
      document.removeEventListener("dragover", onDragOver)
      document.removeEventListener("dragend", cleanup)
      document.removeEventListener("drop", cleanup)
    }

    document.addEventListener("dragover", onDragOver)
    document.addEventListener("dragend", cleanup)
    document.addEventListener("drop", cleanup)
    cleanupRef.current = cleanup
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-20 flex justify-center">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-border-default bg-bg-surface px-3 py-1.5 shadow-lg">
          {SHAPES.map((shape) => (
            <ShapeButton key={shape} shape={shape} onDragBegin={handleDragBegin} />
          ))}
        </div>
      </div>
      {dragPreview && (
        <DragPreview
          shape={dragPreview.shape}
          x={dragPreview.x}
          y={dragPreview.y}
        />
      )}
    </>
  )
}
