"use client";

import {trpc} from "@/utils/trpc";

type Props = {
  base64: string,
  invoiceNumber: string
}

const EmailForm = ({base64, invoiceNumber}:Props)=>{
  return (
    <h1>Email Form</h1>
  )
};

export default EmailForm;