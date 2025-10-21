import {CreateExpressContextOptions} from '@trpc/server/adapters/express';
import {db} from "../prisma";
import {getAuth} from "@clerk/express";


// Тук ще добавим Clerk по-късно за auth
export const createContext = ({req, res}: CreateExpressContextOptions)=>{
  const auth = getAuth(req);
  const userId = auth.userId ?? null;
  return {req, res, prisma: db, userId};
};

export type Context = Awaited<ReturnType<typeof createContext>>;