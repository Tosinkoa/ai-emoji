import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import "server-only"

// Optimize Prisma client to reduce bundle size
const prismaClientSingleton = () => {
  // Use minimal log settings to reduce size
  return new PrismaClient({
    log: ["error"],
  }).$extends(withAccelerate())
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

// Optimize client initialization
const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

// Only store the client in development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export { prisma }
