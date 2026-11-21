"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient, clearApiToken } from "@/lib/auth-client";

/**
 * Signs out, revoking the server session, and always drops the in-memory API token.
 * Leaving a private page sends the visitor home; public pages stay where they are.
 */
export function useSignOut() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    setIsSigningOut(true);
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error("We couldn’t sign you out. Please try again.");
        return;
      }
      toast.success("You’ve been signed out.");
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/payment")) router.replace("/");
    } catch {
      toast.error("We couldn’t reach FixMate. Check your connection and try again.");
    } finally {
      clearApiToken();
      setIsSigningOut(false);
    }
  }

  return { signOut, isSigningOut };
}
