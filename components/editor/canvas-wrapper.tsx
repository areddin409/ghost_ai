"use client"

import { Component, type ReactNode } from "react"
import { LiveMap, LiveObject } from "@liveblocks/client"
import { LiveblocksProvider, RoomProvider } from "@liveblocks/react"
import { ClientSideSuspense } from "@liveblocks/react/suspense"
import { ReactFlowProvider } from "@xyflow/react"
import { Canvas } from "@/components/editor/canvas"

interface CanvasWrapperProps {
  roomId: string
}

export function CanvasWrapper({
  roomId,
}: CanvasWrapperProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{ cursor: null, isThinking: false }}
        initialStorage={{
          flow: new LiveObject({ nodes: new LiveMap(), edges: new LiveMap() })
        }}
      >
        <CanvasErrorBoundary>
          <ClientSideSuspense fallback={<CanvasLoading />}>
            <ReactFlowProvider>
              <Canvas />
            </ReactFlowProvider>
          </ClientSideSuspense>
        </CanvasErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  )
}

function CanvasLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <span className="font-mono text-xs tracking-widest text-text-faint uppercase">
        Connecting to canvas…
      </span>
    </div>
  )
}

function CanvasErrorFallback() {
  return (
    <div className="flex h-full items-center justify-center">
      <span className="text-sm text-state-error">
        Failed to connect to canvas. Please refresh and try again.
      </span>
    </div>
  )
}

interface ErrorBoundaryState {
  hasError: boolean
}

class CanvasErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return <CanvasErrorFallback />
    return this.props.children
  }
}
