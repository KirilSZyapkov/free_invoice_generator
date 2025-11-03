import {router} from "./router";
import {invoiceRouter} from "./routers/invoice";
import {userRouter} from "./routers/user";
import {emailRouter} from "./routers/email";

export const appRouter = router({
  invoice: invoiceRouter,
  user: userRouter,
  email: emailRouter
});

export type AppRouter = typeof appRouter;