"use client"

import { useState } from "react"
import { WorkspaceNavbar } from "./workspace-navbar"
import { ProjectSidebar } from "@/components/editor/panels/project-sidebar"
import { CanvasWrapper } from "@/components/editor/canvas/canvas-wrapper"
import { AiSidebar } from "@/components/editor/panels/ai-sidebar"
import { ShareDialog } from "@/components/editor/dialogs/share-dialog"
import { ProjectDialogsContext } from "@/components/editor/dialogs/project-dialogs-context"
import {
  CreateProjectDialog,
  RenameProjectDialog,
  DeleteProjectDialog
} from "@/components/editor/dialogs/project-dialogs"
import { ShapePanel } from "@/components/editor/panels/shape-panel"
import { StarterTemplatesModal } from "@/components/editor/dialogs/starter-templates-modal"
import { UserSettingsProvider } from "@/components/editor/dialogs/user-settings-context"
import { UserSettingsModal } from "@/components/editor/dialogs/user-settings-modal"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { Project } from "@/hooks/use-project-actions"
import type { UserSettings } from "@/app/generated/prisma/client"

interface WorkspaceShellProps {
  project: Project
  initialOwned: Project[]
  initialShared: Project[]
  isOwner: boolean
  initialSettings: UserSettings
}

export function WorkspaceShell({
  project,
  initialOwned,
  initialShared,
  isOwner,
  initialSettings,
}: WorkspaceShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [templatesOpen, setTemplatesOpen] = useState(false)
  const actionsState = useProjectActions({ initialOwned, initialShared })

  const onOpenSettings = () => setIsSettingsOpen(true)

  return (
    <UserSettingsProvider initialSettings={initialSettings}>
      <ProjectDialogsContext.Provider value={actionsState}>
        <WorkspaceNavbar
          projectName={project.name}
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
          isAiOpen={aiOpen}
          onToggleAi={() => setAiOpen((o) => !o)}
          onShare={() => setShareOpen(true)}
          onOpenSettings={onOpenSettings}
          onOpenTemplates={() => setTemplatesOpen(true)}
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
          <CanvasWrapper roomId={project.id} />
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
        <StarterTemplatesModal open={templatesOpen} onOpenChange={setTemplatesOpen} />
        <UserSettingsModal open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        <CreateProjectDialog />
        <RenameProjectDialog />
        <DeleteProjectDialog />
      </ProjectDialogsContext.Provider>
    </UserSettingsProvider>
  )
}
