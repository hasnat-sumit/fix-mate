export const publicNavLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
] as const;

export function isActiveNavLink(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

export type PlannedNavLink = {
  label: string;
  /** Set to the real route (e.g. "/login") once the page exists; `null` renders a "coming soon" placeholder. */
  href: string | null;
};

/** Authentication destinations that are planned but not built yet. */
export const plannedAuthLinks: Record<"signIn" | "technicianSignup", PlannedNavLink> = {
  signIn: { label: "Sign in", href: null },
  technicianSignup: { label: "Join FixMate", href: null },
};
