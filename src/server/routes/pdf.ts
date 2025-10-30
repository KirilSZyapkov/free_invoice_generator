import express from 'express';
import PDFDocument from 'pdfkit';
import { db } from '../db/prisma';

export const pdfRouter = express.Router();

pdfRouter.get("/:invoiceId", async (req, res) => {
  console.log("✅ PDF Route hit!", req.params);
  res.json({ ok: true, params: req.params });

  const { invoiceId } = req.params;

  try {
    const invoice = await db.invoice.findUnique({
      where: { id: invoiceId }
    });

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    };

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachement; filename=invoice-${invoice.invoiceNumber}.pdf`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);
    doc.fontSize(22).text(`Invoice #${invoice.invoiceNumber}`, { align: "center" }).moveDown();
    doc.fontSize(16).text(`From: ${invoice.from}`).text(`Client: ${invoice.clientName}`).text(`Invoice #: ${invoice.invoiceNumber}`).text(`Date: ${invoice.date.toString()}`).moveDown();

    doc.fontSize(14).text(`Description: ${invoice.description}`, {underline: true}).moveDown();

    const total = (((Number(invoice.rate)*Number(invoice.quantity)) + Number(invoice.shipping || 0))-Number(invoice.discount || 0))*(1+Number(invoice.tax));

    doc
      .fontSize(16)
      .text(`Subtotal: ${Number(invoice.rate) * Number(invoice.quantity)} EUR`)
      .text(`Tax: ${invoice.tax}%`)
      .text(`Total: ${total.toFixed(2)} EUR`)
      .moveDown();

    if(invoice.notes){
      doc.fontSize(13).text(`Notes: ${invoice.notes}`);
    }

    doc.end();
  } catch (error: unknown) {
    console.error("❌ Error generating PDF:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
})
