"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, UserRoundPen } from "lucide-react";
import { UserIdentity } from "@/components/auth/user-identity";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AuthSession } from "@/lib/auth-client";
import { authRoutes, dashboardHome, isActiveNavLink, publicNavLinks, withReturnPath } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type MobileNavigationProps = {
  session: AuthSession | null;
  isSessionPending: boolean;
  onSignOut: () => Promise<void>;
  isSigningOut: boolean;
  onNavigate: () => void;
};

const accountLinkClass =
  "flex min-h-11 items-center gap-2.5 rounded-lg px-3 text-sm font-semibold text-foreground/80 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

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
      <div className="mt-4 border-t border-border pt-4">
        {isSessionPending ? (
          <Skeleton aria-hidden="true" className="h-11 w-full rounded-full" />
        ) : session ? (
          <div className="space-y-3">
            <UserIdentity name={session.user.name} role={session.user.role} image={session.user.image} />
            <div className="flex flex-col">
              <Link href={dashboardHome(session.user.role)} onClick={onNavigate} className={accountLinkClass}>
                <LayoutDashboard aria-hidden="true" className="size-4 text-muted-foreground" /> Dashboard
              </Link>
              <Link href="/dashboard/profile" onClick={onNavigate} className={accountLinkClass}>
                <UserRoundPen aria-hidden="true" className="size-4 text-muted-foreground" /> Update Profile
              </Link>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={isSigningOut}
              onClick={async () => {
                await onSignOut();
                onNavigate();
              }}
              className="h-11 w-full rounded-full text-error"
            >
              <LogOut aria-hidden="true" className="size-4" />
              {isSigningOut ? "Signing out…" : "Sign Out"}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button asChild variant="outline" className="h-11 rounded-full">
              <Link href={withReturnPath(authRoutes.signIn, pathname)} onClick={onNavigate}>
                Sign In
              </Link>
            </Button>
            <Button asChild className="h-11 rounded-full">
              <Link href={authRoutes.register} onClick={onNavigate}>
                Sign Up
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
