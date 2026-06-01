"use client"

import { LayoutTemplate } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CANVAS_TEMPLATES, type CanvasTemplate } from "@/lib/starter-templates"
import type { NodeShape } from "@/types/canvas"

interface StarterTemplatesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StarterTemplatesModal({ open, onOpenChange }: StarterTemplatesModalProps) {
  function handleImport(template: CanvasTemplate) {
    window.dispatchEvent(
      new CustomEvent<CanvasTemplate>("ghost:import-template", { detail: template })
    )
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl gap-8 p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="gap-2">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <LayoutTemplate className="h-5 w-5 text-accent-primary" />
            Starter Templates
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            Choose a template to replace the current canvas with a pre-built diagram.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {CANVAS_TEMPLATES.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onImport={handleImport}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function TemplateCard({
  template,
  onImport,
}: {
  template: CanvasTemplate
  onImport: (template: CanvasTemplate) => void
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border-default bg-bg-subtle p-5">
      <TemplatePreview template={template} />
      <div className="flex min-h-0 flex-col gap-1.5">
        <p className="text-sm font-semibold text-text-primary">{template.name}</p>
        <p className="text-xs leading-relaxed text-text-muted">{template.description}</p>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="mt-auto w-full"
        onClick={() => onImport(template)}
      >
        Import
      </Button>
    </div>
  )
}

// Preview dimensions
const PW = 320
const PH = 210
const PAD = 16

function TemplatePreview({ template }: { template: CanvasTemplate }) {
  const { nodes, edges } = template

  if (nodes.length === 0) return null

  // Compute bounds from node positions + sizes
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const n of nodes) {
    const w = n.width ?? 160
    const h = n.height ?? 80
    if (n.position.x < minX) minX = n.position.x
    if (n.position.y < minY) minY = n.position.y
    if (n.position.x + w > maxX) maxX = n.position.x + w
    if (n.position.y + h > maxY) maxY = n.position.y + h
  }

  const contentW = maxX - minX
  const contentH = maxY - minY
  const availW = PW - PAD * 2
  const availH = PH - PAD * 2
  const scale = Math.min(availW / contentW, availH / contentH, 1)

  // Scaled content size — center it in the viewport
  const scaledW = contentW * scale
  const scaledH = contentH * scale
  const offsetX = PAD + (availW - scaledW) / 2
  const offsetY = PAD + (availH - scaledH) / 2

  function sx(x: number) {
    return (x - minX) * scale + offsetX
  }
  function sy(y: number) {
    return (y - minY) * scale + offsetY
  }

  // Build a lookup from node id to screen center
  const centers: Record<string, { cx: number; cy: number }> = {}
  for (const n of nodes) {
    const w = n.width ?? 160
    const h = n.height ?? 80
    centers[n.id] = {
      cx: sx(n.position.x + w / 2),
      cy: sy(n.position.y + h / 2),
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border-subtle bg-bg-elevated">
      <svg
        width="100%"
        height={PH}
        viewBox={`0 0 ${PW} ${PH}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* Edges — drawn first so nodes render on top */}
        {edges.map((edge) => {
          const src = centers[edge.source]
          const tgt = centers[edge.target]
          if (!src || !tgt) return null
          return (
            <line
              key={edge.id}
              x1={src.cx}
              y1={src.cy}
              x2={tgt.cx}
              y2={tgt.cy}
              stroke="#3a3a42"
              strokeWidth={1}
            />
          )
        })}

        {/* Nodes */}
        {nodes.map((n) => {
          const w = (n.width ?? 160) * scale
          const h = (n.height ?? 80) * scale
          const x = sx(n.position.x)
          const y = sy(n.position.y)
          const fill = n.data.color ?? "#1F1F1F"
          const stroke = "#3a3a42"
          const shape: NodeShape = (n.data.shape as NodeShape) ?? "rectangle"

          return (
            <PreviewNode
              key={n.id}
              x={x}
              y={y}
              w={w}
              h={h}
              fill={fill}
              stroke={stroke}
              shape={shape}
            />
          )
        })}
      </svg>
    </div>
  )
}

function PreviewNode({
  x,
  y,
  w,
  h,
  fill,
  stroke,
  shape,
}: {
  x: number
  y: number
  w: number
  h: number
  fill: string
  stroke: string
  shape: NodeShape
}) {
  const sw = 0.8

  switch (shape) {
    case "pill":
      return (
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={h / 2}
          ry={h / 2}
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
        />
      )
    case "circle":
      return (
        <ellipse
          cx={x + w / 2}
          cy={y + h / 2}
          rx={w / 2}
          ry={h / 2}
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
        />
      )
    case "diamond": {
      const pts = `${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}`
      return (
        <polygon
          points={pts}
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
        />
      )
    }
    case "hexagon": {
      const cx = x + w / 2
      const cy = y + h / 2
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (i * 60 - 90) * (Math.PI / 180)
        return `${cx + (w / 2) * Math.cos(a)},${cy + (h / 2) * Math.sin(a)}`
      }).join(" ")
      return (
        <polygon
          points={pts}
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
        />
      )
    }
    case "cylinder": {
      const eRy = Math.max(1.5, h * 0.18)
      return (
        <>
          <rect
            x={x}
            y={y + eRy}
            width={w}
            height={h - eRy * 2}
            fill={fill}
            stroke="none"
          />
          <line x1={x} y1={y + eRy} x2={x} y2={y + h - eRy} stroke={stroke} strokeWidth={sw} />
          <line x1={x + w} y1={y + eRy} x2={x + w} y2={y + h - eRy} stroke={stroke} strokeWidth={sw} />
          <ellipse cx={x + w / 2} cy={y + h - eRy} rx={w / 2} ry={eRy} fill={fill} stroke={stroke} strokeWidth={sw} />
          <ellipse cx={x + w / 2} cy={y + eRy} rx={w / 2} ry={eRy} fill={fill} stroke={stroke} strokeWidth={sw} />
        </>
      )
    }
    default: // rectangle
      return (
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={Math.min(2, w * 0.08)}
          ry={Math.min(2, h * 0.08)}
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
        />
      )
  }
}
