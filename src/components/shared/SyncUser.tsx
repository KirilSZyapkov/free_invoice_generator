"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";

const SyncUser = () => {
  const { user, isSignedIn, isLoaded } = useUser();

  const { data: curUser, isLoading, refetch } = trpc.user.getUserById.useQuery(undefined, {
    enabled: isSignedIn && !!user,
  });

  const createUser = trpc.user.createNewUser.useMutation({
    onSuccess: async () => {
      toast.success("✅ User created successfully!");
      await refetch();
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
        name: user?.firstName || user?.fullName || user?.username || "Guest",
      })
    }
  }, [isLoaded, isSignedIn, user?.id, curUser, isLoading]);

  return null;
}

export default SyncUser;