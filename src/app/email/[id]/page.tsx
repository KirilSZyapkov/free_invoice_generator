"use client";

import EmailForm from "@/components/forms/EmailForm";
import { useLocalStorage } from "@/utils/hooks/useLocalStorage";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { invoiceType } from "@/types/invoice";

const EmailPage = () => {
  const [pdfBuffer, setPdfBuffer] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useLocalStorage<typeof invoiceType[]>("invoice", []);
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    async function buffer() {
      if (id === "invoice") {
        console.log(data[0]);
        const localInvoice = data[0];
        if (!localInvoice) {
          setError("No invoice data in local storage");
          return;
        };
        const response = await fetch("/api/generate_pdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ invoiceData: localInvoice }),
        });
        if (!response.ok) {
          setError(response.statusText);
          return;
        };
        const { base64 } = await response.json();
        setPdfBuffer(base64);
        setInvoiceNumber(localInvoice.invoiceNumber!);
        setError(null);
      } else {
        try {
          const response = await fetch(`/api/generate_pdf?id=${id}`);
          if (response.ok) {
            const { base64, iNumber } = await response.json();
            setInvoiceNumber(iNumber);
            setPdfBuffer(base64);
            setError(null);
          } else {
            setError(response.statusText);
          }
        } catch (e: unknown) {
          setError("Error fetching PDF");
        }
      }
    };
    buffer();
  }, [id]);

  if (!id) return <div className="p-4 text-red-600">Invalid ID</div>;
  if (error) return <div className="p-4 max-w-3xl mx-auto text-center text-red-600">Error loading invoice: {error}</div>;
  if (!pdfBuffer) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <svg className="animate-spin h-8 w-8 mx-auto text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <p className="mt-3 text-slate-600">Loading invoice preview…</p>
      </div>
    </div>
  );

  const pdfDataUrl = `data:application/pdf;base64,${pdfBuffer}`;

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-100">Send Invoice</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Invoice #{invoiceNumber}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* PDF preview */}
          <div className="w-full">
            <div className="bg-white/80 dark:bg-slate-800/60 rounded-2xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Preview</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {/* <a href={pdfDataUrl} download={`invoice-${invoiceNumber}.pdf`} className="underline">Download</a> */}
                </div>
              </div>
              <div className="w-full h-[60vh] md:h-[75vh]">
                {/* Use embed for better mobile PDF handling; fallback to object */}
                <embed src={pdfDataUrl} type="application/pdf" className="w-full h-full" />
                {/* If embed fails in some browsers, object provides a fallback */}
                <object data={pdfDataUrl} type="application/pdf" className="w-full h-full hidden"></object>
              </div>
            </div>
          </div>

          {/* Form card */}
          <div className="w-full">
            <div className="sticky top-6">
              <div className="bg-white/90 dark:bg-slate-900 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Email Details</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Fill in the recipient's details and send the invoice.</p>

                <EmailForm base64={pdfBuffer} invoiceNumber={invoiceNumber} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
};

export default EmailPage;
//
// {params}: {
//   params: Promise<{ id: string }
//   >
// }