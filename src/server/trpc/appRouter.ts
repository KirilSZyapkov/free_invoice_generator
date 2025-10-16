import {router} from "./router";
import { invoiceRouter } from "./routers/invoice";

export const appRouter = router({
  invoice: invoiceRouter,
});

export type AppRouter = typeof appRouter;