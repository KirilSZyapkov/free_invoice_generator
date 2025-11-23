import emailjs from "@emailjs/nodejs";

export async function sendInvoiceEmail(to: string, pdfBase64: string, invoiceNumber: string, message: string, subject: string) {
  const result = await emailjs.send(
    process.env.EMAILJS_SERVICE_ID!,
    process.env.EMAILJS_TEMPLATE_ID!,
    {
      to_email: to,
      subject: `${subject} - invoice #${invoiceNumber}`,
      message: `${message}`,
      attachment: pdfBase64,           // <-- важната част
      attachmentName: `invoice-${invoiceNumber}.pdf`,
    },
    {
      publicKey: process.env.EMAILJS_PUBLIC_KEY!,
      privateKey: process.env.EMAILJS_PRIVATE_KEY!, // required on backend
    }
  );

  return result;
}


// import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT),
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// });

// export const sendInvoiceEmail = async (to: string, pdfBase64: string, invoiceNumber: string, subject: string, message: string) => {
//   const pdfBuffer = Buffer.from(pdfBase64, "base64");
//   return transporter.sendMail({
//     from: `Free Invoice Generator <${process.env.SMTO_USER}>`,
//     to,
//     subject: `${subject}`,
//     text: `${message}`,
//     attachments: [
//       {
//         filename: `invoice-${invoiceNumber}`,
//         content: pdfBuffer
//       },
//     ],
//   });
// }