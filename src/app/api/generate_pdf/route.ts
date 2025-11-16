
import {db} from "@/server/db/prisma";
import {generatePdfBuffer} from "@/server/utils/pdfBuffer";
import {NextResponse} from "next/server";

export async function GET(req: Request) {
  const {searchParams} = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({message: "Missing ID"}, {status: 400});
  };

  try {
    const invoice = await db.invoice.findUnique({where: {id: id}});
    console.log("api/generate_pdf", invoice);

    if (!invoice) {
      console.error("Invoice not found for id:", id);
      return NextResponse.json({message: "Invoice not found"}, {status: 404});
    };

    const normalizedInvoice = {
      ...invoice,
      createdAt: new Date(invoice?.createdAt),
      updatedAt: invoice?.updatedAt ? new Date(invoice?.updatedAt) : null,
    };
    const buff = await generatePdfBuffer(normalizedInvoice);
    const base64 = buff.toString("base64");
    const iNumber = invoice.invoiceNumber;

    return NextResponse.json({base64, iNumber}, {status: 200});

  } catch (e: unknown) {
    console.error("❌ PDF generation error:", e);
    return NextResponse.json({message: "Internal error"}, {status: 500});
  }
}