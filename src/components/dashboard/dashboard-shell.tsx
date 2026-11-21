"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { House, LogOut, Menu, ShieldX, X } from "lucide-react";
import { RoleBadge } from "@/components/auth/user-identity";
import { UserMenu } from "@/components/auth/user-menu";
import { useSignOut } from "@/components/auth/use-sign-out";
import { FixMateLogo } from "@/components/fixmate-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient, type UserRole } from "@/lib/auth-client";
import { authRoutes, dashboardAreaRole, dashboardHome, dashboardLinks, roleLabels, withReturnPath } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Dashboard frame: sidebar + top bar, no public footer. Signs visitors in first (waiting for the
 * session on reload, so a signed-in user is never bounced to sign-in), then checks the role area.
 * These gates are for usability only; the API enforces every permission itself.
 */
export function DashboardShell({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  // The mobile sidebar remembers the page it was opened on, so navigating anywhere closes it.
  const [sidebarOpenedOn, setSidebarOpenedOn] = useState<string | null>(null);
  const isSidebarOpen = sidebarOpenedOn === pathname;
  const closeSidebar = () => setSidebarOpenedOn(null);

  useEffect(() => {
    if (!isPending && !session) router.replace(withReturnPath(authRoutes.signIn, pathname));
  }, [isPending, session, pathname, router]);

  useEffect(() => {
    if (!isSidebarOpen) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setSidebarOpenedOn(null);
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isSidebarOpen]);

  if (isPending || !session) return <DashboardSkeleton />;

  const role = session.user.role;
  const areaRole = dashboardAreaRole(pathname);

  return (
    <div className="min-h-dvh bg-secondary/40 lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Desktop: always visible. Mobile/tablet: slide-over opened from the top bar. */}
      <div
        aria-hidden="true"
        onClick={closeSidebar}
        className={cn("fixed inset-0 z-40 bg-foreground/40 backdrop-blur-[2px] transition-opacity lg:hidden", isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0")}
      />
      <aside
        id="dashboard-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-border bg-card transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-dvh lg:w-auto lg:translate-x-0",
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
        )}
      >
        <SidebarContent role={role} pathname={pathname} onClose={closeSidebar} />
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-[68px] items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Open dashboard menu"
            aria-expanded={isSidebarOpen}
            aria-controls="dashboard-sidebar"
            onClick={() => setSidebarOpenedOn(pathname)}
            className="size-10 rounded-full lg:hidden"
          >
            <Menu aria-hidden="true" className="size-[18px]" />
          </Button>
          <p className="hidden font-heading text-sm font-bold text-muted-foreground sm:block">{roleLabels[role]} Dashboard</p>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Button asChild variant="ghost" className="h-10 rounded-full px-3">
              <Link href="/">
                <House aria-hidden="true" className="size-4" /> <span className="hidden sm:inline">Home</span>
              </Link>
            </Button>
            <ThemeToggle />
            <div className="hidden text-right leading-tight md:block">
              <p className="max-w-44 truncate text-sm font-semibold text-foreground">{session.user.name}</p>
              <RoleBadge role={role} className="mt-0.5" />
            </div>
            <UserMenu user={session.user} />
          </div>
        </header>

        <main id="main-content" className="w-full flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {areaRole && areaRole !== role ? <Forbidden role={role} area={areaRole} /> : children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ role, pathname, onClose }: { role: UserRole; pathname: string; onClose: () => void }) {
  const { signOut, isSigningOut } = useSignOut();
  const links = dashboardLinks[role];

  return (
    <>
      <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-border px-5">
        <FixMateLogo />
        <Button type="button" variant="ghost" size="icon" aria-label="Close dashboard menu" onClick={onClose} className="size-9 rounded-full lg:hidden">
          <X aria-hidden="true" className="size-[18px]" />
        </Button>
      </div>
      <nav aria-label="Dashboard" className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{roleLabels[role]} menu</p>
        <ul className="space-y-1">
          {links.map(({ label, href, icon: Icon }) => {
            // The overview matches exactly; other sections also match their sub-pages.
            const isActive = href === dashboardHome(role) ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/75 hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <Icon aria-hidden="true" className="size-[18px] shrink-0" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="space-y-1 border-t border-border p-3">
        <Link href="/" className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-foreground/75 transition-colors hover:bg-secondary hover:text-foreground">
          <House aria-hidden="true" className="size-[18px]" /> Back to Home
        </Link>
        <button
          type="button"
          onClick={() => void signOut()}
          disabled={isSigningOut}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-error transition-colors hover:bg-error/10 disabled:opacity-60"
        >
          <LogOut aria-hidden="true" className="size-[18px]" /> {isSigningOut ? "Signing out…" : "Sign Out"}
        </button>
      </div>
    </>
  );
}

/** Shown when a signed-in user opens another role's dashboard area. */
function Forbidden({ role, area }: { role: UserRole; area: UserRole }) {
  return (
    <div role="alert" className="mx-auto mt-10 max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-error/10 text-error">
        <ShieldX aria-hidden="true" className="size-7" />
      </span>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-error">403 · Forbidden</p>
      <h1 className="mt-2 font-heading text-2xl font-extrabold tracking-[-0.04em] text-foreground">This area is for {roleLabels[area].toLowerCase()}s</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        You’re signed in with a {roleLabels[role].toLowerCase()} account, so you don’t have access to this page.
      </p>
      <Button asChild className="mt-6 h-11 rounded-full px-6">
        <Link href={dashboardHome(role)}>Go to my dashboard</Link>
      </Button>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading your dashboard" className="min-h-dvh bg-secondary/40 lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <div className="hidden border-r border-border bg-card p-5 lg:block">
        <Skeleton className="h-9 w-32 rounded-lg" />
        <div className="mt-8 space-y-2">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-11 rounded-xl" />
          ))}
        </div>
      </div>
      <div>
        <div className="flex h-[68px] items-center justify-end gap-3 border-b border-border bg-background px-6">
          <Skeleton className="size-10 rounded-full" />
        </div>
        <div className="space-y-4 p-6 lg:p-8">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

/** /dashboard sends each role to its own overview. */
export function DashboardHome() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  useEffect(() => {
    if (session) router.replace(dashboardHome(session.user.role));
  }, [session, router]);
  return <p className="text-sm text-muted-foreground">Opening your dashboard…</p>;
}
