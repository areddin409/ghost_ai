// Define Liveblocks types for your application

import type { LiveblocksFlow } from "@liveblocks/react-flow"
import type { CanvasEdge, CanvasNode } from "./types/canvas"

// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      cursor: { x: number; y: number } | null
      isThinking: boolean
    }

    // The Storage tree for the room, for useMutation, useStorage, etc.
    // useLiveblocksFlow stores under the "flow" key as a nested LiveObject.
    Storage: {
      flow: LiveblocksFlow<CanvasNode, CanvasEdge>
    }

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string
      info: {
        name: string
        avatar: string
        color: string
      }
    }

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: {}

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: {}

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {}
  }
}

export {}
