import { BadgeCheck, CirclePlus, ClipboardList, CreditCard, LayoutDashboard, Receipt, UserRoundPen, Users, Wrench, type LucideIcon } from "lucide-react";

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

export type DashboardLink = { label: string; href: string; icon: LucideIcon };

/** The customer’s booking list (linked after a repair request). */
export const myBookingsHref = "/dashboard/customer/bookings";

/** Each role’s dashboard overview: where they land after signing in, and the target of "Dashboard" links. */
export function dashboardHome(role: keyof typeof roleLabels) {
  return `/dashboard/${role}`;
}

const profileLink = { label: "Update Profile", href: "/dashboard/profile", icon: UserRoundPen };

/** Sidebar menu per role. The first entry is the role’s overview page. */
export const dashboardLinks = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { label: "My Bookings", href: "/dashboard/customer/bookings", icon: ClipboardList },
    { label: "Payment History", href: "/dashboard/customer/payments", icon: CreditCard },
    profileLink,
  ],
  technician: [
    { label: "Overview", href: "/dashboard/technician", icon: LayoutDashboard },
    { label: "Add Service", href: "/dashboard/technician/add-service", icon: CirclePlus },
    { label: "My Services", href: "/dashboard/technician/my-services", icon: Wrench },
    { label: "Manage Requests", href: "/dashboard/technician/requests", icon: ClipboardList },
    profileLink,
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Service Approval", href: "/dashboard/admin/services", icon: BadgeCheck },
    { label: "All Bookings", href: "/dashboard/admin/bookings", icon: ClipboardList },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: Receipt },
    profileLink,
  ],
} as const satisfies Record<keyof typeof roleLabels, DashboardLink[]>;

/** The role whose dashboard area a path belongs to (null for shared pages such as /dashboard/profile). */
export function dashboardAreaRole(pathname: string): keyof typeof roleLabels | null {
  const segment = pathname.split("/")[2];
  return segment === "customer" || segment === "technician" || segment === "admin" ? segment : null;
}
