import {z} from "zod";

export const invoiceType = z.object({
  userId: z.string().min(1),
  from: z.string().min(1, "From is required!"),
  invoiceNumber: z.string().min(1, "Invoice number is required!"),
  clientName: z.string().min(1, "Client name is required!"),
  date: z.string().min(1, "Data is required!"),
  paymentTerms: z.string().min(1, "Payment terms are required!"),
  dueDate: z.string().min(1, "Due data is required!"),
  PoNumber: z.string().min(1, "PO Number is required!"),
  description: z.string().min(1, "Description is required!"),
  quantity: z.string().min(1, "Quantity is required!"),
  rate: z.string().min(1, "Rate is required!"),
  notes: z.string().optional(),
  discount: z.string().optional(),
  tax: z.string().min(1, "Tax is required!"),
  shipping: z.string().optional(),
  terms: z.string().optional()
})