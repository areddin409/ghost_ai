import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Pool } from 'pg'

function makeClient() {
  const url = process.env.DATABASE_URL ?? ''
  if (url.startsWith('prisma+postgres://')) {
    return new PrismaClient({ accelerateUrl: url }).$extends(withAccelerate())
  }
  const adapter = new PrismaPg(new Pool({ connectionString: url }))
  return new PrismaClient({ adapter })
}

type PrismaInstance = ReturnType<typeof makeClient>

const globalForPrisma = globalThis as unknown as { prisma: PrismaInstance | undefined }

export const prisma: PrismaInstance = globalForPrisma.prisma ?? makeClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
