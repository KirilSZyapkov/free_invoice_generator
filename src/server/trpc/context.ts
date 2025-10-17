import {CreateExpressContextOptions} from '@trpc/server/adapters/express';
import {db} from "../prisma";

// Тук ще добавим Clerk по-късно за auth
export const createContext = ({req, res}: CreateExpressContextOptions)=>{
  return {req, res, prisma: db};
};

export type Context = Awaited<ReturnType<typeof createContext>>;