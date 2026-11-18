import Link from "next/link";
import type { PlannedNavLink } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type PlannedLinkProps = {
  link: PlannedNavLink;
  className?: string;
  onNavigate?: () => void;
};

/** Renders a real link once the destination exists, otherwise a non-navigating "coming soon" placeholder. */
export function PlannedLink({ link, className, onNavigate }: PlannedLinkProps) {
  if (link.href) {
    return (
      <Link href={link.href} onClick={onNavigate} className={className}>
        {link.label}
      </Link>
    );
  }

  return (
    <span
      aria-disabled="true"
      title={`${link.label} is coming soon`}
      className={cn(className, "inline-flex cursor-not-allowed items-center gap-1.5 text-muted-foreground hover:text-muted-foreground")}
    >
      {link.label}
      <span aria-hidden="true" className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        Soon
      </span>
      <span className="sr-only">(coming soon)</span>
    </span>
  );
}
