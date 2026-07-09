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
  triggerSave: () => void
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
  const nodesRef = useRef(nodes)
  const edgesRef = useRef(edges)

  useEffect(() => {
    nodesRef.current = nodes
  }, [nodes])

  useEffect(() => {
    edgesRef.current = edges
  }, [edges])

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

  // Tracks the last payload a save was scheduled (or fired) for. useLiveblocksFlow
  // returns new array identities on unrelated re-renders — including the re-render
  // caused by setSaveStatus itself — so debouncing on identity alone self-perpetuates:
  // save → re-render → new timer → save. Comparing serialized content breaks the loop.
  const lastScheduledRef = useRef<string | null>(null)

  useEffect(() => {
    const payload = JSON.stringify({ nodes, edges })

    // Skip the initial mount — only save on subsequent changes
    if (!isMountedRef.current) {
      isMountedRef.current = true
      lastScheduledRef.current = payload
      return
    }

    if (payload === lastScheduledRef.current) return
    lastScheduledRef.current = payload

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()
      void save(nodesRef.current, edgesRef.current, abortControllerRef.current.signal)
    }, 1500)
  }, [nodes, edges, save])

  // Abort only on unmount. The old per-effect cleanup ran on every nodes/edges
  // identity change, killing pending timers and in-flight requests mid-save.
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      abortControllerRef.current?.abort()
    }
  }, [])

  const triggerSave = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    lastScheduledRef.current = JSON.stringify({
      nodes: nodesRef.current,
      edges: edgesRef.current,
    })
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()
    void save(nodesRef.current, edgesRef.current, abortControllerRef.current.signal)
  }, [save])

  return { saveStatus, triggerSave }
}
