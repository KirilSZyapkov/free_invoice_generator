import { router, publicProcedure } from '../router';
import { sendInvoiceEmail } from "../../utils/mail";
import { z } from "zod";

export const emailRouter = router({
  sendImails: publicProcedure
    .input(z.object({
      to: z.string().min(1),
      pdfBase64: z.string().min(1),
      invoiceNumber: z.string().min(1)
    }))
    .mutation(async ({ ctx, input }) => {
      const { to, pdfBase64, invoiceNumber } = input;

      try {
        await sendInvoiceEmail(to, pdfBase64, invoiceNumber)
        return { uccess: true }
      } catch (e) {
        console.error("❌ Email error:", e);
        throw new Error("Failed to send the email");
      }

    })
})