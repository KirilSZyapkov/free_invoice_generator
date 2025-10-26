import {router} from "./router";
import { invoiceRouter } from "./routers/invoice";
import {userRouter} from "./routers/user";

export const appRouter = router({
  invoice: invoiceRouter,
  user: userRouter
});

export type AppRouter = typeof appRouter;