"use client";

import EmailForm from "@/components/forms/EmailForm";
import {generatePdfBuffer} from "@/server/utils/pdfBuffer";
import {trpc} from "@/utils/trpc";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";

const EmailPage = () => {
  const [pdfBuffer, setPdfBuffer] = useState<string | null>(null);
  const [error, setError] = useState<string>();
  const params = useParams();
  const id = params?.id as string;


  useEffect(() => {
    async function buffer() {
      const response = await fetch(`/api/generate-pdf?id=${id}`);
      if (response.ok) {
        setError("Faild to create PDF");
        return;
      }
      ;
      const base64: string = await response.json();
      setPdfBuffer(base64);
    };

    buffer();
  }, [id]);

  if (!id) return <div>Invalid ID</div>;
  if (pdfBuffer) return <p>Loading...</p>;
  if (error) return <p>Error loading invoice: {error}</p>;

  return (
    <section>
      <h1>Email Page</h1>
      <div>{id}</div>
      <EmailForm/>
    </section>
  )
};

export default EmailPage;
//
// {params}: {
//   params: Promise<{ id: string }
//   >
// }