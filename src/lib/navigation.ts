export const publicNavLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
] as const;

export function isActiveNavLink(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

export const authRoutes = {
  signIn: "/sign-in",
  register: "/sign-up",
  technicianRegister: "/sign-up?role=technician",
} as const;

export const roleLabels = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
} as const;

/**
 * Accepts only same-site relative paths ("/services/x"), so a crafted `?next=` link cannot send
 * someone to another website after signing in. Anything else returns `fallback`.
 */
export function safeRedirectPath<T extends string | null = "/">(value: string | null | undefined, fallback: T = "/" as T) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  return value;
}

/** Adds a `next` return path to an auth route, except where returning makes no sense. */
export function withReturnPath(route: string, pathname: string) {
  const isAuthPage = pathname === authRoutes.signIn || pathname === authRoutes.register;
  if (pathname === "/" || isAuthPage) return route;
  const separator = route.includes("?") ? "&" : "?";
  return `${route}${separator}next=${encodeURIComponent(pathname)}`;
}

export type DashboardLink = { label: string; href: string };

/** Where each role lands after signing in, and the target of "Dashboard" links. */
export function dashboardHome(role: keyof typeof roleLabels) {
  return dashboardLinks[role][0].href;
}

/** Dashboard sections per role. The first entry is each role's dashboard home. */
export const dashboardLinks = {
  customer: [
    { label: "My requests", href: "/dashboard/bookings" },
    { label: "Profile", href: "/dashboard/profile" },
  ],
  technician: [
    { label: "Jobs", href: "/dashboard/jobs" },
    { label: "My services", href: "/dashboard/services" },
    { label: "Profile", href: "/dashboard/profile" },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin" },
    { label: "Service approvals", href: "/dashboard/admin/services" },
    { label: "Users", href: "/dashboard/admin/users" },
    { label: "Bookings", href: "/dashboard/admin/bookings" },
    { label: "Profile", href: "/dashboard/profile" },
  ],
} as const satisfies Record<keyof typeof roleLabels, DashboardLink[]>;
