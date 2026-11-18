"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Container } from "@/components/container";
import { FixMateLogo } from "@/components/fixmate-logo";
import { MobileNavigation } from "@/components/mobile-navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { isActiveNavLink, publicNavLinks } from "@/lib/navigation";

export function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <Container className="relative flex h-[72px] items-center justify-between gap-5">
        <FixMateLogo />

        <nav aria-label="Main navigation" className="hidden items-center gap-5 md:flex lg:gap-8">
          {publicNavLinks.map((link) => {
            const isActive = isActiveNavLink(pathname, link.href);

            return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`relative py-2 text-sm font-semibold transition-colors after:absolute after:inset-x-0 after:-bottom-[1px] after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-accent after:transition-transform hover:text-accent hover:after:scale-x-100 ${isActive ? "text-foreground after:scale-x-100" : "text-muted-foreground"}`}
            >
              {link.label}
            </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex lg:gap-3">
          <ThemeToggle />
            <Link href="/#footer" className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            Sign in
          </Link>
          <Button asChild className="h-11 rounded-full px-4 lg:px-5">
            <Link href="/services">
              Get started <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="size-11 rounded-full border-border bg-card"
          >
            {isMenuOpen ? <X aria-hidden="true" className="size-[18px]" /> : <Menu aria-hidden="true" className="size-[18px]" />}
          </Button>
        </div>
        {isMenuOpen ? <MobileNavigation onNavigate={() => setIsMenuOpen(false)} /> : null}
      </Container>
    </header>
  );
}
