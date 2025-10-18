"use client";

import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { invoiceFormType } from "@/types/invoiceForm"; // <-- Тук е твоя schema
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type InvoiceFormValues = z.infer<typeof invoiceFormType>;

const NewInvoiceForm = ()=> {
  const invoices = trpc.invoice.getAllInvoicesForUser.useQuery();
  const createInvoice = trpc.invoice.createNewInvoice.useMutation({
    onSuccess: () => invoices.refetch(),
  });

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormType),
    defaultValues: {
      from: "",
      invoiceNumber: "",
      clientName: "",
      date: "",
      paymentTerms: "",
      dueDate: "",
      PoNumber: "",
      description: "",
      quantity: "",
      rate: "",
      tax: "",
      notes: "",
      discount: "",
      shipping: "",
      terms: "",
    },
  });

  const onSubmit = (values: InvoiceFormValues) => {
   createInvoice.mutate({
     userId: "guest", //ще проверим има ли акаунт в Клърк и ще заменим с id
     from: values.from,
     invoiceNumber: values.invoiceNumber,
     clientName: values.clientName,
     date: values.date,
     paymentTerms: values.paymentTerms,
     dueDate: values.dueDate,
     PoNumber: values.PoNumber,
     description: values.description,
     quantity: values.quantity,
     rate: values.rate,
     tax: values.tax,
     notes: values.notes,
     discount: values.discount,
     shipping: values.shipping,
     terms: values.terms,
   })
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Create New Invoice</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4"
        >
          <FormField
            control={form.control}
            name="from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From</FormLabel>
                <FormControl>
                  <Input placeholder="Company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="invoiceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl>
                  <Input placeholder="INV-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input placeholder="Client name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentTerms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Terms</FormLabel>
                <FormControl>
                  <Input placeholder="Net 30" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="PoNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PO Number</FormLabel>
                <FormControl>
                  <Input placeholder="PO-123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Item or service details..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax (%)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount</FormLabel>
                <FormControl>
                  <Input placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shipping"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping</FormLabel>
                <FormControl>
                  <Input placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Terms</FormLabel>
                <FormControl>
                  <Textarea placeholder="Payment terms or notes..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2 flex justify-end mt-6">
            <Button type="submit">Create Invoice</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default NewInvoiceForm;