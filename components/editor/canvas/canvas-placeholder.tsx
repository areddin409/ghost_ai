import { Compass } from "lucide-react"

export function CanvasPlaceholder() {
  return (
    <main
      className="relative flex h-full flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(0,200,212,0.07) 0%, var(--bg-base) 65%)"
      }}
    >
      <div className="flex max-w-md flex-col items-center gap-7 px-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-accent-primary/25 bg-accent-primary-dim">
          <Compass className="h-7 w-7 text-accent-primary" />
        </div>

        <div className="flex flex-col items-center gap-4">
          <span className="font-mono text-[11px] tracking-[0.22em] text-text-faint uppercase">
            Workspace Shell
          </span>
          <h2 className="text-[2rem] font-semibold leading-tight text-text-primary">
            Canvas and collaboration tooling land here next.
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            This room is ready for the shared architecture canvas, durable AI
            workflows, and real-time presence. For now, the shell is wired with
            project context and navigation only.
          </p>
        </div>
      </div>
    </main>
  )
}
