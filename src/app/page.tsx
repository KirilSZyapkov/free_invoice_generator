"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Shield, Zap } from "lucide-react";
import SyncUser from "../components/shared/SyncUser";

const HomePage = () => {
  return (
    <main className="flex flex-col items-center justify-center px-6 py-12 sm:px-12 lg:px-24">
      {/* Hero Section */}
      <section className="max-w-4xl text-center space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight"
        >
          Generate <span className="text-blue-600">Invoices</span> Effortlessly.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-lg sm:text-xl"
        >
          Create professional invoices in seconds. Use it <strong>with or without an account</strong>.
          No setup. No hassle. Just clean and fast invoicing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mt-6"
        >
          <Link href="/invoice">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl">
              Create Invoice <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <Link href="/sign-up">
            <Button
              variant="outline"
              className="px-8 py-6 text-lg rounded-xl border-gray-300 hover:border-blue-600"
            >
              Sign up (optional)
            </Button>
          </Link>
        </motion.div>

        <p className="text-sm text-gray-400 mt-6">
          🚀 <strong>Currently in Beta</strong> — new features and improvements are coming soon.
        </p>
      </section>

      {/* Features Section */}
      <section className="mt-16 grid gap-8 sm:grid-cols-3 max-w-5xl w-full">
        {[
          {
            icon: <FileText className="h-10 w-10 text-blue-600" />,
            title: "Instant PDF invoices",
            desc: "Generate and download invoices instantly in professional PDF format.",
          },
          {
            icon: <Shield className="h-10 w-10 text-blue-600" />,
            title: "Use without an account",
            desc: "You can use the app without signing up — your last invoice will be kept for up to 1 month (unless browser history is cleared).",
          },
          {
            icon: <Zap className="h-10 w-10 text-blue-600" />,
            title: "Simple & Fast",
            desc: "No unnecessary fields. No complex setup. Just fill, generate, and send.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            viewport={{ once: true }}
            className="bg-white shadow-md rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-center mb-4">{item.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
            <p className="text-gray-600 mt-2">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Footer / Sync */}
      <footer className="mt-20 text-center text-gray-500 text-sm">
        <SyncUser />
        <p className="mt-4">
          © {new Date().getFullYear()} Free Invoice Generator — Built with ❤️ using Next.js & Clerk.
        </p>
      </footer>
    </main>
  );
};

export default HomePage;
