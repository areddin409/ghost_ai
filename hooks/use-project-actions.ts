"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export interface Project {
  id: string
  ownerId: string
  name: string
  description: string | null
  status: string
  canvasJsonPath: string | null
  createdAt: string
  updatedAt: string
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function shortSuffix(): string {
  return Math.random().toString(36).slice(2, 7)
}

export type DialogState =
  | { type: "none" }
  | { type: "create"; suffix: string }
  | { type: "rename"; project: Project }
  | { type: "delete"; project: Project }

export interface ProjectActionsState {
  ownedProjects: Project[]
  sharedProjects: Project[]
  dialog: DialogState
  isLoading: boolean
  createName: string
  setCreateName: (name: string) => void
  renameName: string
  setRenameName: (name: string) => void
  roomIdPreview: string
  openCreate: () => void
  openRename: (project: Project) => void
  openDelete: (project: Project) => void
  close: () => void
  handleSubmit: () => Promise<void>
}

interface UseProjectActionsOptions {
  initialOwned: Project[]
  initialShared: Project[]
}

export function useProjectActions({
  initialOwned,
  initialShared
}: UseProjectActionsOptions): ProjectActionsState {
  const router = useRouter()
  const pathname = usePathname()

  const [ownedProjects, setOwnedProjects] = useState<Project[]>(initialOwned)
  const [sharedProjects] = useState<Project[]>(initialShared)
  const [dialog, setDialog] = useState<DialogState>({ type: "none" })
  const [isLoading, setIsLoading] = useState(false)
  const [createName, setCreateName] = useState("")
  const [renameName, setRenameName] = useState("")

  const roomIdPreview =
    dialog.type === "create" && createName.trim()
      ? `${slugify(createName)}-${dialog.suffix}`
      : ""

  function openCreate() {
    setCreateName("")
    setDialog({ type: "create", suffix: shortSuffix() })
  }

  function openRename(project: Project) {
    setRenameName(project.name)
    setDialog({ type: "rename", project })
  }

  function openDelete(project: Project) {
    setDialog({ type: "delete", project })
  }

  function close() {
    setDialog({ type: "none" })
    setIsLoading(false)
  }

  async function handleSubmit() {
    setIsLoading(true)
    const snapshot = dialog

    try {
      if (snapshot.type === "create") {
        const name = createName.trim() || "Untitled Project"
        const roomId = `${slugify(name)}-${snapshot.suffix}`
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: roomId, name })
        })
        if (!res.ok) throw new Error("Failed to create project")
        const project: Project = await res.json()
        setDialog({ type: "none" })
        router.push(`/editor/${project.id}`)
        return
      }

      if (snapshot.type === "rename") {
        const { project } = snapshot
        const name = renameName.trim()
        const res = await fetch(`/api/projects/${project.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name })
        })
        if (!res.ok) throw new Error("Failed to rename project")
        setOwnedProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, name } : p))
        )
        setDialog({ type: "none" })
        router.refresh()
        return
      }

      if (snapshot.type === "delete") {
        const { project } = snapshot
        const res = await fetch(`/api/projects/${project.id}`, {
          method: "DELETE"
        })
        if (!res.ok) throw new Error("Failed to delete project")
        setOwnedProjects((prev) => prev.filter((p) => p.id !== project.id))
        setDialog({ type: "none" })
        if (pathname.includes(project.id)) {
          router.push("/editor")
        } else {
          router.refresh()
        }
        return
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    ownedProjects,
    sharedProjects,
    dialog,
    isLoading,
    createName,
    setCreateName,
    renameName,
    setRenameName,
    roomIdPreview,
    openCreate,
    openRename,
    openDelete,
    close,
    handleSubmit
  }
}
