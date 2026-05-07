"use client"

import { useState } from "react"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ProjectDialogsContext } from "@/components/editor/project-dialogs-context"
import {
  CreateProjectDialog,
  RenameProjectDialog,
  DeleteProjectDialog
} from "@/components/editor/project-dialogs"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { Project } from "@/hooks/use-project-actions"

interface EditorShellProps {
  children?: React.ReactNode
  initialOwned: Project[]
  initialShared: Project[]
}

export function EditorShell({
  children,
  initialOwned,
  initialShared
}: EditorShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const actionsState = useProjectActions({ initialOwned, initialShared })

  return (
    <ProjectDialogsContext.Provider value={actionsState}>
      <EditorNavbar
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />
      <ProjectSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <main className="pt-14">{children}</main>
      <CreateProjectDialog />
      <RenameProjectDialog />
      <DeleteProjectDialog />
    </ProjectDialogsContext.Provider>
  )
}
