"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/dashboard-ui";
import { ServiceForm } from "@/components/dashboard/service-form";

/** Add a Service: saved as "pending" + available, then waits for admin approval. */
export function TechnicianAddService() {
  const router = useRouter();

  return (
    <>
      <PageHeader title="Add a Service" description="List a new repair service. It appears on the public pages once an admin approves it." />
      <div className="mt-6 max-w-3xl rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <ServiceForm
          onSaved={(service) => {
            toast.success("Service submitted!", { description: `“${service.title}” is waiting for admin approval.` });
            router.push("/dashboard/technician/my-services");
          }}
        />
      </div>
    </>
  );
}
