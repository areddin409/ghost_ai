"use client"

import { AlertTriangle, Check, Loader2 } from "lucide-react"

export type SaveStatus = "idle" | "saving" | "saved" | "error"

interface SaveStatusIndicatorProps {
  saveStatus: SaveStatus
}

export function SaveStatusIndicator({ saveStatus }: SaveStatusIndicatorProps) {
  if (saveStatus === "idle") return null

  if (saveStatus === "saving") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-border-default bg-bg-surface px-2 py-1 text-xs text-text-muted">
        <Loader2 className="h-3 w-3 animate-spin" />
        Saving…
      </span>
    )
  }

  if (saveStatus === "saved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-border-default bg-bg-surface px-2 py-1 text-xs text-text-muted">
        <Check className="h-3 w-3" />
        Saved
      </span>
    )
  }

  // error
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-state-error/40 bg-bg-surface px-2 py-1 text-xs text-state-error">
      <AlertTriangle className="h-3 w-3" />
      Error
    </span>
  )
}
