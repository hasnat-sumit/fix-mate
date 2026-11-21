"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Container } from "@/components/container";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient, type UserRole } from "@/lib/auth-client";
import { authRoutes, dashboardLinks, roleLabels, withReturnPath } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Dashboard frame: signs visitors in first, then shows the navigation for their role.
 * This gate is for usability only; the API enforces every permission itself.
 */
export function DashboardShell({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) router.replace(withReturnPath(authRoutes.signIn, pathname));
  }, [isPending, session, pathname, router]);

  if (isPending || !session) {
    return (
      <Container aria-busy="true" aria-label="Loading your dashboard" className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:py-12">
        <Skeleton className="h-11 rounded-xl lg:h-64" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </Container>
    );
  }

  const role = session.user.role;
  const links = dashboardLinks[role];

  return (
    <Container className="grid grid-cols-1 gap-6 py-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 lg:py-12">
      <aside>
        <p className="mb-3 hidden text-xs font-bold uppercase tracking-[0.18em] text-accent lg:block">{roleLabels[role]} dashboard</p>
        <nav aria-label="Dashboard" className="-mx-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:overflow-visible lg:px-0">
          <ul className="flex gap-2 lg:flex-col lg:gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href} className="shrink-0">
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex min-h-10 items-center whitespace-nowrap rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                      isActive ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-foreground/80 hover:bg-secondary lg:bg-transparent",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </Container>
  );
}

/** Shows a page only to the given role; the dashboard shell has already ensured someone is signed in. */
export function RequireRole({ role, children }: { role: UserRole; children: ReactNode }) {
  const { data: session } = authClient.useSession();
  if (!session) return null;
  if (session.user.role !== role) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h1 className="font-heading text-xl font-bold text-foreground">This page is for {roleLabels[role].toLowerCase()} accounts</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You’re signed in with a {roleLabels[session.user.role].toLowerCase()} account.{" "}
          <Link href={dashboardLinks[session.user.role][0].href} className="font-semibold text-accent underline-offset-4 hover:underline">
            Go to your dashboard
          </Link>
        </p>
      </div>
    );
  }
  return <>{children}</>;
}

/** /dashboard sends each role to its own home section. */
export function DashboardHome() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  useEffect(() => {
    if (session) router.replace(dashboardLinks[session.user.role][0].href);
  }, [session, router]);
  return <p className="text-sm text-muted-foreground">Opening your dashboard…</p>;
}
