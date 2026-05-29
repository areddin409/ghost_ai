import { currentUser } from "@clerk/nextjs/server";
import { liveblocks, userIdToColor } from "@/lib/liveblocks";
import {
  getCurrentIdentity,
  getProjectWithAccess,
} from "@/lib/project-access";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const room = (body as Record<string, unknown>).room;

  if (typeof room !== "string" || room.trim().length === 0) {
    return new Response("Missing or invalid room", { status: 400 });
  }

  const identity = await getCurrentIdentity();
  if (!identity) {
    return new Response("Unauthorized", { status: 401 });
  }

  const project = await getProjectWithAccess(room, identity);
  if (!project) {
    return new Response("Forbidden", { status: 403 });
  }

  await liveblocks.getOrCreateRoom(room, { defaultAccesses: [] });

  const user = await currentUser();
  const name =
    user?.fullName ?? user?.firstName ?? identity.email ?? "Unknown";
  const avatar = user?.imageUrl ?? "";
  const color = userIdToColor(identity.userId);

  const session = liveblocks.prepareSession(identity.userId, {
    userInfo: { name, avatar, color },
  });
  session.allow(room, session.FULL_ACCESS);

  const { status, body: sessionBody } = await session.authorize();
  return new Response(sessionBody, { status });
}
