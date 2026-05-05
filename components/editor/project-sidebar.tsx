"use client"

import { useState } from "react"
import { Plus, X, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProjectDialogsContext } from "@/components/editor/project-dialogs-context"
import type { MockProject } from "@/hooks/use-project-dialogs"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

function ProjectItem({ project }: { project: MockProject }) {
  const { openRename, openDelete } = useProjectDialogsContext()
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-bg-subtle cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="truncate text-sm text-text-secondary">
        {project.name}
      </span>
      {project.isOwned && (
        <div
          className={`flex shrink-0 items-center gap-1 transition-opacity ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            variant="ghost"
            size="icon-sm"
            tabIndex={hovered ? 0 : -1}
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
            tabIndex={hovered ? 0 : -1}
            onClick={(e) => {
              e.stopPropagation()
              openDelete(project)
            }}
            aria-label={`Delete ${project.name}`}
          >
            <Trash2 className="h-3.5 w-3.5 text-state-error" />
          </Button>
        </div>
      )}
    </div>
  )
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  const { openCreate, projects } = useProjectDialogsContext()
  const myProjects = projects.filter((p) => p.isOwned)
  const starredProjects = projects.filter((p) => p.starred)

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
            <TabsTrigger value="starred" className="flex-1">
              Starred
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="my-projects"
          className="flex-1 overflow-y-auto px-2 py-2"
        >
          {myProjects.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-text-muted">No projects yet</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {myProjects.map((project) => (
                <ProjectItem key={project.id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent
          value="starred"
          className="flex-1 overflow-y-auto px-2 py-2"
        >
          {starredProjects.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-text-muted">No starred projects</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {starredProjects.map((project) => (
                <ProjectItem key={project.id} project={project} />
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
