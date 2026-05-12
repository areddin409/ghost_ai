"use client"

import * as React from "react"
import { Link2, Check, Mail, UserPlus, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Collaborator {
  id: string
  email: string
  displayName: string
  imageUrl: string | null
}

interface OwnerInfo {
  displayName: string
  imageUrl: string | null
  email: string
}

interface CollaboratorsResponse {
  owner: OwnerInfo
  collaborators: Collaborator[]
}

interface ShareDialogProps {
  projectId: string
  projectName: string
  isOwner: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

function PersonAvatar({
  displayName,
  imageUrl
}: {
  displayName: string
  imageUrl: string | null
}) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-subtle">
      {imageUrl ? (
        <img src={imageUrl} alt={displayName} className="h-full w-full object-cover" />
      ) : (
        <span className="text-sm font-semibold text-text-secondary">
          {displayName.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  )
}

export function ShareDialog({
  projectId,
  isOwner,
  open,
  onOpenChange
}: ShareDialogProps) {
  const [ownerInfo, setOwnerInfo] = React.useState<OwnerInfo | null>(null)
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
        .then((data: CollaboratorsResponse) => {
          setOwnerInfo(data.owner)
          setCollaborators(data.collaborators)
        })
        .catch(() => {
          setOwnerInfo(null)
          setCollaborators([])
        })
        .finally(() => setLoading(false))
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
        body: JSON.stringify({ email })
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

  const totalCount = (ownerInfo ? 1 : 0) + collaborators.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share project</DialogTitle>
          <DialogDescription>
            Invite collaborators, copy the workspace link, and manage access.
          </DialogDescription>
        </DialogHeader>

        {/* Workspace link card */}
        <div className="flex items-center gap-3 rounded-xl bg-bg-subtle p-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-text-primary">Workspace link</p>
            <p className="text-xs text-text-muted">
              Share a direct link with teammates after you grant them access.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void handleCopyLink()}
            className="shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4 text-state-success" />
            ) : (
              <Link2 className="h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy link"}
          </Button>
        </div>

        {/* Invite row — owner only */}
        {isOwner && (
          <div className="space-y-1.5">
            <div className="flex min-w-0 gap-2">
              <div className="relative min-w-0 flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <Input
                  type="email"
                  placeholder="teammate@company.com"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value)
                    setInviteError(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !inviting) void handleInvite()
                  }}
                  disabled={inviting}
                  className="pl-9"
                />
              </div>
              <Button
                onClick={() => void handleInvite()}
                disabled={!inviteEmail.trim() || inviting}
                size="sm"
                className="shrink-0"
              >
                <UserPlus className="h-4 w-4" />
                {inviting ? "Inviting…" : "Invite"}
              </Button>
            </div>
            {inviteError && (
              <p className="text-xs text-state-error">{inviteError}</p>
            )}
          </div>
        )}

        {/* People with access */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text-primary">
              People with access
            </p>
            {!loading && totalCount > 0 && (
              <span className="text-xs text-text-muted">{totalCount} total</span>
            )}
          </div>

          {loading ? (
            <p className="py-3 text-center text-xs text-text-faint">Loading…</p>
          ) : (
            <ul className="max-h-52 space-y-1.5 overflow-y-auto">
              {ownerInfo && (
                <li className="flex items-center gap-3 rounded-xl bg-bg-subtle px-3 py-2.5">
                  <PersonAvatar
                    displayName={ownerInfo.displayName}
                    imageUrl={ownerInfo.imageUrl}
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium text-text-primary">
                      {ownerInfo.displayName}
                    </span>
                    {ownerInfo.email && (
                      <span className="truncate text-xs text-text-muted">
                        {ownerInfo.email}
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 rounded-md bg-accent-primary-dim px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent-primary">
                    Owner
                  </span>
                </li>
              )}

              {collaborators.map((collab) => (
                <li
                  key={collab.id}
                  className="flex items-center gap-3 rounded-xl bg-bg-subtle px-3 py-2.5"
                >
                  <PersonAvatar
                    displayName={collab.displayName}
                    imageUrl={collab.imageUrl}
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium text-text-primary">
                      {collab.displayName}
                    </span>
                    {collab.displayName !== collab.email && (
                      <span className="truncate text-xs text-text-muted">
                        {collab.email}
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 rounded-md border border-border-subtle px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    Collaborator
                  </span>
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="shrink-0 text-text-faint hover:text-state-error"
                      onClick={() => void handleRemove(collab.id)}
                      disabled={removingId === collab.id}
                      aria-label={`Remove ${collab.displayName}`}
                    >
                      <Trash2 className="h-4 w-4" />
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
