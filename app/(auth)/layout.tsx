import { Cpu, Share2, FileCode2 } from "lucide-react"

const features = [
  {
    icon: Cpu,
    iconClass: "text-accent-primary",
    bgClass: "bg-accent-primary-dim",
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas."
  },
  {
    icon: Share2,
    iconClass: "text-state-success",
    bgClass: "bg-state-success-dim",
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team."
  },
  {
    icon: FileCode2,
    iconClass: "text-accent-ai-text",
    bgClass: "bg-accent-ai-dim",
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph."
  }
]

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col bg-bg-surface border-r border-border-default relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-accent-primary-dim blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5 px-12 pt-10">
          <div className="h-6 w-6 rounded-md bg-accent-primary shrink-0 flex items-center justify-center">
            <span className="text-bg-base text-xs font-bold leading-none">
              G
            </span>
          </div>
          <span className="text-text-primary font-semibold text-sm tracking-tight">
            Ghost AI
          </span>
        </div>

        {/* Content — top-aligned with breathing room from logo */}
        <div className="relative z-10 flex flex-col px-12 pt-20 pb-12">
          <h1 className="text-text-primary text-5xl font-bold leading-[1.1] tracking-tight mb-6">
            Design systems
            <br />
            at the speed
            <br />
            of thought.
          </h1>
          <p className="text-text-secondary text-base leading-relaxed mb-14 max-w-sm">
            Describe your architecture in plain English. Ghost AI maps it to a
            shared canvas your whole team can refine in real time.
          </p>

          <ul className="space-y-8">
            {features.map(
              ({ icon: Icon, iconClass, bgClass, title, description }) => (
                <li key={title} className="flex gap-4">
                  <div
                    className={`${bgClass} rounded-lg h-10 w-10 flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <Icon className={`${iconClass} h-4 w-4`} />
                  </div>
                  <div>
                    <p className="text-text-primary text-sm font-medium mb-1">
                      {title}
                    </p>
                    <p className="text-text-muted text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Footer — pushed to bottom */}
        <div className="relative z-10 mt-auto px-12 pb-10">
          <p className="text-text-faint text-xs">
            © 2026 Ghost AI. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center bg-bg-base px-4">
        {children}
      </div>
    </div>
  )
}
