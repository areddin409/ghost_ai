"use client"

import {
  LayoutTemplate,
  Map,
  PanelLeftClose,
  PanelLeftOpen,
  Share2,
  Sparkles
} from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

interface WorkspaceNavbarProps {
  projectName: string
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  isAiOpen: boolean
  onToggleAi: () => void
  onShare: () => void
  isMinimapVisible: boolean
  onToggleMinimap: () => void
  onOpenTemplates: () => void
}

export function WorkspaceNavbar({
  projectName,
  isSidebarOpen,
  onToggleSidebar,
  isAiOpen,
  onToggleAi,
  onShare,
  isMinimapVisible,
  onToggleMinimap,
  onOpenTemplates,
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={onToggleMinimap}
                aria-label={isMinimapVisible ? "Hide minimap" : "Show minimap"}
                aria-pressed={isMinimapVisible}
                className={
                  isMinimapVisible
                    ? "border-accent-violet/50 bg-accent-violet/10 text-accent-violet"
                    : ""
                }
              >
                <Map className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isMinimapVisible ? "Hide minimap" : "Show minimap"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
          aria-label="Share project"
          onClick={onShare}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleAi}
          aria-label={isAiOpen ? "Close AI sidebar" : "Open AI sidebar"}
          aria-pressed={isAiOpen}
          className={
            isAiOpen
              ? "border-accent-ai bg-accent-ai text-white hover:bg-accent-ai/90 hover:text-white"
              : ""
          }
        >
          <Sparkles className="h-4 w-4" />
          AI
        </Button>
        <UserButton />
      </div>
    </nav>
  )
}
