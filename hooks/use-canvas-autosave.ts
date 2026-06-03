"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { CanvasNode, CanvasEdge } from "@/types/canvas"

type SaveStatus = "idle" | "saving" | "saved" | "error"

interface UseCanvasAutosaveParams {
  projectId: string
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

interface UseCanvasAutosaveResult {
  saveStatus: SaveStatus
}

export function useCanvasAutosave({
  projectId,
  nodes,
  edges,
}: UseCanvasAutosaveParams): UseCanvasAutosaveResult {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMountedRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const save = useCallback(
    async (nodesToSave: CanvasNode[], edgesToSave: CanvasEdge[], signal: AbortSignal) => {
      setSaveStatus("saving")
      try {
        const response = await fetch(`/api/projects/${projectId}/canvas`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nodes: nodesToSave, edges: edgesToSave }),
          signal,
        })
        if (!response.ok) {
          setSaveStatus("error")
        } else {
          setSaveStatus("saved")
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return
        }
        setSaveStatus("error")
      }
    },
    [projectId]
  )

  useEffect(() => {
    // Skip the initial mount — only save on subsequent changes
    if (!isMountedRef.current) {
      isMountedRef.current = true
      return
    }

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()
      save(nodes, edges, abortControllerRef.current.signal)
    }, 1500)

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      abortControllerRef.current?.abort()
    }
  }, [nodes, edges, save])

  return { saveStatus }
}
