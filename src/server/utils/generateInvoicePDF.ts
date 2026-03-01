import PDFDocument from "pdfkit";
import fs from "fs";
import type { Invoice } from "@prisma/client";
import path from "path";

type Fonts = {
  regular: string;
  bold: string;
};

const THEME = {
  brand: "#2563eb",
  ink: "#0f172a",
  muted: "#475569",
  line: "#e2e8f0",
  surface: "#f8fafc",
  surface2: "#f1f5f9",
  white: "#ffffff",
} as const;

function safeText(value: unknown, fallback = "—"): string {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  return text.length ? text : fallback;
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return fallback;

    const normalized =
      trimmed.includes(",") && !trimmed.includes(".") ? trimmed.replace(",", ".") : trimmed;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function formatMoney(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(safeAmount);
  } catch {
    const sign = safeAmount < 0 ? "-" : "";
    return `${sign}$${Math.abs(safeAmount).toFixed(2)}`;
  }
}

function registerFonts(doc: PDFKit.PDFDocument): Fonts {
  const regularFontPath = path.join(process.cwd(), "src/assets/OpenSans-Regular.ttf");
  const boldFontPath = path.join(process.cwd(), "src/assets/OpenSans-Bold.ttf");

  if (fs.existsSync(regularFontPath) && fs.existsSync(boldFontPath)) {
    doc.registerFont("OpenSans", regularFontPath);
    doc.registerFont("OpenSans-Bold", boldFontPath);
    return { regular: "OpenSans", bold: "OpenSans-Bold" };
  }

  return { regular: "Helvetica", bold: "Helvetica-Bold" };
}

type InvoiceTotals = {
  quantity: number;
  rate: number;
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  discount: number;
  shipping: number;
  total: number;
};

function computeTotals(invoice: Partial<Invoice>): InvoiceTotals {
  const quantity = toNumber(invoice.quantity, 0);
  const rate = toNumber(invoice.rate, 0);
  const subtotal = quantity * rate;

  const taxPercent = toNumber(invoice.tax, 0);
  const taxAmount = subtotal * (taxPercent / 100);

  const discount = toNumber(invoice.discount, 0);
  const shipping = toNumber(invoice.shipping, 0);

  const total = subtotal + taxAmount + shipping - discount;

  return { quantity, rate, subtotal, taxPercent, taxAmount, discount, shipping, total };
}

function drawCard(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  w: number,
  h: number,
  opts: { fill: string; stroke: string; radius?: number }
) {
  const radius = opts.radius ?? 10;
  doc.save();
  doc.roundedRect(x, y, w, h, radius).fillAndStroke(opts.fill, opts.stroke);
  doc.restore();
}

function drawKeyValueRow(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  w: number,
  label: string,
  value: string,
  fonts: Fonts
) {
  const labelWidth = Math.min(90, Math.max(60, Math.floor(w * 0.45)));
  const valueWidth = w - labelWidth;

  doc.font(fonts.regular).fontSize(9).fillColor(THEME.muted).text(label, x, y, { width: labelWidth });
  doc.font(fonts.bold).fontSize(9).fillColor(THEME.ink).text(value, x + labelWidth, y, {
    width: valueWidth,
    align: "right",
  });
}

export async function generateInvoicePDF(invoice: Partial<Invoice>) {
  const totals = computeTotals(invoice);

  const doc = new PDFDocument({
    size: "A4",
    margin: 48,
    bufferPages: true,
    info: {
      Title: `Invoice ${safeText(invoice.invoiceNumber, "")}`.trim() || "Invoice",
      Author: safeText(invoice.from, "Free Invoice Generator"),
    },
  });

  const fonts = registerFonts(doc);

  const pageWidth = doc.page.width;
  const contentX = doc.page.margins.left;
  const contentW = pageWidth - doc.page.margins.left - doc.page.margins.right;
  const gap = 16;

  // Top accent stripe
  doc.rect(0, 0, pageWidth, 10).fill(THEME.brand);
  doc.fillColor(THEME.ink);

  // Header
  const headerY = doc.y;
  const headerRightW = 210;
  const headerLeftW = contentW - headerRightW - gap;
  const headerRightX = contentX + headerLeftW + gap;

  doc.font(fonts.bold).fontSize(30).fillColor(THEME.ink).text("Invoice", contentX, headerY, {
    width: headerLeftW,
  });

  doc
    .font(fonts.bold)
    .fontSize(11)
    .fillColor(THEME.muted)
    .text(`Invoice #${safeText(invoice.invoiceNumber)}`, headerRightX, headerY + 6, {
      width: headerRightW,
      align: "right",
    });

  doc.font(fonts.regular).fontSize(9).fillColor(THEME.muted).text("Balance due", headerRightX, headerY + 28, {
    width: headerRightW,
    align: "right",
  });

  doc.font(fonts.bold).fontSize(18).fillColor(THEME.brand).text(formatMoney(totals.total), headerRightX, headerY + 40, {
    width: headerRightW,
    align: "right",
  });

  doc.y = headerY + 80;

  // Cards: From / Bill To
  const cardW = (contentW - gap) / 2;
  const cardPadding = 12;

  const fromValue = safeText(invoice.from);
  const billToValue = safeText(invoice.clientName);

  doc.font(fonts.bold).fontSize(12);
  const fromValueH = doc.heightOfString(fromValue, { width: cardW - cardPadding * 2 });
  const billToValueH = doc.heightOfString(billToValue, { width: cardW - cardPadding * 2 });
  const cardH = Math.max(72, cardPadding + 12 + 6 + Math.max(fromValueH, billToValueH) + cardPadding);

  const cardsY = doc.y;
  drawCard(doc, contentX, cardsY, cardW, cardH, { fill: THEME.surface, stroke: THEME.line });
  drawCard(doc, contentX + cardW + gap, cardsY, cardW, cardH, { fill: THEME.surface, stroke: THEME.line });

  // From
  doc.font(fonts.regular).fontSize(9).fillColor(THEME.muted).text("FROM", contentX + cardPadding, cardsY + cardPadding);
  doc.font(fonts.bold).fontSize(12).fillColor(THEME.ink).text(fromValue, contentX + cardPadding, cardsY + cardPadding + 14, {
    width: cardW - cardPadding * 2,
  });

  // Bill To
  const billToX = contentX + cardW + gap + cardPadding;
  doc.font(fonts.regular).fontSize(9).fillColor(THEME.muted).text("BILL TO", billToX, cardsY + cardPadding);
  doc.font(fonts.bold).fontSize(12).fillColor(THEME.ink).text(billToValue, billToX, cardsY + cardPadding + 14, {
    width: cardW - cardPadding * 2,
  });

  doc.y = cardsY + cardH + 14;

  // Invoice details card
  const detailsH = 56;
  const detailsY = doc.y;
  drawCard(doc, contentX, detailsY, contentW, detailsH, { fill: THEME.surface, stroke: THEME.line });

  const colW = (contentW - gap * 3) / 4;
  const detailPadX = cardPadding;
  const detailPadY = 12;

  const details = [
    { label: "Date issued", value: safeText(invoice.date) },
    { label: "Due date", value: safeText(invoice.dueDate) },
    { label: "Payment terms", value: safeText(invoice.paymentTerms) },
    { label: "PO number", value: safeText(invoice.poNumber) },
  ];

  details.forEach((d, idx) => {
    const x = contentX + detailPadX + idx * (colW + gap);
    doc.font(fonts.regular).fontSize(9).fillColor(THEME.muted).text(d.label.toUpperCase(), x, detailsY + detailPadY, {
      width: colW,
    });
    doc.font(fonts.bold).fontSize(11).fillColor(THEME.ink).text(d.value, x, detailsY + detailPadY + 14, {
      width: colW,
    });
  });

  doc.y = detailsY + detailsH + 18;

  // Items table
  const tableX = contentX;
  const tableY = doc.y;

  const qtyW = 60;
  const rateW = 90;
  const amountW = 90;
  const descW = contentW - qtyW - rateW - amountW;

  const headerH = 26;
  const rowPadY = 10;

  const description = safeText(invoice.description);
  doc.font(fonts.regular).fontSize(10);
  const descriptionH = doc.heightOfString(description, { width: descW - 24 });
  const rowH = Math.max(28, descriptionH) + rowPadY;

  const tableH = headerH + rowH;

  // Header background + outer border
  doc.save();
  doc.rect(tableX, tableY, contentW, headerH).fill(THEME.surface2);
  doc.rect(tableX, tableY, contentW, tableH).stroke(THEME.line);
  doc.restore();

  // Column headers
  doc.font(fonts.bold).fontSize(10).fillColor(THEME.ink);
  const headerTextY = tableY + 8;
  doc.text("Description", tableX + 12, headerTextY, { width: descW - 24 });
  doc.text("Qty", tableX + descW, headerTextY, { width: qtyW, align: "right" });
  doc.text("Rate", tableX + descW + qtyW, headerTextY, { width: rateW, align: "right" });
  doc.text("Amount", tableX + descW + qtyW + rateW, headerTextY, { width: amountW - 12, align: "right" });

  // Row separator
  doc.save();
  doc.moveTo(tableX, tableY + headerH).lineTo(tableX + contentW, tableY + headerH).stroke(THEME.line);
  doc.restore();

  // Row content
  const rowY = tableY + headerH + rowPadY / 2;
  doc.font(fonts.regular).fontSize(10).fillColor(THEME.ink);

  doc.text(description, tableX + 12, rowY, { width: descW - 24 });
  doc.text(String(totals.quantity || 0), tableX + descW, rowY, { width: qtyW, align: "right" });
  doc.text(formatMoney(totals.rate), tableX + descW + qtyW, rowY, { width: rateW, align: "right" });
  doc.text(formatMoney(totals.subtotal), tableX + descW + qtyW + rateW, rowY, { width: amountW - 12, align: "right" });

  doc.y = tableY + tableH + 20;

  // Totals summary (right aligned)
  const summaryW = 240;
  const summaryX = contentX + contentW - summaryW;
  const summaryPad = 12;

  const discountValue = totals.discount > 0 ? formatMoney(-totals.discount) : formatMoney(0);

  const summaryRows = [
    { label: "Subtotal", value: formatMoney(totals.subtotal) },
    { label: `Tax (${totals.taxPercent.toFixed(2)}%)`, value: formatMoney(totals.taxAmount) },
    { label: "Shipping", value: formatMoney(totals.shipping) },
    { label: "Discount", value: discountValue },
  ];

  const rowLineH = 16;
  const summaryH = summaryPad * 2 + summaryRows.length * rowLineH + 30;
  const summaryY = doc.y;

  drawCard(doc, summaryX, summaryY, summaryW, summaryH, { fill: THEME.surface, stroke: THEME.line });

  let cursorY = summaryY + summaryPad;
  summaryRows.forEach((r) => {
    drawKeyValueRow(doc, summaryX + summaryPad, cursorY, summaryW - summaryPad * 2, r.label, r.value, fonts);
    cursorY += rowLineH;
  });

  // Divider
  doc.save();
  doc.moveTo(summaryX + summaryPad, cursorY + 4).lineTo(summaryX + summaryW - summaryPad, cursorY + 4).stroke(THEME.line);
  doc.restore();

  cursorY += 12;

  // Total pill
  const totalPillH = 26;
  doc.save();
  doc.roundedRect(summaryX + summaryPad, cursorY, summaryW - summaryPad * 2, totalPillH, 8).fill(THEME.brand);
  doc.restore();

  doc.font(fonts.bold).fontSize(10).fillColor(THEME.white).text("TOTAL", summaryX + summaryPad + 10, cursorY + 8, {
    width: summaryW - summaryPad * 2 - 20,
  });
  doc.text(formatMoney(totals.total), summaryX + summaryPad + 10, cursorY + 8, {
    width: summaryW - summaryPad * 2 - 20,
    align: "right",
  });

  doc.fillColor(THEME.ink);
  doc.y = summaryY + summaryH + 18;

  // Notes / Terms
  const notes = (typeof invoice.notes === "string" ? invoice.notes : undefined)?.trim();
  const terms = (typeof invoice.terms === "string" ? invoice.terms : undefined)?.trim();

  if (notes) {
    doc.font(fonts.bold).fontSize(11).fillColor(THEME.ink).text("Notes");
    doc.font(fonts.regular).fontSize(10).fillColor(THEME.muted).text(notes, { width: contentW });
    doc.moveDown(1);
  }

  if (terms) {
    doc.font(fonts.bold).fontSize(11).fillColor(THEME.ink).text("Terms");
    doc.font(fonts.regular).fontSize(10).fillColor(THEME.muted).text(terms, { width: contentW });
    doc.moveDown(1);
  }

  // Footer (all pages)
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i += 1) {
    doc.switchToPage(i);
    const footerY = doc.page.height - doc.page.margins.bottom - 18;
    doc.font(fonts.regular).fontSize(8).fillColor(THEME.muted).text(
      `Generated by Free Invoice Generator • Page ${i + 1} of ${range.count}`,
      contentX,
      footerY,
      { width: contentW, align: "center" }
    );
  }
  doc.switchToPage(range.start + range.count - 1);

  return doc;
}
