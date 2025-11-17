import PDFDocument from "pdfkit";
import { Invoice } from "@prisma/client";
import path from "path";
import fs from "fs";

export async function generateInvoicePDF(invoice: Partial<Invoice>) {
  const colors = {
    primary: '#2563eb',
    text: '#000000',
    subtext: '#444444',
    border: '#e5e7eb',
    lightGray: '#f5f5f5',
  };
  const doc = new PDFDocument({size: "A4", margin: 50 });

  const normalFont = path.resolve("src/assets/OpenSans-Regular.ttf");
  const boldFont = path.resolve("src/assets/OpenSans-Bold.ttf");

  if(!fs.existsSync(normalFont) || !fs.existsSync(boldFont)){
    throw new Error("Font files missing");
  }

  doc.registerFont("Normal", normalFont);
  doc.registerFont("Bold", boldFont);

  const fonts = {
    normal: "Normal",
    bold: "Bold",
  };

  // --- HEADER BAR ---
  doc.save();
  doc.rect(0, 0, doc.page.width, 20).fill(colors.primary);
  doc.restore(); // ⬅️ връща нормален контекст (иначе всичко остава синьо)

  doc.moveDown(2);
  doc.font(fonts.bold)
    .fontSize(22)
    .fillColor(colors.primary)
    .text("INVOICE", { align: "right" })
    .fillColor(colors.subtext)
    .fontSize(12)
    .text(`#${invoice.invoiceNumber}`, { align: "right" })
    .moveDown(2);

  // --- FROM / BILL TO ---
  const startY = doc.y;

  doc.font(fonts.bold).fillColor(colors.text).text("FROM:");
  doc.font(fonts.normal).text(invoice.from || "-");

  doc.x = 300;
  doc.y = startY;
  doc.font(fonts.bold).text("BILL TO:");
  doc.font(fonts.normal).text(invoice.clientName || "-");

  doc.x = 50;
  doc.moveDown(1.5);

  // --- INVOICE DETAILS ---
  const infoY = doc.y;
  doc.font(fonts.normal).fontSize(10).fillColor(colors.subtext);
  doc.text(`Date Issued: ${invoice.date || "-"}`);
  doc.text(`Due Date: ${invoice.dueDate || "-"}`);

  doc.x = 300;
  doc.y = infoY;
  doc.text(`Payment Terms: ${invoice.paymentTerms || "-"}`);
  doc.moveDown(2);

  // --- TABLE HEADER ---
  const tableTop = doc.y;
  doc.save();
  doc.rect(50, tableTop, 500, 20).fill(colors.lightGray);
  doc.restore();

  doc.font(fonts.bold)
    .fillColor(colors.text)
    .text("Description", 60, tableTop + 5)
    .text("Qty", 350, tableTop + 5)
    .text("Rate", 400, tableTop + 5)
    .text("Amount", 470, tableTop + 5);

  // --- TABLE ROW ---
  const rowY = tableTop + 25;
  doc.font(fonts.normal)
    .fillColor(colors.text)
    .text(invoice.description || "-", 60, rowY)
    .text(invoice.quantity?.toString() || "0", 350, rowY)
    .text(Number(invoice.rate).toFixed(2), 400, rowY)
    .text((Number(invoice.quantity) * Number(invoice.rate)).toFixed(2), 470, rowY);

  // --- TOTALS ---
  const subtotal = Number(invoice.quantity) * Number(invoice.rate);
  const tax = Number(invoice.tax || 0);
  const discount = Number(invoice.discount || 0);
  const shipping = Number(invoice.shipping || 0);
  const total = subtotal + tax + shipping - discount;

  const totalsY = doc.y + 40;
  doc.font(fonts.normal).fontSize(10).fillColor(colors.text);
  doc.text("Subtotal:", 360, totalsY);
  doc.text("Tax:", 360, totalsY + 15);
  doc.text("Shipping:", 360, totalsY + 30);
  doc.text("Discount:", 360, totalsY + 45);

  doc.font(fonts.bold);
  doc.text(`$${subtotal.toFixed(2)}`, 470, totalsY, { align: "right" });
  doc.text(`$${tax.toFixed(2)}`, 470, totalsY + 15, { align: "right" });
  doc.text(`$${shipping.toFixed(2)}`, 470, totalsY + 30, { align: "right" });
  doc.text(`$${discount.toFixed(2)}`, 470, totalsY + 45, { align: "right" });

  // Highlight total
  doc.save();
  doc.rect(350, totalsY + 70, 300, 25).fill(colors.primary);
  doc.restore();

  doc.font(fonts.bold).fillColor("white");
  doc.text("TOTAL:", 360, totalsY + 78);
  doc.text(`$${total.toFixed(2)}`, 470, totalsY + 78, { align: "right" });
  doc.fillColor(colors.text);

  // --- NOTES & TERMS ---
  doc.moveDown(3);
  if (invoice.notes) {
    doc.font(fonts.bold).text("Notes:");
    doc.font(fonts.normal).fillColor(colors.subtext).text(invoice.notes).moveDown();
  }

  if (invoice.terms) {
    doc.font(fonts.bold).fillColor(colors.text).text("Terms & Conditions:");
    doc.font(fonts.normal).fillColor(colors.subtext).text(invoice.terms);
  }

  // --- FOOTER ---
  doc.save();
  doc.rect(0, doc.page.height - 40, doc.page.width, 40).fill(colors.lightGray);
  doc.restore();

  doc.fontSize(9).fillColor(colors.subtext).text(
    "Generated automatically — Free Invoice Generator (Beta)",
    0,
    doc.page.height - 65,
    { align: "center" }
  );


  doc.end();
  return doc;
}
