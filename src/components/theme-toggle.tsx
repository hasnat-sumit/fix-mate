"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  function toggleTheme() {
    const nextTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.colorScheme = nextTheme;

    try {
      localStorage.setItem("fixmate-theme", nextTheme);
    } catch {
      // The theme remains usable when browser storage is unavailable.
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      title="Toggle color theme"
      className="size-11 rounded-full border-border bg-card text-foreground hover:bg-secondary"
    >
      <Moon aria-hidden="true" className="size-[17px] dark:hidden" />
      <Sun aria-hidden="true" className="hidden size-[17px] dark:block" />
    </Button>
  );
}
