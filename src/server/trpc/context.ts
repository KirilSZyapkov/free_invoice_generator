import {CreateExpressContextOptions} from '@trpc/server/adapters/express';
import {prisma} from "../prisma";

// Тук ще добавим Clerk по-късно за auth
export const createContext = ({req, res}: CreateExpressContextOptions)=>{
  return {req, res, prisma}
};

export type Context = Awaited<ReturnType<typeof createContext>>;