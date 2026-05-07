"use client"

import { createContext, useContext } from "react"
import type { ProjectActionsState } from "@/hooks/use-project-actions"

export const ProjectDialogsContext =
  createContext<ProjectActionsState | null>(null)

export function useProjectDialogsContext(): ProjectActionsState {
  const ctx = useContext(ProjectDialogsContext)
  if (!ctx) {
    throw new Error(
      "useProjectDialogsContext must be used within a ProjectDialogsContext.Provider"
    )
  }
  return ctx
}
