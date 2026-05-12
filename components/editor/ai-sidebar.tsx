import { Bot, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AiSidebarProps {
  isOpen: boolean
}

export function AiSidebar({ isOpen }: AiSidebarProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      inert={!isOpen || undefined}
      className={`fixed right-0 top-14 z-40 flex h-[calc(100vh-3.5rem)] w-80 flex-col border-l border-border-default bg-bg-surface shadow-xl transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-start justify-between border-b border-border-default px-4 py-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold text-text-primary">AI Copilot</h2>
          <p className="text-xs text-text-muted">Placeholder panel</p>
        </div>
        <Button variant="ghost" size="icon-sm" aria-label="AI settings">
          <Settings2 className="h-4 w-4 text-text-muted" />
        </Button>
      </div>

      <div className="flex-1 p-4">
        <div className="rounded-2xl border border-border-default bg-bg-elevated p-4">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-bg-subtle">
              <Bot className="h-4 w-4 text-text-secondary" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium leading-none text-text-primary">
                Chat surface pending
              </p>
              <p className="text-xs leading-relaxed text-text-muted">
                The toggle is wired. Messaging and generation are intentionally
                out of scope here.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 border-t border-border-default p-4">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-faint">
          Future Hooks
        </p>
        <p className="text-xs leading-relaxed text-text-muted">
          Prompt composer, run status, and architecture guidance will attach to
          this sidebar.
        </p>
      </div>
    </aside>
  )
}
