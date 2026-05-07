import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { withAccelerate } from "@prisma/extension-accelerate"
import { Pool } from "pg"

/** Normalize deprecated sslmode aliases to avoid pg-connection-string warnings. */
function normalizeDbUrl(url: string): string {
  return url.replace(
    /sslmode=(require|prefer|verify-ca)/g,
    "sslmode=verify-full"
  )
}

function makeClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? ""
  if (url.startsWith("prisma+postgres://")) {
    return new PrismaClient({ accelerateUrl: url }).$extends(
      withAccelerate()
    ) as unknown as PrismaClient
  }
  const adapter = new PrismaPg(new Pool({ connectionString: normalizeDbUrl(url) }))
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? makeClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
