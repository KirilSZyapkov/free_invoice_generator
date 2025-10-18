import { router, publicProcedure } from '../router';
import {invoiceType} from "@/types/invoice";

export const invoiceRouter = router({
  getAllInvoicesForUser: publicProcedure.query(async ({ctx}) => {
    return [
      { id: 1, customer: 'Customer A'},
      { id: 2, customer: 'Customer B'}
    ]
    // await ctx.prisma.invoice.findById(1); // Тук после ще вземем userId от сесията
  }),
  createNewInvoice: publicProcedure
    .input(invoiceType)
    .mutation(async ({ ctx,input }) => {
      const createdInvoice = await ctx.prisma.create({
        data:{
          userId: "test user",
          from: input.from,
          invoiceNumber: input.invoiceNumber,
          clientName: input.clientName,
          date: input.date,
          paymentTerms: input.paymentTerms,
          dueDate: input.dueDate,
          PoNumber: input.PoNumber,
          description: input.description,
          quantity: input.quantity,
          rate: input.rate,
          notes: input.notes,
          discount: input.discount,
          tax: input.tax,
          shipping: input.shipping,
          terms: input.terms
        }
      })
      console.log("Creating invoice", input);
      return { success: true, createdInvoice };

    }),
});