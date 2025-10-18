import NewInvoiceForm from "@/app/dashboard/page";

const HomePage = () => {
   return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">🧾New Invoices</h1>
     <section>
       <NewInvoiceForm/>
     </section>
    </main>
  );
};

export default HomePage;
