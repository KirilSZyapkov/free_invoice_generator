"use client";

import EmailForm from "@/components/forms/EmailForm";
import { generatePdfBuffer } from "@/server/utils/pdfBuffer";
import { trpc } from "@/utils/trpc";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const EmailPage = () => {
  const [pdfBuffer, setPdfBuffer] = useState<Uint8Array | null>(null);
  const params = useParams();
  const id = params?.id as string;
  const { data: invoicedById, isLoading, error } = trpc.invoice.getInvoiceById.useQuery({ id }, { enabled: !!id });

  useEffect(() => {
    async function buffer() {
      if (invoicedById?.invoiceById) {
        const invoice = invoicedById.invoiceById;

        const normalizedInvoice = {
          ...invoice,
          createdAt: new Date(invoice.createdAt),
          updatedAt: invoice.updatedAt ? new Date(invoice.updatedAt) : null,
        };
        const buff = await generatePdfBuffer(normalizedInvoice);
        setPdfBuffer(buff);
      }
    };

    buffer();
  }, [invoicedById?.invoiceById]);

  if (!id) return <div>Invalid ID</div>;
  if (isLoading || pdfBuffer) return <p>Loading...</p>;
  if (error) return <p>Error loading invoice: {error.message}</p>;
  if (invoicedById?.invoiceById) return <p>No invoice found.</p>;

  return (
    <section>
      <h1>Email Page</h1>
      <div>{id}</div>
      <EmailForm />
    </section>
  )
};

export default EmailPage;
//
// {params}: {
//   params: Promise<{ id: string }
//   >
// }