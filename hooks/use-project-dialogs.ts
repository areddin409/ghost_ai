"use client"

import { useState } from "react"

export interface MockProject {
  id: string
  name: string
  slug: string
  isOwned: boolean
  starred: boolean
}

const INITIAL_PROJECTS: MockProject[] = [
  {
    id: "1",
    name: "My App Architecture",
    slug: "my-app-architecture",
    isOwned: true,
    starred: false,
  },
  {
    id: "2",
    name: "Cloud Infrastructure",
    slug: "cloud-infrastructure",
    isOwned: true,
    starred: true,
  },
  {
    id: "3",
    name: "Shared Design System",
    slug: "shared-design-system",
    isOwned: false,
    starred: false,
  },
]

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export type DialogState =
  | { type: "none" }
  | { type: "create" }
  | { type: "rename"; project: MockProject }
  | { type: "delete"; project: MockProject }

export interface ProjectDialogsState {
  projects: MockProject[]
  dialog: DialogState
  isLoading: boolean
  createName: string
  setCreateName: (name: string) => void
  renameName: string
  setRenameName: (name: string) => void
  openCreate: () => void
  openRename: (project: MockProject) => void
  openDelete: (project: MockProject) => void
  close: () => void
  handleSubmit: () => void
}

export function useProjectDialogs(): ProjectDialogsState {
  const [projects, setProjects] = useState<MockProject[]>(INITIAL_PROJECTS)
  const [dialog, setDialog] = useState<DialogState>({ type: "none" })
  const [isLoading, setIsLoading] = useState(false)
  const [createName, setCreateName] = useState("")
  const [renameName, setRenameName] = useState("")

  function openCreate() {
    setCreateName("")
    setDialog({ type: "create" })
  }

  function openRename(project: MockProject) {
    setRenameName(project.name)
    setDialog({ type: "rename", project })
  }

  function openDelete(project: MockProject) {
    setDialog({ type: "delete", project })
  }

  function close() {
    setDialog({ type: "none" })
    setIsLoading(false)
  }

  function handleSubmit() {
    setIsLoading(true)
    const snapshot = dialog

    setTimeout(() => {
      if (snapshot.type === "create") {
        const name = createName.trim()
        setProjects((prev) => [
          ...prev,
          { id: crypto.randomUUID(), name, slug: toSlug(name), isOwned: true, starred: false },
        ])
      } else if (snapshot.type === "rename") {
        const { project } = snapshot
        const name = renameName.trim()
        setProjects((prev) =>
          prev.map((p) =>
            p.id === project.id ? { ...p, name, slug: toSlug(name) } : p
          )
        )
      } else if (snapshot.type === "delete") {
        const { project } = snapshot
        setProjects((prev) => prev.filter((p) => p.id !== project.id))
      }

      setIsLoading(false)
      setDialog({ type: "none" })
    }, 400)
  }

  return {
    projects,
    dialog,
    isLoading,
    createName,
    setCreateName,
    renameName,
    setRenameName,
    openCreate,
    openRename,
    openDelete,
    close,
    handleSubmit
  }
}
