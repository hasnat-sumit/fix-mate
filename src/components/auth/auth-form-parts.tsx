"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import type { AuthSession } from "@/lib/auth-client";
import { dashboardHome } from "@/lib/navigation";

/** Form-level error, announced to screen readers as soon as it appears. */
export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm leading-6 text-foreground">
      <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-error" />
      <div>{children}</div>
    </div>
  );
}

/**
 * Sends someone who is already signed in away from the sign-in/sign-up pages: to `nextPath` when
 * there is one, otherwise to their own dashboard. Paused while the form itself is signing them in,
 * because the form then redirects (and toasts) on its own.
 */
export function useRedirectSignedIn(session: AuthSession | null | undefined, nextPath: string | null, paused: boolean) {
  const router = useRouter();
  const target = session ? (nextPath ?? dashboardHome(session.user.role)) : null;

  useEffect(() => {
    if (target && !paused) router.replace(target);
  }, [target, paused, router]);

  return Boolean(target) && !paused;
}

/** Shown for a moment while a signed-in visitor is being redirected off an auth page. */
export function RedirectingNotice() {
  return (
    <p role="status" className="rounded-xl border border-border bg-secondary/60 p-5 text-sm text-muted-foreground">
      You’re already signed in. Taking you to your dashboard…
    </p>
  );
}
