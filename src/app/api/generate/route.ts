export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { generatePdfBuffer } from "@/server/utils/pdfBuffer";
import { NextResponse } from "next/server";

export async function POST(req: Request){

  const { invoiceData } = await req.json();

  if (!invoiceData) {
    return NextResponse.json({ message: "Missing invoice data" }, { status: 400 });
  };

  try {
    const buffer = await generatePdfBuffer(invoiceData);
    const base64 = buffer.toString("base64");
    return NextResponse.json({ base64 }, { status: 200 });
  } catch (e: unknown) {
    console.error("❌ PDF generation error:", e);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}