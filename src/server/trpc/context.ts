import {CreateExpressContextOptions} from '@trpc/server/adapters/express';
import {db} from "../db/prisma";
import {getAuth} from "@clerk/express";


// Тук ще добавим Clerk по-късно за (auth)
export const createContext = ({req, res}: CreateExpressContextOptions)=>{
  const auth = getAuth(req);
  const userId = auth.userId;
  return {req, res, prisma: db, userId};
};

export type Context = Awaited<ReturnType<typeof createContext>>;