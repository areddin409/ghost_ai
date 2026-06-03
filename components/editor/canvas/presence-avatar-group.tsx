"use client"

import { useOthers, useSelf } from "@liveblocks/react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function PresenceAvatar({ name, avatar, color }: { name: string; avatar: string; color: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="relative h-7 w-7 shrink-0 select-none overflow-hidden rounded-full ring-2 ring-bg-base"
          style={{ backgroundColor: color }}
        >
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt={name} className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-white">
              {initials}
            </span>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">{name}</TooltipContent>
    </Tooltip>
  )
}

export function PresenceAvatarGroup() {
  const self = useSelf()
  const others = useOthers((others) =>
    others.map((o) => ({
      connectionId: o.connectionId,
      name: o.info?.name ?? "Collaborator",
      avatar: o.info?.avatar ?? "",
      color: o.info?.color ?? "#7c6ef9",
    }))
  )

  if (others.length === 0) return null

  const all = [
    {
      key: "self",
      name: self?.info?.name ?? "You",
      avatar: self?.info?.avatar ?? "",
      color: self?.info?.color ?? "#7c6ef9",
    },
    ...others.map((o) => ({ key: String(o.connectionId), ...o })),
  ]

  const visible = all.slice(0, 5)
  const overflow = all.length - visible.length

  return (
    <TooltipProvider>
      <div className="flex items-center -space-x-2">
        {visible.map((u) => (
          <PresenceAvatar key={u.key} name={u.name} avatar={u.avatar} color={u.color} />
        ))}
        {overflow > 0 && (
          <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg-elevated ring-2 ring-bg-base">
            <span className="text-[10px] font-semibold text-text-muted">+{overflow}</span>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
