import { prisma } from "@/lib/prisma"
import type { UserSettings } from "@/app/generated/prisma/client"

export async function getUserSettings(userId: string): Promise<UserSettings> {
  return prisma.userSettings.upsert({
    where: { userId },
    update: {},
    create: { userId },
  })
}
