import { EditorShell } from "@/components/editor/shell/editor-shell"
import { EditorHome } from "@/components/editor/shell/editor-home"
import { getProjectsForUser } from "@/lib/projects"

export default async function EditorPage() {
  const { owned, shared } = await getProjectsForUser()

  return (
    <EditorShell initialOwned={owned} initialShared={shared}>
      <EditorHome />
    </EditorShell>
  )
}
