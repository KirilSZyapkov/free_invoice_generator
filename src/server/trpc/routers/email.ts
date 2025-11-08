import { router, publicProcedure } from '../router';
import { sendInvoiceEmail } from "../../utils/mail";
import { z } from "zod";

export const emailRouter = router({
  sendImails: publicProcedure
    .input(z.object({
      to: z.string().min(1),
      pdfBuffer: Buffer,
      invoiceNumber: z.string().min(1)
    }))
    .query(async ({ ctx, input }) => {
      const to: string = input.to;
      const pdfBuffer: Buffer[] = input.pdfBuffer;
      const invoiceNumber: string = input.invoiceNumber;

      try {
        await sendInvoiceEmail(to, pdfBuffer, invoiceNumber)
        return { uccess: true }
      } catch (e) {
        console.error("❌ Email error:", e);
        throw new Error("Failed to send the email");
      }

    })
})