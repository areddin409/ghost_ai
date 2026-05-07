"use client"

import { Plus, X, Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProjectDialogsContext } from "@/components/editor/project-dialogs-context"
import type { Project } from "@/hooks/use-project-actions"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

function OwnedProjectItem({ project }: { project: Project }) {
  const router = useRouter()
  const { openRename, openDelete } = useProjectDialogsContext()

  return (
    <div
      className="group flex items-center justify-between rounded-xl px-3 py-2 hover:bg-bg-subtle cursor-pointer"
      onClick={() => router.push(`/editor/${project.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        e.key === "Enter" && router.push(`/editor/${project.id}`)
      }
    >
      <span className="truncate text-sm text-text-secondary">
        {project.name}
      </span>
      <div className="action flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <Button
          variant="ghost"
          size="icon-sm"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation()
            openRename(project)
          }}
          aria-label={`Rename ${project.name}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation()
            openDelete(project)
          }}
          aria-label={`Delete ${project.name}`}
        >
          <Trash2 className="h-3.5 w-3.5 text-state-error" />
        </Button>
      </div>
    </div>
  )
}

function SharedProjectItem({ project }: { project: Project }) {
  const router = useRouter()

  return (
    <div
      className="flex items-center rounded-xl px-3 py-2 hover:bg-bg-subtle cursor-pointer"
      onClick={() => router.push(`/editor/${project.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        e.key === "Enter" && router.push(`/editor/${project.id}`)
      }
    >
      <span className="truncate text-sm text-text-secondary">
        {project.name}
      </span>
    </div>
  )
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  const { openCreate, ownedProjects, sharedProjects } =
    useProjectDialogsContext()

  return (
    <aside
      aria-hidden={!isOpen}
      inert={!isOpen || undefined}
      className={`fixed left-0 top-14 z-40 flex h-[calc(100vh-3.5rem)] w-72 flex-col border-r border-border-default bg-bg-surface shadow-xl transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
        <span className="text-sm font-semibold text-text-primary">
          Projects
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs
        defaultValue="my-projects"
        className="flex flex-1 flex-col overflow-hidden"
      >
        <div className="px-4 pt-3">
          <TabsList className="w-full">
            <TabsTrigger value="my-projects" className="flex-1">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex-1">
              Shared
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="my-projects"
          className="flex-1 overflow-y-auto px-2 py-2"
        >
          {ownedProjects.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-text-muted">No projects yet</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {ownedProjects.map((project) => (
                <OwnedProjectItem key={project.id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent
          value="shared"
          className="flex-1 overflow-y-auto px-2 py-2"
        >
          {sharedProjects.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-text-muted">No shared projects</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {sharedProjects.map((project) => (
                <SharedProjectItem key={project.id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="border-t border-border-default p-4">
        <Button variant="outline" className="w-full" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
    </aside>
  )
}
