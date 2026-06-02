"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface DragEdgeContextValue {
  dragOverEdgeId: string | null
  setDragOverEdgeId: (id: string | null) => void
}

const DragEdgeContext = createContext<DragEdgeContextValue | null>(null)

export function DragEdgeProvider({ children }: { children: ReactNode }) {
  const [dragOverEdgeId, setDragOverEdgeId] = useState<string | null>(null)
  return (
    <DragEdgeContext.Provider value={{ dragOverEdgeId, setDragOverEdgeId }}>
      {children}
    </DragEdgeContext.Provider>
  )
}

export function useDragEdge(): DragEdgeContextValue {
  const ctx = useContext(DragEdgeContext)
  if (!ctx) throw new Error("useDragEdge must be used within DragEdgeProvider")
  return ctx
}
