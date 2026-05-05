"use client"

import { createContext, useContext } from "react"
import type { ProjectDialogsState } from "@/hooks/use-project-dialogs"

export const ProjectDialogsContext = createContext<ProjectDialogsState | null>(null)

export function useProjectDialogsContext(): ProjectDialogsState {
  const ctx = useContext(ProjectDialogsContext)
  if (!ctx) {
    throw new Error(
      "useProjectDialogsContext must be used within a ProjectDialogsContext.Provider"
    )
  }
  return ctx
}
