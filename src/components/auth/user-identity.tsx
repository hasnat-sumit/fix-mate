import type { UserRole } from "@/lib/auth-client";
import { roleLabels } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? `${parts[0]?.[0] ?? ""}${parts.at(-1)?.[0] ?? ""}` : (parts[0]?.slice(0, 2) ?? "");
  return letters.toUpperCase() || "?";
}

type UserIdentityProps = {
  name: string;
  role: UserRole;
  /** Hide the name and role below the `lg` breakpoint (the avatar stays, with an accessible name). */
  compact?: boolean;
};

/** Avatar initials with the user's name and account type. */
export function UserIdentity({ name, role, compact = false }: UserIdentityProps) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground"
      >
        {initials(name)}
      </span>
      <span className={cn("min-w-0 leading-tight", compact && "sr-only lg:not-sr-only")}>
        <span className="block max-w-40 truncate text-sm font-semibold text-foreground">{name}</span>
        <span className="block text-xs text-muted-foreground">{roleLabels[role]} account</span>
      </span>
    </span>
  );
}
