import {router, publicProcedure} from '../router';
import {sendInvoiceEmail} from "../../utils/mail";

export const emailRouter = router({
  sendImails: publicProcedure.query(async ({ctx, input}) => {
    const to: string = input.to;
    const pdfBuffer: Buffer[] = input.pdfBuffer;
    const invoiceNumber: string = input.invoiceNumber;

    try {
      await sendInvoiceEmail(to, pdfBuffer, invoiceNumber)
      return {uccess: true}
    } catch (e) {
      console.error("❌ Email error:", e);
      throw new Error("Failed to send the email");
    }

  })
})