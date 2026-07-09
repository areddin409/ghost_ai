"use client"

import { AlertTriangle, Check, Loader2 } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type SaveStatus = "idle" | "saving" | "saved" | "error"

interface SaveStatusIndicatorProps {
  saveStatus: SaveStatus
  onRetry?: () => void
}

export function SaveStatusIndicator({
  saveStatus,
  onRetry,
}: SaveStatusIndicatorProps) {
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

  // error — clickable retry when a handler is provided
  const errorChip = (
    <span className="inline-flex items-center gap-1 rounded-full border border-state-error/40 bg-bg-surface px-2 py-1 text-xs text-state-error">
      <AlertTriangle className="h-3 w-3" />
      Error
    </span>
  )

  if (!onRetry) return errorChip

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onRetry}
            aria-label="Retry save"
            className="inline-flex items-center gap-1 rounded-full border border-state-error/40 bg-bg-surface px-2 py-1 text-xs text-state-error transition-colors hover:border-state-error hover:bg-bg-elevated"
          >
            <AlertTriangle className="h-3 w-3" />
            Error
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Retry save</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
