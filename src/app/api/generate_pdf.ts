import {NextApiRequest, NextApiResponse} from "next";
import {db} from "@/server/db/prisma";
import {generatePdfBuffer} from "@/server/utils/pdfBuffer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {id} = req.query;
    const invoice = await db.invoice.findUnique({where: {id: String(id)}});
    if (invoice) {
      const normalizedInvoice = {
        ...invoice,
        createdAt: new Date(invoice?.createdAt),
        updatedAt: invoice?.updatedAt ? new Date(invoice?.updatedAt) : null,
      };
      const buff = await generatePdfBuffer(normalizedInvoice);
      const base64 = buff.toString("base64");

      return res.status(200).json({base64});
    }

  } catch (e: unknown) {
    console.error("❌ PDF generation error:", e);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
}