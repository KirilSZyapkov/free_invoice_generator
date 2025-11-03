import { router, publicProcedure } from '../router';
import {invoiceType} from "@/types/invoice";
import { generateInvoicePDF} from "../../utils/generateInvoicePDF";
import { sendInvoiceEmail} from "../../utils/mail";


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

      try {
        const createdInvoice = await ctx.prisma.invoice.create({
          data:{
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
        const pdfDoc = await generateInvoicePDF(createdInvoice);
        const chunks: Uint8Array[] =[];
        let pdfBuffer: =[];
        pdfDoc.on("data", (chunk)=> chunks.push(chunk));
        pdfDoc.on("end", ()=>{
          pdfBuffer = Buffer.concat(chunks);

          console.log("server/trpc/routs/invoice",pdfBuffer);
        })
        return { success: true, createdInvoice };
      } catch (e) {
        console.error("❌ Prisma error:", e);
        throw new Error("Failed to create invoice");
      }



    }),
});