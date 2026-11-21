// Response shapes of the authenticated API endpoints used by the dashboards (see fixmate-server: src/modules).

import type { UserRole } from "@/lib/auth-client";

export type Paged<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  pageCount: number;
};

export const bookingStatuses = ["requested", "accepted", "in-progress", "completed", "rejected", "cancelled"] as const;
export type BookingStatus = (typeof bookingStatuses)[number];
export type PaymentStatus = "unpaid" | "paid";

/** A booking (repair job) as the API returns it. Service, technician and customer details are copies. */
export type Booking = {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  /** ISO date-time at UTC midnight of the chosen calendar day. */
  preferredDate: string;
  problemDescription: string;
  status: BookingStatus;
  finalAmount: number;
  paymentStatus: PaymentStatus;
  statusHistory: { status: BookingStatus | "paid"; changedAt: string }[];
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
};

/** A payment record (the payments collection). */
export type Payment = {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: "usd";
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: "paid";
  paidAt: string;
};

export type CustomerStats = {
  totalRequests: number;
  activeJobs: number;
  completedJobs: number;
  totalPaid: number;
  byStatus: Record<BookingStatus, number>;
};

export type TechnicianStats = {
  totalServices: number;
  approvedServices: number;
  pendingRequests: number;
  totalEarned: number;
  byStatus: Record<BookingStatus, number>;
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
  _id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  phone: string;
  area: string;
  bio: string;
  createdAt: string;
};

export type AdminStats = {
  users: Record<UserRole, number> & { suspended: number };
  services: Record<ApprovalStatus, number>;
  bookings: Record<string, number>;
  revenue: { amount: number; payments: number };
};
