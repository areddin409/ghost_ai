"use client"

import {
  Ellipsis,
  LayoutTemplate,
  PanelLeftClose,
  PanelLeftOpen,
  Save,
  Settings,
  Share2,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  SaveStatusIndicator,
  type SaveStatus
} from "@/components/editor/canvas/save-status-indicator"

interface WorkspaceNavbarProps {
  projectName: string
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  isAiOpen: boolean
  onToggleAi: () => void
  onShare: () => void
  onOpenSettings: () => void
  onOpenTemplates: () => void
  saveStatus?: SaveStatus
  onSave?: () => void
}

export function WorkspaceNavbar({
  projectName,
  isSidebarOpen,
  onToggleSidebar,
  isAiOpen,
  onToggleAi,
  onShare,
  onOpenSettings,
  onOpenTemplates,
  saveStatus = "idle",
  onSave,
}: WorkspaceNavbarProps) {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-14 items-center gap-3 border-b border-border-default bg-bg-surface px-3">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onToggleSidebar}
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isSidebarOpen ? (
          <PanelLeftClose className="h-5 w-5" />
        ) : (
          <PanelLeftOpen className="h-5 w-5" />
        )}
      </Button>

      <div className="flex min-w-0 flex-col justify-center">
        <span className="truncate text-sm font-semibold leading-none text-text-primary">
          {projectName}
        </span>
        <span className="mt-1 text-[11px] leading-none text-text-muted">
          Workspace
        </span>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <SaveStatusIndicator saveStatus={saveStatus} onRetry={onSave} />
        <Button
          variant="outline"
          size="sm"
          aria-label="Open starter templates"
          onClick={onOpenTemplates}
        >
          <LayoutTemplate className="h-4 w-4" />
          Templates
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleAi}
          aria-label={isAiOpen ? "Close AI sidebar" : "Open AI sidebar"}
          aria-pressed={isAiOpen}
          className={
            isAiOpen
              ? "border-accent-ai bg-accent-ai/70 text-white hover:bg-accent-ai/60 hover:text-white"
              : "border-accent-ai bg-accent-ai text-white hover:bg-accent-ai/90 hover:text-white"
          }
        >
          <Sparkles className="h-4 w-4" />
          AI
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon-sm" aria-label="More actions">
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-xl border-border-default"
          >
            <DropdownMenuItem onSelect={onShare}>
              <Share2 />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onOpenSettings}>
              <Settings />
              Settings
            </DropdownMenuItem>
            {onSave && (
              <DropdownMenuItem onSelect={onSave}>
                <Save />
                Save
                <DropdownMenuShortcut>Ctrl+S</DropdownMenuShortcut>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
