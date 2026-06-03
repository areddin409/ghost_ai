"use client"

import { useEffect } from "react"
import type { ReactFlowInstance, Node, Edge } from "@xyflow/react"

interface KeyboardShortcutsOptions {
  instance: ReactFlowInstance | null
  undo: () => void
  redo: () => void
  // Typed loosely so callers with specific node/edge subtypes (e.g. CanvasNode) satisfy
  // this without needing a wrapper — the runtime data is always the correct subtype.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDelete: (params: { nodes: any[], edges: any[] }) => void
}

function isEditing(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false
  const tag = target.tagName.toLowerCase()
  if (tag === "input" || tag === "textarea") return true
  return (target as HTMLElement).isContentEditable
}

export function useKeyboardShortcuts({
  instance,
  undo,
  redo,
  onDelete
}: KeyboardShortcutsOptions): void {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isEditing(e.target)) return

      const ctrl = e.ctrlKey || e.metaKey

      if (ctrl && e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault()
        redo()
        return
      }

      if (ctrl && (e.key === "y" || e.key === "Y")) {
        e.preventDefault()
        redo()
        return
      }

      if (ctrl && (e.key === "z" || e.key === "Z")) {
        e.preventDefault()
        undo()
        return
      }

      if (!ctrl && (e.key === "+" || e.key === "=")) {
        e.preventDefault()
        instance?.zoomIn({ duration: 200 })
        return
      }

      if (!ctrl && e.key === "-") {
        e.preventDefault()
        instance?.zoomOut({ duration: 200 })
        return
      }

      if (e.key === "Home") {
        e.preventDefault()
        instance?.fitView({ duration: 300, padding: 0.1 })
        return
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        if (!instance) return
        const selectedNodes = instance.getNodes().filter((n) => n.selected)
        const selectedEdges = instance.getEdges().filter((ed) => ed.selected)
        if (selectedNodes.length > 0 || selectedEdges.length > 0) {
          e.preventDefault()
          onDelete({ nodes: selectedNodes, edges: selectedEdges })
        }
        return
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [instance, undo, redo, onDelete])
}
