"use client";

import Link from "next/link";
import {Button} from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";

const NavBar = ()=>{
  return(
    <div className="flex justify-between">
      <Link href="invoice">Create Invoice</Link>
      <div>
          <SignedIn>
          <UserButton/>
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <Button>Sign in</Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  )
}

export  default NavBar;