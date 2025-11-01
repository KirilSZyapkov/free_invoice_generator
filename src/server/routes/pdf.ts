import express from 'express';
import { db } from '../db/prisma';
import { generateInvoicePDF } from "../utils/generateInvoicePDF";

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
})
