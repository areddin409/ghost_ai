"use client"

import { Minus, Plus, Maximize2, Undo2, Redo2 } from "lucide-react"
import type { ReactFlowInstance } from "@xyflow/react"

interface CanvasControlBarProps {
  instance: ReactFlowInstance | null
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
}

interface ControlButtonProps {
  onClick: () => void
  disabled?: boolean
  title: string
  children: React.ReactNode
}

function ControlButton({ onClick, disabled, title, children }: ControlButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex h-7 w-7 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-base hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  )
}

export function CanvasControlBar({
  instance,
  canUndo,
  canRedo,
  onUndo,
  onRedo
}: CanvasControlBarProps) {
  return (
    <div className="absolute bottom-6 left-4 z-10 flex items-center gap-0.5 rounded-full border border-border-default bg-bg-surface px-2 py-1 shadow-lg">
      <ControlButton
        onClick={() => instance?.zoomOut({ duration: 200 })}
        title="Zoom out (−)"
      >
        <Minus size={14} />
      </ControlButton>

      <ControlButton
        onClick={() => instance?.fitView({ duration: 300, padding: 0.1 })}
        title="Fit view"
      >
        <Maximize2 size={14} />
      </ControlButton>

      <ControlButton
        onClick={() => instance?.zoomIn({ duration: 200 })}
        title="Zoom in (+)"
      >
        <Plus size={14} />
      </ControlButton>

      <div className="mx-1.5 h-4 w-px bg-border-default" />

      <ControlButton
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 size={14} />
      </ControlButton>

      <ControlButton
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo2 size={14} />
      </ControlButton>
    </div>
  )
}
