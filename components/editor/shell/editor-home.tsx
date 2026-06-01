"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProjectDialogsContext } from "@/components/editor/dialogs/project-dialogs-context"

export function EditorHome() {
  const { openCreate } = useProjectDialogsContext()

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-5">
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-semibold text-text-primary">
          Create a project or open an existing one
        </h1>
        <p className="text-sm text-text-muted">
          Start a new architecture workspace, or choose a project from the
          sidebar.
        </p>
      </div>
      <Button onClick={openCreate}>
        <Plus className="h-4 w-4" />
        New project
      </Button>
    </div>
  )
}
