import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendInvoiceEmail = async (to: string, pdfBase64: string, invoiceNumber: string) => {
  const pdfBuffer = Buffer.from(pdfBase64, "base64");
  return transporter.sendMail({
    from: `Free Invoice Generator <${process.env.SMTO_USER}>`,
    to,
    subject: `Invoice #${invoiceNumber}`,
    text: `Hello, I'm sending you invoice ${invoiceNumber}`,
    attachments: [
      {
        filename: `invoice-${invoiceNumber}`,
        content: pdfBuffer
      },
    ],
  });
}