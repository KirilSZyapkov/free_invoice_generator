import PDFDocument from "pdfkit";
import { Invoice } from "@prisma/client"; // ако имаш тип от Prisma

export async function generateInvoicePDF(invoice: Invoice) {
  const doc = new PDFDocument({ margin: 50 });

  // --- HEADER ---
  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .text(`INVOICE #${invoice.invoiceNumber}`, { align: "right" })
    .moveDown();

  // --- FROM / TO info ---
  doc
    .font("Helvetica")
    .fontSize(12)
    .text("From:", { underline: true })
    .text(invoice.from)
    .moveDown();

  doc.text("Bill To:", { underline: true }).text(invoice.clientName).moveDown();

  // --- INVOICE DETAILS ---
  doc
    .font("Helvetica")
    .fontSize(12)
    .text(`Date: ${invoice.date}`)
    .text(`Due Date: ${invoice.dueDate}`)
    .text(`Payment Terms: ${invoice.paymentTerms}`)
    .moveDown();

  // --- TABLE HEADER ---
  const tableTop = doc.y + 10;
  const itemSpacing = 20;

  doc
    .font("Helvetica-Bold")
    .text("Description", 50, tableTop)
    .text("Qty", 300, tableTop)
    .text("Rate", 350, tableTop)
    .text("Total", 420, tableTop);

  // --- TABLE CONTENT ---
  doc
    .moveTo(50, tableTop + 15)
    .lineTo(550, tableTop + 15)
    .stroke();

  doc
    .font("Helvetica")
    .fontSize(12)
    .text(invoice.description, 50, tableTop + itemSpacing)
    .text(invoice.quantity.toString(), 300, tableTop + itemSpacing)
    .text(Number(invoice.rate).toFixed(2), 350, tableTop + itemSpacing)
    .text((Number(invoice.quantity) * Number(invoice.rate)).toFixed(2), 420, tableTop + itemSpacing);

  // --- TOTALS ---
  const subtotal = Number(invoice.quantity) * Number(invoice.rate);
  const tax = Number(invoice.tax) ?? 0;
  const discount = Number(invoice.discount) ?? 0;
  const shipping = Number(invoice.shipping) ?? 0;
  const total = subtotal + tax + shipping - discount;

  doc
    .moveDown(4)
    .font("Helvetica-Bold")
    .text(`Subtotal: ${subtotal.toFixed(2)}`, { align: "right" })
    .text(`Tax: ${tax.toFixed(2)}`, { align: "right" })
    .text(`Discount: ${discount.toFixed(2)}`, { align: "right" })
    .text(`Shipping: ${shipping.toFixed(2)}`, { align: "right" })
    .text(`Total: ${total.toFixed(2)}`, { align: "right" })
    .moveDown(2);

  // --- NOTES & TERMS ---
  if (invoice.notes) {
    doc
      .font("Helvetica")
      .fontSize(10)
      .text("Notes:", { underline: true })
      .text(invoice.notes)
      .moveDown();
  }

  if (invoice.terms) {
    doc.font("Helvetica").fontSize(10).text("Terms:", { underline: true }).text(invoice.terms);
  }

  // --- FOOTER ---
  doc
    .moveDown(2)
    .fontSize(10)
    .fillColor("gray")
    .text("Generated automatically — Free Invoice Generator (Beta)", {
      align: "center",
    });

  doc.end();

  return doc;
}
