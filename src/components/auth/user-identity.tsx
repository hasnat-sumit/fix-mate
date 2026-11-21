import Image from "next/image";
import type { UserRole } from "@/lib/auth-client";
import { roleLabels } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? `${parts[0]?.[0] ?? ""}${parts.at(-1)?.[0] ?? ""}` : (parts[0]?.slice(0, 2) ?? "");
  return letters.toUpperCase() || "?";
}

/** Profile photo (ImgBB) when the user has one, otherwise their initials. Decorative: pair it with the name. */
export function UserAvatar({ name, image, className }: { name: string; image?: string | null; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-xs font-bold text-accent-foreground",
        className,
      )}
    >
      {image ? <Image src={image} alt="" fill sizes="48px" className="object-cover" /> : initials(name)}
    </span>
  );
}

const roleBadgeStyles: Record<UserRole, string> = {
  customer: "bg-information/12 text-information ring-information/25",
  technician: "bg-accent/12 text-accent ring-accent/25",
  admin: "bg-warning/15 text-[color-mix(in_oklch,var(--warning),var(--foreground)_35%)] ring-warning/30",
};

/** The account type as a small colored badge (Customer / Technician / Admin). */
export function RoleBadge({ role, className }: { role: UserRole; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ring-inset", roleBadgeStyles[role], className)}>
      {roleLabels[role]}
    </span>
  );
}

type UserIdentityProps = {
  name: string;
  role: UserRole;
  image?: string | null;
};

/** Avatar with the user's name and role badge. */
export function UserIdentity({ name, role, image }: UserIdentityProps) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <UserAvatar name={name} image={image} className="size-10" />
      <span className="min-w-0 leading-tight">
        <span className="block max-w-48 truncate text-sm font-semibold text-foreground">{name}</span>
        <RoleBadge role={role} className="mt-1" />
      </span>
    </span>
  );
}
