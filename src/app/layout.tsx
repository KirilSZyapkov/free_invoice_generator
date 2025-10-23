"use client";

import { Geist, Geist_Mono } from "next/font/google";
import {Toaster} from "@/components/ui/sonner";
import "./globals.css";

import { trpc } from '@/utils/trpc';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import {ClerkProvider} from "@clerk/nextjs";
import NavBar from "@/components/shared/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => (
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc"
        }),
      ],
    })
  ));

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <ClerkProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <QueryClientProvider client={queryClient}>
              <NavBar/>

              {children}
              <Toaster/>
            </QueryClientProvider>
          </body>
        </html>
      </ClerkProvider>
    </trpc.Provider>
  );
}
