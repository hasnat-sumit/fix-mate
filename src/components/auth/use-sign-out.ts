"use client";

import { useState } from "react";
import { authClient, clearApiToken } from "@/lib/auth-client";

/** Signs out, revoking the server session, and always drops the in-memory API token. */
export function useSignOut() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function signOut() {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
    } finally {
      clearApiToken();
      setIsSigningOut(false);
    }
  }

  return { signOut, isSigningOut };
}
