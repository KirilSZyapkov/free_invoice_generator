import { generateInvoicePDF } from "./generateInvoicePDF";
import { Invoice } from "@prisma/client";

export const generatePdfBuffer = async (invoice: Partial<Invoice>) => {
  const pdfDoc = await generateInvoicePDF(invoice);
  const chunks: Uint8Array[] = [];
  const pdfBuffer = new Promise<Buffer>((resolve, reject) => {
    pdfDoc.on("data", (chunk) => {
      chunks.push(chunk);
    });
    pdfDoc.on("end", () => {
      const newPdfBuffer = Buffer.concat(chunks);
      resolve(newPdfBuffer);
    });
    pdfDoc.on("error", (err: unknown) => {
      reject(err);
    });

  });

  return pdfBuffer;
}