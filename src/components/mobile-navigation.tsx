"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, LogOut } from "lucide-react";
import { UserIdentity } from "@/components/auth/user-identity";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AuthSession } from "@/lib/auth-client";
import { authRoutes, isActiveNavLink, publicNavLinks, withReturnPath } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type MobileNavigationProps = {
  session: AuthSession | null;
  isSessionPending: boolean;
  onSignOut: () => Promise<void>;
  isSigningOut: boolean;
  onNavigate: () => void;
};

export function MobileNavigation({ session, isSessionPending, onSignOut, isSigningOut, onNavigate }: MobileNavigationProps) {
  const pathname = usePathname();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onNavigate();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onNavigate]);

  return (
    <div id="mobile-navigation" className="absolute inset-x-0 top-full border-b border-border bg-card px-5 pb-5 pt-3 shadow-lg md:hidden">
      <nav aria-label="Mobile navigation" className="flex flex-col">
        {publicNavLinks.map((link) => {
          const isActive = isActiveNavLink(pathname, link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                isActive ? "bg-secondary text-foreground" : "text-foreground/80",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
        {isSessionPending ? (
          <Skeleton aria-hidden="true" className="h-11 w-full rounded-full" />
        ) : session ? (
          <>
            <UserIdentity name={session.user.name} role={session.user.role} />
            <Button
              type="button"
              variant="outline"
              disabled={isSigningOut}
              onClick={async () => {
                await onSignOut();
                onNavigate();
              }}
              className="h-11 shrink-0 rounded-full px-4"
            >
              <LogOut aria-hidden="true" className="size-4" />
              {isSigningOut ? "Signing out…" : "Sign out"}
            </Button>
          </>
        ) : (
          <>
            <Link
              href={withReturnPath(authRoutes.signIn, pathname)}
              onClick={onNavigate}
              className="flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Sign in
            </Link>
            <Button asChild className="h-11 rounded-full px-5">
              <Link href="/services" onClick={onNavigate}>
                Get started <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
