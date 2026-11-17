"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Container } from "@/components/container";
import { FixMateLogo } from "@/components/fixmate-logo";
import { MobileNavigation } from "@/components/mobile-navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#categories" },
  { label: "About", href: "#how-it-works" },
];

export function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <Container className="relative flex h-[72px] items-center justify-between gap-5">
        <FixMateLogo />

        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={index === 0 ? "page" : undefined}
              className={`relative py-2 text-sm font-semibold transition-colors after:absolute after:inset-x-0 after:-bottom-[1px] after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-accent after:transition-transform hover:text-accent hover:after:scale-x-100 ${index === 0 ? "text-foreground after:scale-x-100" : "text-muted-foreground"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link href="#footer" className="rounded-md px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            Sign in
          </Link>
          <Button asChild className="h-11 rounded-full px-5">
            <Link href="#categories">
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
            className="size-10 rounded-full border-border bg-card"
          >
            {isMenuOpen ? <X aria-hidden="true" className="size-[18px]" /> : <Menu aria-hidden="true" className="size-[18px]" />}
          </Button>
        </div>
        {isMenuOpen ? <MobileNavigation onNavigate={() => setIsMenuOpen(false)} /> : null}
      </Container>
    </header>
  );
}
