import Link from "next/link"
import { Lock } from "lucide-react"

export function AccessDenied() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-bg-base">
      <Lock className="h-8 w-8 text-text-muted" />
      <p className="text-sm text-text-secondary">
        You don&apos;t have access to this project.
      </p>
      <Link
        href="/editor"
        className="text-sm text-accent-primary hover:underline"
      >
        Back to projects
      </Link>
    </div>
  )
}
