
// https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7

import { PrismaClient } from '../../generated/prisma/index.js';
import { Pool }         from 'pg';
import { PrismaPg }     from '@prisma/adapter-pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Neon
});

const adapter = new PrismaPg(pool);

// Singleton pattern — prevents multiple Prisma (hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']  // log queries in dev
      : ['error'],                  // only errors in prod
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}