"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Loader from "./Loader";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";

const SyncUser = () => {
  const { user, isSignedIn, isLoaded } = useUser();

  const { data: curUser, isLoading } = trpc.user.getUserById.useQuery(undefined, {
    enabled: isSignedIn && !!user,
  });

  const createUser = trpc.user.createNewUser.useMutation({
    onSuccess: () => {
      toast.success("✅ User created successfully!");
    },
    onError: (error) => {
      console.error("❌ Error creating user:", error);
      toast.error("Something went wrong while creating the new user.");
    },
  });

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) return;

    if (!curUser && !isLoading) {
      createUser.mutate({
        clerkId: user.id,
        email: user?.emailAddresses[0].emailAddress,
        name: user?.firstName || "Guest",
      })
    }
  }, [isLoaded, isSignedIn, user, curUser, isLoading]);

  if (isLoading || createUser.isSuccess) {
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="relative w-full bg-white rounded-xl shadow-lg p-6">
        <Loader />;
      </div>
    </div>)
  };

  return null;
}

export default SyncUser;