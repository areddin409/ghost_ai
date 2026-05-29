"use client"

import { useState } from "react"
import { WorkspaceNavbar } from "@/components/editor/workspace-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { CanvasWrapper } from "@/components/editor/canvas-wrapper"
import { AiSidebar } from "@/components/editor/ai-sidebar"
import { ShareDialog } from "@/components/editor/share-dialog"
import { ProjectDialogsContext } from "@/components/editor/project-dialogs-context"
import {
  CreateProjectDialog,
  RenameProjectDialog,
  DeleteProjectDialog
} from "@/components/editor/project-dialogs"
import { ShapePanel } from "@/components/editor/shape-panel"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { Project } from "@/hooks/use-project-actions"

interface WorkspaceShellProps {
  project: Project
  initialOwned: Project[]
  initialShared: Project[]
  isOwner: boolean
}

export function WorkspaceShell({
  project,
  initialOwned,
  initialShared,
  isOwner
}: WorkspaceShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [minimapVisible, setMinimapVisible] = useState(true)
  const actionsState = useProjectActions({ initialOwned, initialShared })

  return (
    <ProjectDialogsContext.Provider value={actionsState}>
      <WorkspaceNavbar
        projectName={project.name}
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        isAiOpen={aiOpen}
        onToggleAi={() => setAiOpen((o) => !o)}
        onShare={() => setShareOpen(true)}
        isMinimapVisible={minimapVisible}
        onToggleMinimap={() => setMinimapVisible((o) => !o)}
      />
      <ProjectSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeProjectId={project.id}
      />
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className="fixed inset-0 top-14 z-0 bg-bg-base">
        <CanvasWrapper roomId={project.id} showMinimap={minimapVisible} />
      </div>
      <ShapePanel />
      <AiSidebar isOpen={aiOpen} />
      <ShareDialog
        projectId={project.id}
        projectName={project.name}
        isOwner={isOwner}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />
      <CreateProjectDialog />
      <RenameProjectDialog />
      <DeleteProjectDialog />
    </ProjectDialogsContext.Provider>
  )
}
