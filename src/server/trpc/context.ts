import {CreateExpressContextOptions} from '@trpc/server/adapters/express';

// Тук ще добавим Clerk по-късно за auth
export const createContext = ({req, res}: CreateExpressContextOptions)=>{
  return {req, res}
};

export type Context = Awaited<ReturnType<typeof createContext>>;