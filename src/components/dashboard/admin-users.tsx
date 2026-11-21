"use client";

import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { UserAvatar } from "@/components/auth/user-identity";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DataState, PageHeader, Pager, selectClassName, StatusBadge } from "@/components/dashboard/dashboard-ui";
import { useApiQuery } from "@/components/dashboard/use-api-query";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { ApiError, apiRequest } from "@/lib/api-client";
import { authClient, type UserRole } from "@/lib/auth-client";
import type { AdminUser, Paged } from "@/lib/dashboard-types";
import { formatDate } from "@/lib/format";
import { roleLabels } from "@/lib/navigation";

const roles = Object.keys(roleLabels) as UserRole[];
const errorMessage = (error: unknown) => (error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
const articleFor = (role: UserRole) => (role === "admin" ? "an" : "a");

type PendingChange = { user: AdminUser; kind: "role"; role: UserRole } | { user: AdminUser; kind: "status"; status: AdminUser["status"] };

/** Manage Users: every account, with role changes (never your own) and suspend / reactivate. */
export function AdminUsers() {
  const { data: session } = authClient.useSession();
  const [role, setRole] = useState<UserRole | "">("");
  const [search, setSearch] = useState("");
  const [draftSearch, setDraftSearch] = useState("");
  const [page, setPage] = useState(1);
  const query = new URLSearchParams({ page: String(page), ...(role ? { role } : {}), ...(search ? { search } : {}) });
  const { data, error, isLoading, reload } = useApiQuery<Paged<AdminUser>>(`/api/admin/users?${query.toString()}`);

  const [pending, setPending] = useState<PendingChange | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(draftSearch.trim());
    setPage(1);
  }

  async function confirmChange() {
    if (!pending) return;
    setIsSaving(true);
    try {
      if (pending.kind === "role") {
        await apiRequest(`/api/admin/users/${pending.user._id}/role`, { method: "PATCH", body: { role: pending.role } });
        toast.success(`${pending.user.name} is now ${articleFor(pending.role)} ${roleLabels[pending.role].toLowerCase()}.`);
      } else {
        await apiRequest(`/api/admin/users/${pending.user._id}/status`, { method: "PATCH", body: { status: pending.status } });
        toast.success(pending.status === "suspended" ? `${pending.user.name} is suspended and signed out.` : `${pending.user.name} is active again.`);
      }
      setPending(null);
    } catch (caught) {
      toast.error(errorMessage(caught));
    } finally {
      setIsSaving(false);
      reload();
    }
  }

  const columns: Column<AdminUser>[] = [
    {
      header: "User",
      className: "min-w-[240px]",
      cell: (user) => (
        <div className="flex items-center gap-3">
          <UserAvatar name={user.name} image={user.image} className="size-10" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">
              {user.name}
              {user._id === session?.user.id ? <span className="ml-1.5 text-xs font-normal text-muted-foreground">(you)</span> : null}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      cell: (user) => {
        const isSelf = user._id === session?.user.id;
        return (
          <select
            aria-label={`Role for ${user.name}`}
            value={user.role}
            disabled={isSelf}
            title={isSelf ? "You can’t change your own role" : undefined}
            onChange={(event) => setPending({ user, kind: "role", role: event.target.value as UserRole })}
            className={selectClassName}
          >
            {roles.map((value) => (
              <option key={value} value={value}>
                {roleLabels[value]}
              </option>
            ))}
          </select>
        );
      },
    },
    { header: "Status", cell: (user) => <StatusBadge status={user.status} /> },
    { header: "Joined", cell: (user) => <span className="whitespace-nowrap tabular-nums">{formatDate(user.createdAt)}</span> },
    {
      header: "Access",
      hideLabelOnMobile: true,
      cell: (user) =>
        user.role === "admin" ? (
          <span className="text-xs text-muted-foreground">Admins can’t be suspended</span>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => setPending({ user, kind: "status", status: user.status === "active" ? "suspended" : "active" })}
            className={user.status === "active" ? "h-9 w-full rounded-lg px-3 text-error md:w-auto" : "h-9 w-full rounded-lg px-3 md:w-auto"}
          >
            {user.status === "active" ? "Suspend" : "Reactivate"}
          </Button>
        ),
    },
  ];

  const dialog = (() => {
    if (!pending) return { title: "", description: null, confirm: "", destructive: false };
    if (pending.kind === "role") {
      return {
        title: "Change this user’s role?",
        description: (
          <>
            <strong className="text-foreground">{pending.user.name}</strong> will change from {roleLabels[pending.user.role]} to{" "}
            <strong className="text-foreground">{roleLabels[pending.role]}</strong>. Their dashboard and permissions change on their next request.
          </>
        ),
        confirm: "Change role",
        destructive: false,
      };
    }
    return pending.status === "suspended"
      ? {
          title: "Suspend this account?",
          description: (
            <>
              <strong className="text-foreground">{pending.user.name}</strong> will be signed out everywhere and can’t sign in until reactivated. Their services are
              hidden from the public pages.
            </>
          ),
          confirm: "Suspend",
          destructive: true,
        }
      : {
          title: "Reactivate this account?",
          description: (
            <>
              <strong className="text-foreground">{pending.user.name}</strong> will be able to sign in and use FixMate again.
            </>
          ),
          confirm: "Reactivate",
          destructive: false,
        };
  })();

  return (
    <>
      <PageHeader title="Manage Users" description="Everyone with a FixMate account. Change a user’s role, or suspend an account to sign it out and block access." />
      <form role="search" aria-label="Filter users" onSubmit={submitSearch} className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="user-search" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            Search by name or email
          </label>
          <Input id="user-search" type="search" value={draftSearch} onChange={(event) => setDraftSearch(event.target.value)} className="h-10 bg-background" />
        </div>
        <div>
          <label htmlFor="user-role" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            Role
          </label>
          <select
            id="user-role"
            value={role}
            onChange={(event) => {
              setRole(event.target.value as UserRole | "");
              setPage(1);
            }}
            className={`${selectClassName} w-full sm:w-40`}
          >
            <option value="">All roles</option>
            {roles.map((value) => (
              <option key={value} value={value}>
                {roleLabels[value]}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" className="h-10 rounded-lg px-4">
          <Search aria-hidden="true" className="size-4" /> Search
        </Button>
      </form>
      <p aria-live="polite" className="mt-4 text-sm tabular-nums text-muted-foreground">
        {data ? `${data.total} ${data.total === 1 ? "user" : "users"}` : ""}
      </p>
      <DataState isLoading={isLoading} error={error} isEmpty={!data || data.items.length === 0} emptyTitle="No users found" emptyDescription="Try a different search or role." onRetry={reload}>
        {data ? <DataTable caption="Users" rows={data.items} columns={columns} rowKey={(user) => user._id} /> : null}
        {data ? <Pager page={data.page} pageCount={data.pageCount} onChange={setPage} /> : null}
      </DataState>

      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
        title={dialog.title}
        description={dialog.description}
        confirmLabel={dialog.confirm}
        cancelLabel="Cancel"
        destructive={dialog.destructive}
        isBusy={isSaving}
        onConfirm={confirmChange}
      />
    </>
  );
}
