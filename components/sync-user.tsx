"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export function SyncUser() {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    // We only want to trigger the sync if the user is fully loaded and signed in
    if (isLoaded && isSignedIn) {
      fetch("/api/sync-user", { method: "POST" })
        .then((res) => {
          if (!res.ok) {
            console.error("Failed to sync user on frontend");
          }
        })
        .catch(console.error);
    }
  }, [isSignedIn, isLoaded]);

  // This component doesn't render anything visible
  return null;
}
