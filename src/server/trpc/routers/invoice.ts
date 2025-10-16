import { z } from 'zod';
import { router, publicProcedure } from '../router';

export const invoiceRouter = router({
  getAllInvoicesForUser: publicProcedure.query(async () => {
    return [
      { id: 1, customer: "Иван Иванов", total: 120.5 },
      { id: 2, customer: "Петър Петров", total: 80.0 },
    ]
  }),
  createNewInvoice: publicProcedure
    .input(
      z.object({
        customer: z.string().min(1),
        total: z.number().min(1),
      })
    )
    .mutation(async ({ input }) => {
      // Тук после ще запишем в MongoDB чрез Prisma
      console.log("Creating invoice", input);
      return { success: true, data: input };

    }),
});