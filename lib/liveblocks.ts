import { Liveblocks } from "@liveblocks/node";

const CURSOR_COLORS = [
  "#7C6EF9",
  "#00C8D4",
  "#F97316",
  "#22C55E",
  "#EF4444",
  "#F59E0B",
  "#EC4899",
  "#3B82F6",
  "#8B5CF6",
  "#14B8A6",
];

export function userIdToColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length];
}

const globalForLiveblocks = globalThis as unknown as {
  liveblocks: Liveblocks | undefined;
};

function makeLiveblocksClient(): Liveblocks {
  return new Liveblocks({ secret: process.env.LIVEBLOCKS_SECRET_KEY! });
}

export const liveblocks: Liveblocks =
  globalForLiveblocks.liveblocks ?? makeLiveblocksClient();

if (process.env.NODE_ENV !== "production") {
  globalForLiveblocks.liveblocks = liveblocks;
}
