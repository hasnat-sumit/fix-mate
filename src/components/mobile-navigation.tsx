"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { isActiveNavLink, publicNavLinks } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type MobileNavigationProps = {
  onNavigate: () => void;
};

export function MobileNavigation({ onNavigate }: MobileNavigationProps) {
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
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <Link href="/#footer" onClick={onNavigate} className="px-3 text-sm font-semibold text-muted-foreground hover:text-foreground">
          Sign in
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button asChild className="h-11 rounded-full px-5">
            <Link href="/services" onClick={onNavigate}>
              Get started <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
