import { z } from 'zod';
import { router, publicProcedure } from '../router';

export const invoiceRouter = router({
  getAllInvoicesForUser: publicProcedure.query(async ({ctx}) => {
    return [
      { id: 1, customer: 'Customer A'},
      { id: 2, customer: 'Customer B'}
    ]
    // await ctx.prisma.invoice.findById(1); // Тук после ще вземем userId от сесията
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