import { PrismaPg } from "@prisma/adapter-pg";
import { attachDatabasePool } from "@vercel/functions";
import { Pool } from "pg";

import { PrismaClient } from "@/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

attachDatabasePool(pool);

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter: new PrismaPg(pool) });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const db = prisma;
