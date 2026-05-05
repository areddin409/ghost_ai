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
import { useProjectDialogs } from "@/hooks/use-project-dialogs"

export function EditorShell({ children }: { children?: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const dialogsState = useProjectDialogs()

  return (
    <ProjectDialogsContext.Provider value={dialogsState}>
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
