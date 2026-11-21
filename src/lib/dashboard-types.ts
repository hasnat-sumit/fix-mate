// Response shapes of the authenticated API endpoints used by the dashboards (see server/src/modules).

import type { UserRole } from "@/lib/auth-client";

export type Paged<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  pageCount: number;
};

export type BookingStatus = "pending" | "accepted" | "in_progress" | "completed" | "rejected" | "cancelled";
export const bookingStatuses: BookingStatus[] = ["pending", "accepted", "in_progress", "completed", "rejected", "cancelled"];

export type Booking = {
  id: string;
  service: { id: string; title: string; category: string; price: number };
  amount: number;
  preferredDate: string;
  problemDescription: string;
  address: string;
  contactPhone: string;
  status: BookingStatus;
  paymentStatus: "unpaid" | "paid";
  review: { rating: number; comment: string; createdAt: string } | null;
  statusHistory: { status: BookingStatus; role: UserRole; note: string | null; at: string }[];
  customer: { id: string | null; name: string };
  technician: { id: string | null; name: string };
  createdAt: string;
  updatedAt: string;
};

export type ApprovalStatus = "pending" | "approved" | "rejected";

/** A service as its technician (or an admin) sees it, including moderation state. */
export type OwnerService = {
  id: string;
  title: string;
  category: string;
  description: string;
  details: string;
  price: number;
  image: string;
  includes: string[];
  availability: string;
  approvalStatus: ApprovalStatus;
  rejectionReason: string | null;
  isActive: boolean;
  isFeatured: boolean;
  ratingAverage: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminService = OwnerService & { technician: { id: string | null; name: string; email: string } };

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "suspended";
  createdAt: string;
};

export type Profile = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  area: string;
  bio: string;
  createdAt: string;
};

export type AdminStats = {
  users: Record<UserRole, number> & { suspended: number };
  services: Record<ApprovalStatus, number>;
  bookings: Record<BookingStatus, number>;
  revenue: { amount: number; payments: number };
};
