"use client";

import {useEffect} from "react";
import {useUser} from "@clerk/nextjs";
import Loader from "./Loader";
import {trpc} from "@/utils/trpc";
import {toast} from "sonner";

const SyncUser = ()=>{
  const {user} = useUser();

  const createUser = trpc.user.createNewUser.useMutation({
    onSuccess: () => {
      toast.success("✅ User created successfully!");
    },
    onError: (error)=>{
      console.error("❌ Error creating user:", error);
      toast.error("Something went wrong while creating the new user.");
    },
  });


  useEffect(() => {
    if(user) {
      createUser.mutate({
        clerkId: user.id,
        email: user?.emailAddresses[0].emailAddress,
        name: user?.firstName || "Guest",
      })
    }
  }, []);

  if(!user){
    return null;
  };

  return(
    <Loader/>
  )
}

export default SyncUser;