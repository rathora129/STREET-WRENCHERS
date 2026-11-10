import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

// Reuse the client across hot reloads (dev) and lambda invocations (production).
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
