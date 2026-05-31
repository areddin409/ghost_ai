"use client"

import { useEffect } from "react"
import type { ReactFlowInstance } from "@xyflow/react"

interface KeyboardShortcutsOptions {
  instance: ReactFlowInstance | null
  undo: () => void
  redo: () => void
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
  redo
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
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [instance, undo, redo])
}
