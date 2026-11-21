"use client";

import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut, UserRoundPen } from "lucide-react";
import { RoleBadge, UserAvatar } from "@/components/auth/user-identity";
import { useSignOut } from "@/components/auth/use-sign-out";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AuthSession } from "@/lib/auth-client";
import { dashboardHome } from "@/lib/navigation";

/** Navbar avatar that opens the account menu: name, role badge, Dashboard, Update Profile and Sign Out. */
export function UserMenu({ user }: { user: AuthSession["user"] }) {
  const { signOut, isSigningOut } = useSignOut();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Account menu for ${user.name}`}
        className="group flex items-center gap-1.5 rounded-full p-0.5 pr-2 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent data-[state=open]:bg-secondary"
      >
        <UserAvatar name={user.name} image={user.image} className="size-10" />
        <ChevronDown aria-hidden="true" className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-3">
          <UserAvatar name={user.name} image={user.image} className="size-11" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{user.name}</span>
            <span className="block truncate text-xs font-normal text-muted-foreground">{user.email}</span>
            <RoleBadge role={user.role} className="mt-1.5" />
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={dashboardHome(user.role)}>
            <LayoutDashboard aria-hidden="true" /> Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile">
            <UserRoundPen aria-hidden="true" /> Update Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isSigningOut}
          // Keep the menu open until sign-out finishes; the toast confirms it.
          onSelect={(event) => {
            event.preventDefault();
            void signOut();
          }}
          className="text-error focus:bg-error/10 [&_svg]:text-error"
        >
          <LogOut aria-hidden="true" /> {isSigningOut ? "Signing out…" : "Sign Out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
