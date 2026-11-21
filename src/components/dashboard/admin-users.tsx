"use client";

import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { FormAlert } from "@/components/auth/auth-form-parts";
import { DataState, PageHeader, Pager, StatusBadge, selectClassName } from "@/components/dashboard/dashboard-ui";
import { useApiQuery } from "@/components/dashboard/use-api-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError, apiRequest } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import type { AdminUser, Paged } from "@/lib/dashboard-types";
import { formatDateTime } from "@/lib/format";
import { roleLabels } from "@/lib/navigation";

type Filters = { role: string; status: string; q: string };

export function AdminUsers() {
  const { data: session } = authClient.useSession();
  const [filters, setFilters] = useState<Filters>({ role: "", status: "", q: "" });
  const [draftQuery, setDraftQuery] = useState("");
  const [page, setPage] = useState(1);
  const search = new URLSearchParams({ page: String(page) });
  for (const [key, value] of Object.entries(filters)) if (value) search.set(key, value);
  const { data, error, isLoading, reload } = useApiQuery<Paged<AdminUser>>(`/api/admin/users?${search.toString()}`);

  function setFilter(key: keyof Filters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFilter("q", draftQuery.trim());
  }

  return (
    <>
      <PageHeader title="Users" description="Everyone with a FixMate account. Suspended users are signed out and can’t sign in or use the API." />
      <form role="search" aria-label="Filter users" onSubmit={submitSearch} className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto] lg:items-end">
        <div>
          <label htmlFor="user-search" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            Name or email
          </label>
          <Input id="user-search" type="search" value={draftQuery} onChange={(event) => setDraftQuery(event.target.value)} className="h-10 bg-background" />
        </div>
        <div>
          <label htmlFor="user-role" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            Account type
          </label>
          <select id="user-role" value={filters.role} onChange={(event) => setFilter("role", event.target.value)} className={`${selectClassName} w-full`}>
            <option value="">All</option>
            {Object.entries(roleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="user-status" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            Status
          </label>
          <select id="user-status" value={filters.status} onChange={(event) => setFilter("status", event.target.value)} className={`${selectClassName} w-full`}>
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <Button type="submit" className="h-10 rounded-lg px-4">
          <Search aria-hidden="true" className="size-4" /> Search
        </Button>
      </form>
      <p aria-live="polite" className="mt-4 text-sm tabular-nums text-muted-foreground">
        {data ? `${data.total} ${data.total === 1 ? "account" : "accounts"}` : ""}
      </p>
      <DataState
        isLoading={isLoading}
        error={error}
        isEmpty={!data || data.items.length === 0}
        emptyTitle="No matching accounts"
        emptyDescription="Try a different search or filter."
        onRetry={reload}
      >
        <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {data?.items.map((user) => (
            <li key={user.id}>
              <UserRow user={user} isSelf={user.id === session?.user.id} onChanged={reload} />
            </li>
          ))}
        </ul>
        {data ? <Pager page={data.page} pageCount={data.pageCount} onChange={setPage} /> : null}
      </DataState>
    </>
  );
}

function UserRow({ user, isSelf, onChanged }: { user: AdminUser; isSelf: boolean; onChanged: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canChange = user.role !== "admin" && !isSelf;
  const nextStatus = user.status === "active" ? "suspended" : "active";

  async function changeStatus() {
    setIsBusy(true);
    setError(null);
    try {
      await apiRequest(`/api/admin/users/${user.id}`, { method: "PATCH", body: { status: nextStatus } });
      setConfirming(false);
      onChanged();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Something went wrong. Please try again.");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-semibold text-foreground">
          {user.name} {isSelf ? <span className="text-sm font-normal text-muted-foreground">(you)</span> : null}
        </p>
        <p className="break-all text-sm text-muted-foreground">{user.email}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {roleLabels[user.role]} · Joined <time dateTime={user.createdAt}>{formatDateTime(user.createdAt)}</time>
        </p>
        {error ? (
          <div className="mt-2">
            <FormAlert>{error}</FormAlert>
          </div>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <StatusBadge status={user.status} />
        {canChange ? (
          confirming ? (
            <>
              <Button type="button" variant={nextStatus === "suspended" ? "destructive" : "default"} disabled={isBusy} onClick={changeStatus} className="h-9 rounded-lg px-3">
                {isBusy ? "Saving…" : nextStatus === "suspended" ? `Confirm suspend` : "Confirm reactivate"}
              </Button>
              <Button type="button" variant="outline" disabled={isBusy} onClick={() => setConfirming(false)} className="h-9 rounded-lg px-3">
                Cancel
              </Button>
            </>
          ) : (
            <Button type="button" variant="outline" onClick={() => setConfirming(true)} className="h-9 rounded-lg px-3" aria-label={`${nextStatus === "suspended" ? "Suspend" : "Reactivate"} ${user.name}`}>
              {nextStatus === "suspended" ? "Suspend" : "Reactivate"}
            </Button>
          )
        ) : null}
      </div>
    </div>
  );
}
