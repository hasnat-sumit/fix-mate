"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { AlertCircle, UserRoundCheck } from "lucide-react";
import { useSignOut } from "@/components/auth/use-sign-out";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/lib/auth-client";
import { roleLabels } from "@/lib/navigation";

/** Form-level error, announced to screen readers as soon as it appears. */
export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm leading-6 text-foreground">
      <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-error" />
      <div>{children}</div>
    </div>
  );
}

type SignedInNoticeProps = {
  name: string;
  role: UserRole;
  continueTo: string;
};

/** Shown on the auth pages when someone who is already signed in opens them. */
export function SignedInNotice({ name, role, continueTo }: SignedInNoticeProps) {
  const { signOut, isSigningOut } = useSignOut();

  return (
    <div className="rounded-xl border border-border bg-secondary/60 p-5">
      <div className="flex items-start gap-3">
        <UserRoundCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" />
        <p className="text-sm leading-6 text-muted-foreground">
          You’re signed in as <strong className="text-foreground">{name}</strong> ({roleLabels[role].toLowerCase()} account).
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="h-11 flex-1 rounded-lg">
          <Link href={continueTo}>Continue</Link>
        </Button>
        <Button type="button" variant="outline" onClick={signOut} disabled={isSigningOut} className="h-11 flex-1 rounded-lg">
          {isSigningOut ? "Signing out…" : "Sign out"}
        </Button>
      </div>
    </div>
  );
}
