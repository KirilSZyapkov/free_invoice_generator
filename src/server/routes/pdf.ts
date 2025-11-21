// Downloaded invoice PDF route

import express from 'express';
import { db } from '../db/prisma';
import { generateInvoicePDF } from "../utils/generateInvoicePDF";
import { generatePdfBuffer } from '../utils/pdfBuffer';

export const pdfRouter = express.Router();

pdfRouter.get("/:invoiceId", async (req, res) => {

  const { invoiceId } = req.params;

  try {
    const invoice = await db.invoice.findUnique({
      where: { id: invoiceId }
    });

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    };


    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);
    const doc = await generateInvoicePDF(invoice);

    doc.pipe(res);
  
  } catch (error: unknown) {
    console.error("❌ Error generating PDF:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Failed to generate PDF" });
    }
  }
});


pdfRouter.post("/generate", async (req, res) => {
  try {
    const localInvoice = req.body.invoiceData; // очакваме клиент да прати invoice JSON
    console.log("server/routes/pdf 42", localInvoice);
    // генерираме Buffer
    const buffer = await generatePdfBuffer(localInvoice); // ensure this is server-side function
    const base64 = buffer.toString("base64");
    res.status(200).json({ base64 });
  } catch (err) {
    console.error("❌ Express PDF error:", err);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
});
