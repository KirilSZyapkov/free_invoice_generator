"use client";

import Link from "next/link";
import {SignedIn, SignedOut, SignInButton, UserButton, useUser} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


export const NavBar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo / Brand */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Free<span className="text-blue-600">Invoice</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-6 sm:flex">
          <Link
            href="/invoice"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Create Invoice
          </Link>
          <Link
            href="/help"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Help
          </Link>
          <SignedIn>
            <Link href={`/user/${user?.id}`} className="cursor-pointer">My Account</Link>
            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-9 h-9" } }} />
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sm:hidden border-t border-gray-200 bg-white shadow-md"
          >
            <div className="flex flex-col space-y-4 px-4 py-4">
              <Link
                href="/invoice"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setOpen(false)}
              >
                Create Invoice
              </Link>
              <Link
                href="/help"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
               Help
              </Link>

              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: { userButtonAvatarBox: "w-10 h-10" },
                  }}
                />
              </SignedIn>

              <SignedOut>
                <SignInButton>
                  <Button
                    onClick={() => setOpen(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;
