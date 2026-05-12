"use client"

import * as React from "react"
import { Copy, Check, X, UserPlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Collaborator {
  id: string
  email: string
  displayName: string
  imageUrl: string | null
}

interface ShareDialogProps {
  projectId: string
  projectName: string
  isOwner: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

function CollaboratorAvatar({
  displayName,
  imageUrl,
}: {
  displayName: string
  imageUrl: string | null
}) {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-subtle">
      {imageUrl ? (
        <img src={imageUrl} alt={displayName} className="h-full w-full object-cover" />
      ) : (
        <span className="text-xs font-medium text-text-secondary">
          {displayName.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  )
}

export function ShareDialog({
  projectId,
  projectName,
  isOwner,
  open,
  onOpenChange,
}: ShareDialogProps) {
  const [collaborators, setCollaborators] = React.useState<Collaborator[]>([])
  const [loading, setLoading] = React.useState(false)
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [inviting, setInviting] = React.useState(false)
  const [inviteError, setInviteError] = React.useState<string | null>(null)
  const [removingId, setRemovingId] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setLoading(true)
      fetch(`/api/projects/${projectId}/collaborators`)
        .then((res) => res.json())
        .then((data: Collaborator[]) => {
          setCollaborators(data)
        })
        .catch(() => {
          setCollaborators([])
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setInviteEmail("")
      setInviteError(null)
    }
  }, [open, projectId])

  async function handleInvite() {
    const email = inviteEmail.trim()
    if (!email || inviting) return
    setInviting(true)
    setInviteError(null)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data: { error?: string } & Partial<Collaborator> = await res.json()
      if (!res.ok) {
        setInviteError(data.error ?? "Something went wrong.")
      } else {
        setCollaborators((prev) => [...prev, data as Collaborator])
        setInviteEmail("")
      }
    } catch {
      setInviteError("Something went wrong.")
    } finally {
      setInviting(false)
    }
  }

  async function handleRemove(collaboratorId: string) {
    setRemovingId(collaboratorId)
    try {
      const res = await fetch(
        `/api/projects/${projectId}/collaborators/${collaboratorId}`,
        { method: "DELETE" }
      )
      if (res.ok) {
        setCollaborators((prev) => prev.filter((c) => c.id !== collaboratorId))
      }
    } finally {
      setRemovingId(null)
    }
  }

  function handleCopyLink() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/editor/${projectId}`
        : `/editor/${projectId}`
    void navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const projectUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/editor/${projectId}`
      : `/editor/${projectId}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share &ldquo;{projectName}&rdquo;</DialogTitle>
          <DialogDescription>
            {isOwner
              ? "Invite collaborators to view and edit this project."
              : "You have access to this project as a collaborator."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 rounded-xl border border-border-default bg-bg-subtle px-3 py-2">
          <span className="flex-1 truncate font-mono text-sm text-text-muted">
            {projectUrl}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => void handleCopyLink()}
            aria-label="Copy link"
          >
            {copied ? (
              <Check className="text-state-success" />
            ) : (
              <Copy />
            )}
          </Button>
        </div>

        {isOwner && (
          <div className="space-y-1">
            <div className="flex gap-2">
              <Input
                className="flex-1"
                type="email"
                placeholder="Email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !inviting) void handleInvite()
                }}
                disabled={inviting}
              />
              <Button
                size="sm"
                onClick={() => void handleInvite()}
                disabled={inviting || !inviteEmail.trim()}
              >
                <UserPlus />
                Invite
              </Button>
            </div>
            {inviteError && (
              <p className="text-xs text-state-error">{inviteError}</p>
            )}
          </div>
        )}

        <div className="space-y-1">
          <p className="text-xs font-medium text-text-muted">
            {collaborators.length === 0 && !loading
              ? "No collaborators yet"
              : "Collaborators"}
          </p>
          {loading ? (
            <p className="py-2 text-center text-xs text-text-faint">Loading…</p>
          ) : (
            <ul className="space-y-1">
              {collaborators.map((collab) => (
                <li
                  key={collab.id}
                  className="flex items-center gap-3 rounded-xl px-2 py-1.5"
                >
                  <CollaboratorAvatar
                    displayName={collab.displayName}
                    imageUrl={collab.imageUrl}
                  />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-text-primary">
                      {collab.displayName}
                    </span>
                    {collab.displayName !== collab.email && (
                      <span className="truncate text-xs text-text-muted">
                        {collab.email}
                      </span>
                    )}
                  </div>
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="ml-auto shrink-0 text-text-faint hover:text-state-error"
                      onClick={() => void handleRemove(collab.id)}
                      disabled={removingId === collab.id}
                      aria-label={`Remove ${collab.displayName}`}
                    >
                      <X />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
