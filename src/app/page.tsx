"use client";

import { trpc } from "@/utils/trpc";

const HomePage = () => {
  const invoices = trpc.invoice.getAllInvoicesForUser.useQuery();

  if (invoices.isLoading) return <p>Loading...</p>;
  if (invoices.error) return <p>Error: {invoices.error.message}</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">🧾 Invoices</h1>
      <ul>
        {invoices.data?.map((inv) => (
          <li key={inv.id}>
            {inv.customer} — {inv.id} лв
          </li>
        ))}
      </ul>
    </main>
  );
};

export default HomePage;
