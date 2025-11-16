"use client";

import {trpc} from "@/utils/trpc";
import {useState} from "react";
import {useUser} from "@clerk/nextjs";
import {useRouter} from "next/navigation";

const UserPage = ()=>{
  const [loading, setLoading] = useState<boolean>(true);
  const {user,isSignedIn,isLoaded} = useUser();
  const {data: userAllInvoices} = trpc.invoice.getAllInvoicesForUser.useQuery();
  const router = useRouter();

  if(!isSignedIn){
    router.push("/sign-in");
    return;
  }

  if(!isLoaded){
    return <div>Loading...</div>
  }

  console.log(userAllInvoices.userAllInvoices);
  return (
    <div>
      <h1>User Page</h1>

    </div>

  )
}

export default UserPage;