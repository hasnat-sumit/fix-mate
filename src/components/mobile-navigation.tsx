"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

type MobileNavigationProps = {
  onNavigate: () => void;
};

const links = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#categories" },
  { label: "About", href: "#how-it-works" },
];

export function MobileNavigation({ onNavigate }: MobileNavigationProps) {
  return (
    <div id="mobile-navigation" className="absolute inset-x-0 top-full border-b border-border bg-card px-5 pb-5 pt-3 shadow-lg md:hidden">
      <nav aria-label="Mobile navigation" className="flex flex-col">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className="rounded-lg px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <Link href="#footer" onClick={onNavigate} className="px-3 text-sm font-semibold text-muted-foreground hover:text-foreground">
          Sign in
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button asChild className="h-11 rounded-full px-5">
            <Link href="#categories" onClick={onNavigate}>
              Get started <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
