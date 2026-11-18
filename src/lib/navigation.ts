export const publicNavLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
] as const;

export function isActiveNavLink(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

export const authRoutes = {
  signIn: "/login",
  register: "/register",
  technicianRegister: "/register?type=technician",
} as const;

export const roleLabels = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
} as const;

/**
 * Accepts only same-site relative paths ("/services/x"), so a crafted `?next=` link cannot send
 * someone to another website after signing in. Anything else falls back to the homepage.
 */
export function safeRedirectPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/";
  return value;
}

/** Adds a `next` return path to an auth route, except where returning makes no sense. */
export function withReturnPath(route: string, pathname: string) {
  const isAuthPage = pathname === authRoutes.signIn || pathname === authRoutes.register;
  if (pathname === "/" || isAuthPage) return route;
  const separator = route.includes("?") ? "&" : "?";
  return `${route}${separator}next=${encodeURIComponent(pathname)}`;
}
