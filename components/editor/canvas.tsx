"use client"

import { useCallback, useEffect, useRef } from "react"
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  ConnectionMode,
  ConnectionLineType,
  useReactFlow,
  useStore,
  type NodeTypes,
  type MiniMapNodeProps,
  type Connection,
} from "@xyflow/react"
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow"
import { useHistory, useCanUndo, useCanRedo } from "@liveblocks/react"
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
import { CanvasNodeRenderer } from "./canvas-node"
import { CanvasEdgeRenderer } from "./canvas-edge"
import { CanvasControlBar } from "./canvas-control-bar"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"

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
  const sk = strokeColor ?? "#3a3a42"
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

const edgeTypes = {
  canvasEdge: CanvasEdgeRenderer
}

const defaultEdgeOptions = {
  type: "canvasEdge",
}

export function Canvas({ showMinimap = true }: { showMinimap?: boolean }) {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] }
    })

  const instance = useReactFlow()
  const { screenToFlowPosition } = instance
  const domNode = useStore((state) => state.domNode)

  const { undo, redo } = useHistory()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()

  useKeyboardShortcuts({ instance, undo, redo })

  const reconnectSuccessRef = useRef(false)

  // Tracks the source-handle group the user last clicked for click-to-cycle disambiguation.
  // When two edges share the same source + sourceHandle, React Flow always fires onEdgeClick
  // for the topmost (last-rendered) edge. Repeated clicks on the same group cycle the
  // logical selection through all siblings so every edge remains reachable.
  const edgeGroupCycleRef = useRef<{ groupKey: string; currentId: string } | null>(null)

  const handleReconnectStart = useCallback(() => {
    reconnectSuccessRef.current = false
  }, [])

  const handleReconnect = useCallback(
    (oldEdge: CanvasEdge, newConnection: Connection) => {
      reconnectSuccessRef.current = true
      const newEdge: CanvasEdge = {
        ...oldEdge,
        source: newConnection.source,
        target: newConnection.target,
        sourceHandle: newConnection.sourceHandle ?? null,
        targetHandle: newConnection.targetHandle ?? null,
        selected: false,
      }
      // onEdgesChange({ type: "remove" }) is a no-op in @liveblocks/react-flow —
      // deletion must go through onDelete which calls edgesMap.delete() in storage.
      onDelete({ nodes: [], edges: [oldEdge] })
      onEdgesChange([{ type: "add", item: newEdge }])
    },
    [onDelete, onEdgesChange]
  )

  const handleReconnectEnd = useCallback(
    (_event: MouseEvent | TouchEvent, edge: CanvasEdge) => {
      if (!reconnectSuccessRef.current) {
        onDelete({ nodes: [], edges: [edge] })
      }
    },
    [onDelete]
  )

  const handleEdgeClick = useCallback(
    (event: React.MouseEvent, clickedEdge: CanvasEdge) => {
      // Compute the flow-coordinate position of a named handle on a node.
      // Used to determine which endpoint of the clicked edge is nearest to the
      // mouse, so we anchor the disambiguation group at the correct handle point.
      const getHandlePos = (nodeId: string, handleId: string | null | undefined) => {
        const node = instance.getNode(nodeId)
        if (!node) return null
        const { x, y } = node.position
        const w = node.width ?? 160
        const h = node.height ?? 80
        switch (handleId) {
          case "top":    return { x: x + w / 2, y }
          case "right":  return { x: x + w,     y: y + h / 2 }
          case "bottom": return { x: x + w / 2, y: y + h }
          case "left":   return { x,             y: y + h / 2 }
          default:       return { x: x + w / 2,  y: y + h / 2 }
        }
      }

      const clickPos = instance.screenToFlowPosition({ x: event.clientX, y: event.clientY })
      const srcPos = getHandlePos(clickedEdge.source, clickedEdge.sourceHandle)
      const tgtPos = getHandlePos(clickedEdge.target, clickedEdge.targetHandle)
      if (!srcPos || !tgtPos) return

      const dSrc = Math.hypot(clickPos.x - srcPos.x, clickPos.y - srcPos.y)
      const dTgt = Math.hypot(clickPos.x - tgtPos.x, clickPos.y - tgtPos.y)

      // Anchor = whichever endpoint is closest to the click.
      // Grouping by the anchor (not just source) ensures edges that meet at the
      // same handle in opposite directions (one starts there, another ends there)
      // are treated as the same ambiguous group.
      const anchor = dSrc <= dTgt
        ? { node: clickedEdge.source, handle: clickedEdge.sourceHandle }
        : { node: clickedEdge.target, handle: clickedEdge.targetHandle }

      const group = edges.filter(
        (e) =>
          (e.source === anchor.node && e.sourceHandle === anchor.handle) ||
          (e.target === anchor.node && e.targetHandle === anchor.handle)
      )

      if (group.length <= 1) {
        edgeGroupCycleRef.current = null
        return
      }

      const groupKey = `${anchor.node}:${anchor.handle ?? ""}`
      const ref = edgeGroupCycleRef.current

      if (ref?.groupKey === groupKey) {
        if (ref.currentId === clickedEdge.id) {
          // Same top edge clicked again — cycle selection to the next sibling and
          // elevate it to zIndex 1 so its reconnect handles are on top.
          const sorted = [...group].sort((a, b) => a.id.localeCompare(b.id))
          const idx = sorted.findIndex((e) => e.id === ref.currentId)
          const next = sorted[(idx + 1) % sorted.length]
          onEdgesChange(
            sorted.map((e) => ({
              type: "replace" as const,
              id: e.id,
              item: {
                ...e,
                selected: e.id === next.id,
                zIndex: e.id === next.id ? 1 : 0,
              },
            }))
          )
          edgeGroupCycleRef.current = { groupKey, currentId: next.id }
        } else {
          // User directly clicked a different edge in the group — track it, no override
          edgeGroupCycleRef.current = { groupKey, currentId: clickedEdge.id }
        }
      } else {
        // First interaction with this group — record position, no override
        edgeGroupCycleRef.current = { groupKey, currentId: clickedEdge.id }
      }
    },
    [edges, instance, onEdgesChange]
  )

  const handlePaneClick = useCallback(() => {
    edgeGroupCycleRef.current = null
  }, [])

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
      <CanvasControlBar
        instance={instance}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        edgesReconnectable
        onReconnectStart={handleReconnectStart}
        onReconnect={handleReconnect}
        onReconnectEnd={handleReconnectEnd}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Loose}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={{ stroke: "rgba(248,250,252,0.35)", strokeWidth: 1.5 }}
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
