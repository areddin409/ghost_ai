"use client"

import type { KeyboardEvent } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useProjectDialogsContext } from "@/components/editor/project-dialogs-context"

export function CreateProjectDialog() {
  const {
    dialog,
    isLoading,
    createName,
    setCreateName,
    roomIdPreview,
    close,
    handleSubmit
  } = useProjectDialogsContext()
  const isOpen = dialog.type === "create"

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Name your new architecture workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Input
            placeholder="Project name"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            autoFocus
          />
          {roomIdPreview && (
            <p className="font-mono text-xs text-text-muted">
              room: {roomIdPreview}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={close} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={() => void handleSubmit()}
            disabled={!createName.trim() || isLoading}
          >
            {isLoading ? "Creating…" : "Create project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function RenameProjectDialog() {
  const { dialog, isLoading, renameName, setRenameName, close, handleSubmit } =
    useProjectDialogsContext()
  const isOpen = dialog.type === "rename"
  const project = dialog.type === "rename" ? dialog.project : null

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter" || !renameName.trim() || isLoading) return
    e.preventDefault()
    void handleSubmit()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          {project && (
            <DialogDescription>
              Currently:{" "}
              <span className="text-text-secondary">{project.name}</span>
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="py-2">
          <Input
            placeholder="New project name"
            value={renameName}
            onChange={(e) => setRenameName(e.target.value)}
            onKeyDown={onKeyDown}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={close} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={() => void handleSubmit()}
            disabled={!renameName.trim() || isLoading}
          >
            {isLoading ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function DeleteProjectDialog() {
  const { dialog, isLoading, close, handleSubmit } = useProjectDialogsContext()
  const isOpen = dialog.type === "delete"
  const project = dialog.type === "delete" ? dialog.project : null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          {project && (
            <DialogDescription>
              This will permanently delete{" "}
              <span className="text-text-secondary">{project.name}</span>. This
              action cannot be undone.
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={close} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => void handleSubmit()}
            disabled={isLoading}
          >
            {isLoading ? "Deleting…" : "Delete project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
