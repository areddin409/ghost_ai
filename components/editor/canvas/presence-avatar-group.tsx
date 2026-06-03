"use client"

import { useOthers } from "@liveblocks/react"
import { UserButton, useUser } from "@clerk/nextjs"

function CollaboratorAvatar({ name, avatar, color }: { name: string; avatar: string; color: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className="relative h-7 w-7 shrink-0 select-none overflow-hidden rounded-full ring-2 ring-bg-base"
      title={name}
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
  )
}

export function PresenceAvatarGroup() {
  const { user } = useUser()
  const currentUserId = user?.id ?? null

  const collaborators = useOthers((others) =>
    others
      .filter((o) => o.id !== currentUserId)
      .map((o) => ({
        connectionId: o.connectionId,
        name: o.info?.name ?? "Collaborator",
        avatar: o.info?.avatar ?? "",
        color: o.info?.color ?? "#7c6ef9",
      }))
  )

  const visible = collaborators.slice(0, 5)
  const overflow = collaborators.length - visible.length
  const hasCollaborators = collaborators.length > 0

  return (
    <div className="flex items-center gap-2">
      {hasCollaborators && (
        <>
          <div className="flex items-center -space-x-2">
            {visible.map((c) => (
              <CollaboratorAvatar
                key={c.connectionId}
                name={c.name}
                avatar={c.avatar}
                color={c.color}
              />
            ))}
            {overflow > 0 && (
              <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg-elevated ring-2 ring-bg-base">
                <span className="text-[10px] font-semibold text-text-muted">
                  +{overflow}
                </span>
              </div>
            )}
          </div>
          <div className="h-5 w-px bg-border-default" aria-hidden="true" />
        </>
      )}
      <div className="h-7 w-7">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-7 w-7",
            },
          }}
        />
      </div>
    </div>
  )
}
