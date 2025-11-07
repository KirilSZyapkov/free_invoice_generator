"use client";

import EmailForm from "@/components/forms/EmailForm";
import { trpc } from "@/utils/trpc";
import { useParams } from "next/navigation";

const EmailPage = () => {
  const params = useParams();
  const id = params?.id as string;
  if (!id) return <div>Invalid ID</div>;
  const { data: invoicedById, isLoading, error } = trpc.invoice.getInvoiceById.useQuery({ id }, { enabled: !!id });
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