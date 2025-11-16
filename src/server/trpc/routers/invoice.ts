import { router, publicProcedure } from '../router';
import { invoiceType } from "@/types/invoice";
import { z } from 'zod';

export const invoiceRouter = router({
  getAllInvoicesForUser: publicProcedure.query(async ({ ctx }) => {
  const curUserId = ctx.userId;
  if(!curUserId) return null;
  try{
    const userAllInvoices = await ctx.prisma.invoice.findMany({
      where: {userId: curUserId}
    });

    return {userAllInvoices};
  } catch (e: unknown) {
    console.error("Prisma error", e);
    if(e instanceof Error) {
      throw new Error(`Failed to load user: ${e.message}`)
    }
  }
    // await ctx.prisma.invoice.findById(1); // Тук после ще вземем userId от сесията
  }),
  createNewInvoice: publicProcedure
    .input(invoiceType)
    .mutation(async ({ ctx, input }) => {

      try {
        const createdInvoice = await ctx.prisma.invoice.create({
          data: {
            userId: input.userId,
            from: input.from,
            invoiceNumber: input.invoiceNumber,
            clientName: input.clientName,
            date: input.date,
            paymentTerms: input.paymentTerms,
            dueDate: input.dueDate,
            poNumber: input.poNumber,
            description: input.description,
            quantity: input.quantity,
            rate: input.rate,
            notes: input.notes,
            discount: input.discount,
            tax: input.tax,
            shipping: input.shipping,
            terms: input.terms
          }
        });
        
        return { success: true, createdInvoice };
      } catch (e) {
        console.error("❌ Prisma error:", e);
        throw new Error("Failed to create invoice");
      }
    }),
  getInvoiceById: publicProcedure
    .input(z.object({ id: z.string().min(1, "Invoice Id is required") }))
    .query(async ({ ctx, input }) => {
      const id: string = input.id;
      try {
        const invoiceById = await ctx.prisma.invoice.findFirst({ 
          where: {id: id}
         });
        return { succes: true, invoiceById };
      } catch (e) {
        console.error("❌ Prisma error:", e);
        throw new Error(`Failed to find invoice ${id}`);
      }
    })
});