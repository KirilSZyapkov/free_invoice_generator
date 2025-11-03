import { router, publicProcedure } from '../router';
import { sendInvoiceEmail} from "../../utils/mail";

export const emailRouter = router({
  sendImails: publicProcedure.query(async ({ctx, input})=>{
    const to = input.to;
    const pdfBuffer = input.pdfBuffer;
    const invoiceNumber = input.invoiceNumber;


  })
})