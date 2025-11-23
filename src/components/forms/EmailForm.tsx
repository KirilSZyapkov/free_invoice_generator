"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";

type Props = {
  base64: string,
  invoiceNumber: string
}

type FormValues = {
  to: string;
  subject: string;
  message: string;
};

const EmailForm = ({ base64, invoiceNumber }: Props) => {
  const [sending, setSending] = useState(false);
  const sendEmail = trpc.email.sendImails.useMutation({
    onSuccess: async () => {
      toast.success("✅ Invoice created successfully!");
      form.reset();
    },
    onError: (error) => {
      console.error("❌ Error sending invoice:", error);
      toast.error("Something went wrong while sending the invoice.");
    },
    onSettled: () => setSending(false)
  });
  const form = useForm<FormValues>({
    defaultValues: {
      to: "",
      subject: `Invoice #${invoiceNumber}`,
      message: `Hello,\n\nPlease find attached Invoice #${invoiceNumber}.\n\nRegards,`,
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!base64) {
      console.error("❌ No PDF data to send.");
      return;
    };
    if (!values.to) {
      toast.error("Please provide a recipient email address.");
      return;
    };
    setSending(true);
    try {
      await sendEmail.mutateAsync({
        to: values.to,
        pdfBase64: base64,
        invoiceNumber,
        subject: values.subject,
        message: values.message
      });
    } catch (err) {
      console.error("Send failed", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 bg-white/80 dark:bg-slate-900/60 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-3">Send Invoice</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="to">To</Label>
                <FormControl>
                  <Input
                    id="to"
                    placeholder="customer@example.com"
                    {...field}
                    type="email"
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="subject">Subject</Label>
                <FormControl>
                  <Input id="subject" placeholder="Subject" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="message">Message</Label>
                <FormControl>
                  <Textarea
                    id="message"
                    placeholder="Write a message..."
                    rows={6}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between gap-2">
            <div className="text-sm text-muted-foreground">
              Invoice: <span className="font-medium">{invoiceNumber}</span>
            </div>
            {/* <Button type="submit" disabled={sending}>
              {sending ? "Sending..." : "Send Email"}
            </Button> */}
            <div className="font-semibold text-red-500 underline">Due to technical problems Sending Emails is disabled!</div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EmailForm;