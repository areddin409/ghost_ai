import { redirect } from "next/navigation"
import { getCurrentIdentity, getProjectWithAccess } from "@/lib/project-access"
import { getProjectsForUser } from "@/lib/projects"
import { getUserSettings } from "@/lib/user-settings"
import { AccessDenied } from "@/components/editor/access-denied"
import { WorkspaceShell } from "@/components/editor/shell/workspace-shell"

interface EditorRoomPageProps {
  params: Promise<{ roomId: string }>
}

export default async function EditorRoomPage({ params }: EditorRoomPageProps) {
  const { roomId } = await params

  const identity = await getCurrentIdentity()
  if (!identity) redirect("/sign-in")

  const [project, { owned, shared }, settings] = await Promise.all([
    getProjectWithAccess(roomId, identity),
    getProjectsForUser(),
    getUserSettings(identity.userId),
  ])

  if (!project) return <AccessDenied />

  const isOwner = project.ownerId === identity.userId

  return (
    <WorkspaceShell
      project={project}
      initialOwned={owned}
      initialShared={shared}
      isOwner={isOwner}
      initialSettings={settings}
    />
  )
}
