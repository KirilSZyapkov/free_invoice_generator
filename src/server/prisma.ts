import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
};

if(!global.__prisma){
  try {
    prisma = new PrismaClient({log:["query", "error", "warn"]});
    global.__prisma = prisma;
  } catch (error) {
    console.error("❌ Prisma initialization error:", error);
    
  }
}

export const db = global.__prisma!;