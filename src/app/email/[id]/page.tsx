"use client";

import EmailForm from "@/components/forms/EmailForm";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";

const EmailPage = () => {
  const [pdfBuffer, setPdfBuffer] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    async function buffer() {
      try {
        const response = await fetch(`/api/generate_pdf?id=${id}`);
        if (response.ok) {
          const {base64, iNumber} = await response.json();
          setInvoiceNumber(iNumber);
          setPdfBuffer(base64);
          setError(null);
        } else {
          setError(response.statusText);
        }
      } catch (e: unknown) {
        setError("Error fetching PDF");
      }

    };
    buffer();
  }, [id]);

  if (!id) return <div>Invalid ID</div>;
  if (!pdfBuffer) return <p>Loading...</p>;
  if (error) return <p>Error loading invoice: {error}</p>;

  return (
    <section>
      <h1>Email Page</h1>
      <EmailForm base64={pdfBuffer} invoiceNumber={invoiceNumber}/>
    </section>
  )
};

export default EmailPage;
//
// {params}: {
//   params: Promise<{ id: string }
//   >
// }