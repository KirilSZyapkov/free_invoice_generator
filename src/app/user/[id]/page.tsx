"use client";

import {trpc} from "@/utils/trpc";
import {useState} from "react";
import {useUser} from "@clerk/nextjs";
import {useRouter} from "next/navigation";
import Link from "next/link";

type INVOICE = {
  userId: string
  from: string
  invoiceNumber: string
  clientName: string
  date: string
  paymentTerms: string
  dueDate: string
  poNumber: string
  description: string
  quantity: string
  rate: string
  notes: string | null
  discount: string | null
  tax: string
  shipping: string | null
  terms: string | null
  id: string

}


const UserPage = () => {
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});
  const {isSignedIn, isLoaded} = useUser();
  const {data: userAllInvoices} = trpc.invoice.getAllInvoicesForUser.useQuery();
  const {data: curUser} = trpc.user.getUserById.useQuery();
  const router = useRouter();

  if (!isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Helper to download PDF for an invoice by id using the existing API endpoint
  const downloadInvoice = async (invoiceId: string, invoiceNumber?: string) => {
    try {
      setDownloading((s) => ({...s, [invoiceId]: true}));
      const res = await fetch(`/api/generate_pdf?id=${encodeURIComponent(invoiceId)}`);
      if (!res.ok) throw new Error(`Failed to fetch invoice: ${res.statusText}`);
      const json = await res.json();
      const base64 = json.base64 as string;
      const dataUrl = `data:application/pdf;base64,${base64}`;
      const resBlob = await (await fetch(dataUrl)).blob();
      const url = URL.createObjectURL(resBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoiceNumber ?? invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
      // Optionally show a toast/error UI here
    } finally {
      setDownloading((s) => ({...s, [invoiceId]: false}));
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="mb-2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-100">Account</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Overview of your profile and generated invoices</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User card */}
          <div className="lg:col-span-1">
            <div
              className="bg-white/90 dark:bg-slate-900 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 p-6">
              <div className="flex items-center gap-4">
                <div
                  className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl font-medium text-slate-700">
                  {curUser?.user.name ? curUser.user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {curUser?.user.name ?? "User"}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {curUser?.user.email ?? "No email available"}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <div>
                  <span className="font-medium text-slate-800 dark:text-slate-100">Invoices: </span>
                  <span>{userAllInvoices?.userAllInvoices?.length ?? 0}</span>
                </div>
                {/* ...existing code... (you can add more user details here) */}
              </div>

              {/* <div className="mt-6">
                <Link href="/app/settings" className="inline-block">
                  <button className="px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100">
                    Manage account
                  </button>
                </Link>
              </div> */}
            </div>
          </div>

          {/* Invoices list */}
          <div className="lg:col-span-2">
            <div
              className="bg-white/90 dark:bg-slate-900 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Your Invoices</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">All invoices you generated. Click download
                or send by email.</p>

              {!userAllInvoices?.userAllInvoices || userAllInvoices.userAllInvoices.length === 0 ? (
                <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                  You have no invoices yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {userAllInvoices.userAllInvoices.map((inv: INVOICE) => (
                    <div key={inv.id}
                         className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-lg border border-slate-100 dark:border-slate-700 bg-white dark:bg-transparent">
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Invoice</div>
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          #{inv.invoiceNumber ??  inv.id}
                        </div>
                        {inv.date && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {new Date(inv.date).toLocaleString()}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => downloadInvoice(inv.id, inv.invoiceNumber)}
                          disabled={!!downloading[inv.id]}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100"
                        >
                          {downloading[inv.id] ? (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                      strokeWidth="4" fill="none"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                            </svg>
                          ) : null}
                          <span>{downloading[inv.id] ? "Downloading..." : "Download"}</span>
                        </button>

                        <Link href={`/email/${inv.id}`}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-600 text-sm text-white">
                          Email
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserPage;