"use client"

import { useEffect, useRef } from "react"
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  ConnectionMode,
  useReactFlow,
  useStore,
  type NodeTypes,
  type NodeProps,
  type MiniMapNodeProps
} from "@xyflow/react"
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow"
import "@xyflow/react/dist/style.css"
import "@liveblocks/react-ui/styles.css"
import "@liveblocks/react-flow/styles.css"

import type {
  CanvasNode,
  CanvasEdge,
  CanvasNodeData,
  NodeShape
} from "@/types/canvas"
import { DEFAULT_NODE_COLOR, DEFAULT_NODE_SIZES } from "@/types/canvas"

const STROKE = "#3a3a42"
const SW = 1.5
const H = SW / 2 // half stroke inset

function ShapeRenderer({
  shape,
  w,
  h,
  fill
}: {
  shape: NodeShape
  w: number
  h: number
  fill: string
}) {
  switch (shape) {
    case "rectangle":
      return (
        <svg width={w} height={h} style={{ display: "block" }}>
          <rect
            x={H}
            y={H}
            width={w - SW}
            height={h - SW}
            rx={8}
            fill={fill}
            stroke={STROKE}
            strokeWidth={SW}
          />
        </svg>
      )
    case "pill":
      return (
        <svg width={w} height={h} style={{ display: "block" }}>
          <rect
            x={H}
            y={H}
            width={w - SW}
            height={h - SW}
            rx={(h - SW) / 2}
            fill={fill}
            stroke={STROKE}
            strokeWidth={SW}
          />
        </svg>
      )
    case "circle":
      return (
        <svg width={w} height={h} style={{ display: "block" }}>
          <ellipse
            cx={w / 2}
            cy={h / 2}
            rx={w / 2 - H}
            ry={h / 2 - H}
            fill={fill}
            stroke={STROKE}
            strokeWidth={SW}
          />
        </svg>
      )
    case "diamond": {
      const pts = `${w / 2},${H} ${w - H},${h / 2} ${w / 2},${h - H} ${H},${h / 2}`
      return (
        <svg width={w} height={h} style={{ display: "block" }}>
          <polygon points={pts} fill={fill} stroke={STROKE} strokeWidth={SW} />
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
          <polygon points={pts} fill={fill} stroke={STROKE} strokeWidth={SW} />
        </svg>
      )
    }
    case "cylinder": {
      const eRy = Math.round(h * 0.18)
      return (
        <svg width={w} height={h} style={{ display: "block" }}>
          <rect
            x={H}
            y={eRy}
            width={w - SW}
            height={h - eRy * 2}
            fill={fill}
            stroke="none"
          />
          <line
            x1={H}
            y1={eRy}
            x2={H}
            y2={h - eRy}
            stroke={STROKE}
            strokeWidth={SW}
          />
          <line
            x1={w - H}
            y1={eRy}
            x2={w - H}
            y2={h - eRy}
            stroke={STROKE}
            strokeWidth={SW}
          />
          <ellipse
            cx={w / 2}
            cy={h - eRy}
            rx={w / 2 - H}
            ry={eRy}
            fill={fill}
            stroke={STROKE}
            strokeWidth={SW}
          />
          <ellipse
            cx={w / 2}
            cy={eRy}
            rx={w / 2 - H}
            ry={eRy}
            fill={fill}
            stroke={STROKE}
            strokeWidth={SW}
          />
        </svg>
      )
    }
  }
}

function CanvasNodeRenderer({ data }: NodeProps<CanvasNode>) {
  const { label, color, shape } = data as CanvasNodeData
  const nodeShape: NodeShape = (shape as NodeShape) ?? "rectangle"
  const bg = color ?? DEFAULT_NODE_COLOR.fill
  const { width: w, height: h } = DEFAULT_NODE_SIZES[nodeShape]

  return (
    <div style={{ width: w, height: h, position: "relative" }}>
      <ShapeRenderer shape={nodeShape} w={w} h={h} fill={bg} />
      {label ? (
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
            pointerEvents: "none"
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  )
}

// Renders each node inside the MiniMap SVG at the correct shape.
// Must be defined outside Canvas so the reference is stable across renders.
function MiniMapNodeRenderer({
  id,
  x,
  y,
  width,
  height,
  color,
  strokeColor,
  strokeWidth
}: MiniMapNodeProps) {
  const shape = useStore(
    (s) =>
      ((s.nodes.find((n) => n.id === id)?.data as CanvasNodeData | undefined)
        ?.shape as NodeShape) ?? "rectangle"
  )
  const fill = color ?? DEFAULT_NODE_COLOR.fill
  const sk = strokeColor ?? STROKE
  const sw = strokeWidth ?? 1

  switch (shape) {
    case "pill":
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={height / 2}
          ry={height / 2}
          fill={fill}
          stroke={sk}
          strokeWidth={sw}
        />
      )
    case "circle":
      return (
        <ellipse
          cx={x + width / 2}
          cy={y + height / 2}
          rx={width / 2}
          ry={height / 2}
          fill={fill}
          stroke={sk}
          strokeWidth={sw}
        />
      )
    case "diamond": {
      const pts = `${x + width / 2},${y} ${x + width},${y + height / 2} ${x + width / 2},${y + height} ${x},${y + height / 2}`
      return <polygon points={pts} fill={fill} stroke={sk} strokeWidth={sw} />
    }
    case "hexagon": {
      const cx = x + width / 2,
        cy = y + height / 2
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (i * 60 - 90) * (Math.PI / 180)
        return `${cx + (width / 2) * Math.cos(a)},${cy + (height / 2) * Math.sin(a)}`
      }).join(" ")
      return <polygon points={pts} fill={fill} stroke={sk} strokeWidth={sw} />
    }
    case "cylinder": {
      const eRy = Math.max(2, Math.round(height * 0.18))
      return (
        <>
          <rect
            x={x}
            y={y + eRy}
            width={width}
            height={height - eRy * 2}
            fill={fill}
            stroke="none"
          />
          <line
            x1={x}
            y1={y + eRy}
            x2={x}
            y2={y + height - eRy}
            stroke={sk}
            strokeWidth={sw}
          />
          <line
            x1={x + width}
            y1={y + eRy}
            x2={x + width}
            y2={y + height - eRy}
            stroke={sk}
            strokeWidth={sw}
          />
          <ellipse
            cx={x + width / 2}
            cy={y + height - eRy}
            rx={width / 2}
            ry={eRy}
            fill={fill}
            stroke={sk}
            strokeWidth={sw}
          />
          <ellipse
            cx={x + width / 2}
            cy={y + eRy}
            rx={width / 2}
            ry={eRy}
            fill={fill}
            stroke={sk}
            strokeWidth={sw}
          />
        </>
      )
    }
    default: // rectangle
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={Math.min(4, width * 0.1)}
          ry={Math.min(4, height * 0.1)}
          fill={fill}
          stroke={sk}
          strokeWidth={sw}
        />
      )
  }
}

const nodeTypes: NodeTypes = {
  canvasNode: CanvasNodeRenderer
}

export function Canvas({ showMinimap = true }: { showMinimap?: boolean }) {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] }
    })

  const { screenToFlowPosition } = useReactFlow()
  const domNode = useStore((state) => state.domNode)

  // Stable refs so the native event listeners never go stale
  const screenToFlowPositionRef = useRef(screenToFlowPosition)
  useEffect(() => {
    screenToFlowPositionRef.current = screenToFlowPosition
  }, [screenToFlowPosition])
  const onNodesChangeRef = useRef(onNodesChange)
  useEffect(() => {
    onNodesChangeRef.current = onNodesChange
  }, [onNodesChange])

  useEffect(() => {
    if (!domNode) return

    function onDragOver(e: DragEvent) {
      const types = e.dataTransfer?.types
      if (types && Array.from(types).includes("application/ghost-shape")) {
        e.preventDefault()
        if (e.dataTransfer) e.dataTransfer.dropEffect = "copy"
      }
    }

    function onDrop(e: DragEvent) {
      e.preventDefault()
      const raw = e.dataTransfer?.getData("application/ghost-shape")
      if (!raw) return

      let parsed: unknown
      try {
        parsed = JSON.parse(raw)
      } catch {
        return
      }

      if (!parsed || typeof parsed !== "object") return
      const { shape, width, height } = parsed as Record<string, unknown>

      if (typeof shape !== "string" || !(shape in DEFAULT_NODE_SIZES)) return
      const nodeShape = shape as NodeShape
      const defaults = DEFAULT_NODE_SIZES[nodeShape]
      const w =
        Number.isFinite(width) && (width as number) > 0
          ? (width as number)
          : defaults.width
      const h =
        Number.isFinite(height) && (height as number) > 0
          ? (height as number)
          : defaults.height

      const position = screenToFlowPositionRef.current({
        x: e.clientX - w / 2,
        y: e.clientY - h / 2
      })
      const id = crypto.randomUUID()

      const newNode: CanvasNode = {
        id,
        type: "canvasNode",
        position,
        data: {
          label: "",
          color: DEFAULT_NODE_COLOR.fill,
          shape: nodeShape
        },
        width: w,
        height: h
      }

      // Route through useLiveblocksFlow's own onNodesChange so the node is
      // written to storage["flow"]["nodes"] — the path the hook actually reads.
      onNodesChangeRef.current([{ type: "add", item: newNode }])
    }

    function onInsertShape(e: Event) {
      const detail = (e as CustomEvent<Record<string, unknown>>).detail
      if (!detail || typeof detail.shape !== "string" || !(detail.shape in DEFAULT_NODE_SIZES)) return
      const nodeShape = detail.shape as NodeShape
      const defaults = DEFAULT_NODE_SIZES[nodeShape]
      const w =
        Number.isFinite(detail.width) && (detail.width as number) > 0
          ? (detail.width as number)
          : defaults.width
      const h =
        Number.isFinite(detail.height) && (detail.height as number) > 0
          ? (detail.height as number)
          : defaults.height

      if (!domNode) return
      const rect = domNode.getBoundingClientRect()
      const position = screenToFlowPositionRef.current({
        x: rect.left + rect.width / 2 - w / 2,
        y: rect.top + rect.height / 2 - h / 2
      })
      const id = crypto.randomUUID()

      const newNode: CanvasNode = {
        id,
        type: "canvasNode",
        position,
        data: { label: "", color: DEFAULT_NODE_COLOR.fill, shape: nodeShape },
        width: w,
        height: h
      }
      onNodesChangeRef.current([{ type: "add", item: newNode }])
    }

    domNode.addEventListener("dragover", onDragOver)
    domNode.addEventListener("drop", onDrop)
    window.addEventListener("ghost:insert-shape", onInsertShape)
    return () => {
      domNode.removeEventListener("dragover", onDragOver)
      domNode.removeEventListener("drop", onDrop)
      window.removeEventListener("ghost:insert-shape", onInsertShape)
    }
  }, [domNode])

  return (
    <div className="relative h-full w-full bg-bg-base">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        colorMode="dark"
        fitView
      >
        <Cursors />
        {showMinimap && (
          <MiniMap
            nodeComponent={MiniMapNodeRenderer}
            pannable
            zoomable
            style={{ background: "#111114" }}
            nodeColor="#18181c"
            nodeStrokeColor="#3a3a42"
            maskColor="rgba(8,8,9,0.65)"
          />
        )}
        <Background
          variant={BackgroundVariant.Dots}
          color="#2a2a30"
          bgColor="#080809"
        />
      </ReactFlow>
    </div>
  )
}
